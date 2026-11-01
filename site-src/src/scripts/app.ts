type Track = 'both' | 'ai' | 'xr';
interface SiteData {
  order: Record<Track, string[]>;
  playlistId: string;
  milestones: string[];
  tracks: Record<Track, { title: string; path: string }>;
  projects: Record<string, { title: string; video: string }>;
  kit: Record<string, { name: string; text: string }>;
}

const data: SiteData = JSON.parse(document.getElementById('site-data')!.textContent || '{}');
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel as any) as T | null;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel as any)) as T[];

let sel = 'root';
let track = (document.body.dataset.track as Track) || 'both';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Selection: hierarchy, milestones, assets and Step all call this */
const narrow = window.matchMedia('(max-width: 900px)');
const editor = document.querySelector<HTMLElement>('[data-editor]');

function select(id: string, from?: HTMLElement) {
  sel = id;
  if (editor) editor.dataset.sel = id;
  $$('[data-select]').forEach((el) => el.setAttribute('aria-pressed', String(el.dataset.select === id)));
  $$('[data-pane-insp]').forEach((el) => (el.hidden = el.dataset.paneInsp !== id));
  setView('scene');
  const i = data.milestones.indexOf(id);
  const head = $('[data-playhead]');
  if (head) {
    head.hidden = i < 0;
    if (i >= 0) head.style.left = ((i + 0.5) / data.milestones.length) * 100 + '%';
  }
  setStatus(id === 'root' ? 'Ready' : 'Selected: ' + data.projects[id].title);
  if (narrow.matches && from && !from.closest('.view')) {
    document.querySelector('.view')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
}

function setStatus(text: string) {
  const s = $('[data-status]');
  if (s) s.textContent = text;
}

/* Scene and Game views */
const slot = $('[data-game-slot]')!;
const game = $('[data-game]')!;
const playBtn = $('[data-play]');

function embedUrl() {
  const v = sel !== 'root' ? data.projects[sel]?.video : '';
  return v
    ? `https://www.youtube-nocookie.com/embed/${v}?autoplay=1&rel=0`
    : `https://www.youtube-nocookie.com/embed/videoseries?list=${data.playlistId}&autoplay=1&rel=0`;
}

function renderGame(autoplay: boolean) {
  slot.textContent = '';
  const v = sel !== 'root' ? data.projects[sel]?.video : '';
  const label = v ? data.projects[sel].title : 'All project demos';
  if (autoplay) {
    const f = document.createElement('iframe');
    f.src = embedUrl();
    f.title = 'Demo video: ' + label;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    slot.appendChild(f);
    setStatus('Playing: ' + label);
    playBtn?.setAttribute('aria-pressed', 'true');
    return;
  }
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'game-start';
  b.innerHTML = '<span class="play" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 14 14"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg></span>';
  const t = document.createElement('span');
  t.textContent = 'Play ' + (v ? 'the ' + label + ' demo' : 'all project demos');
  const small = document.createElement('small');
  small.textContent = sel !== 'root' && !v ? 'This project has no public video yet, so this plays the full playlist.' : 'Plays from YouTube';
  b.append(t, small);
  b.addEventListener('click', () => renderGame(true));
  slot.appendChild(b);
}

function setView(view: 'scene' | 'game', autoplay = false) {
  const isGame = view === 'game';
  $$('[data-view]').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.view === view)));
  $$('[data-pane-scene]').forEach((el) => (el.hidden = isGame || el.dataset.paneScene !== sel));
  game.hidden = !isGame;
  if (isGame) renderGame(autoplay);
  else {
    slot.textContent = '';
    playBtn?.setAttribute('aria-pressed', 'false');
  }
}

$$('[data-select]').forEach((el) => el.addEventListener('click', () => select(el.dataset.select!, el)));
$$('[data-view]').forEach((el) => el.addEventListener('click', () => setView(el.dataset.view as 'scene' | 'game')));
$$('[data-watch]').forEach((el) => el.addEventListener('click', () => setView('game', true)));
playBtn?.addEventListener('click', () => (game.hidden ? setView('game', true) : setView('scene')));
$('[data-pause]')?.addEventListener('click', () => {
  setView('scene');
  setStatus(sel === 'root' ? 'Ready' : 'Selected: ' + data.projects[sel].title);
});
$('[data-step]')?.addEventListener('click', () => {
  const order = data.order[track];
  const next = sel === 'root' ? order[0] : order[(order.indexOf(sel) + 1) % order.length];
  select(next);
});

/* Decorative transform tools */
$$('[data-tool]').forEach((b) =>
  b.addEventListener('click', () => $$('[data-tool]').forEach((o) => o.setAttribute('aria-pressed', String(o === b))))
);

/* Hierarchy search */
$<HTMLInputElement>('[data-search]')?.addEventListener('input', (e) => {
  const q = (e.target as HTMLInputElement).value.trim().toLowerCase();
  $$('.node.ord').forEach((n) => (n.hidden = !!q && !(n.dataset.label || '').includes(q)));
});

/* Bottom panel tabs */
const hints: Record<string, string> = {
  timeline: 'Milestones in order. Click one to open it.',
  console: 'Recent updates',
  assets: 'Click an asset to open it'
};
$$('[data-bottom]').forEach((tab) =>
  tab.addEventListener('click', () => {
    const k = tab.dataset.bottom!;
    $$('[data-bottom]').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    $$('[data-bottom-pane]').forEach((p) => (p.hidden = p.dataset.bottomPane !== k));
    const h = $('[data-bottom-hint]');
    if (h) h.textContent = hints[k];
  })
);

/* Arrow keys move between tabs in a tablist */
$$('[role="tablist"]').forEach((list) =>
  list.addEventListener('keydown', (e) => {
    const ev = e as KeyboardEvent;
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
    const tabs = $$('[role="tab"]', list);
    const i = tabs.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    n.focus();
    n.click();
  })
);

/* Work index: pointing at, focusing or clicking a name shows that project in the side frame */
function activate(id: string) {
  $$('[data-proj-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.projBtn === id)));
  $$('[data-proj-body]').forEach((b) => b.classList.toggle('on', b.dataset.projBody === id));
}
$$('[data-proj-btn]').forEach((b) => {
  const go = () => activate(b.dataset.projBtn!);
  b.addEventListener('pointerenter', go);
  b.addEventListener('focus', go);
  b.addEventListener('click', go);
});
$$('[data-proj-link]').forEach((a) => a.addEventListener('click', () => activate(a.dataset.projLink!)));
activate(data.order[track][0]);

/* Hiring-for track: instant switch, real URLs */
function applyTrack(t: Track, push: boolean) {
  // Jumping to a #section also fires popstate; only a real track change resets the work frame
  const changed = t !== track;
  track = t;
  document.body.dataset.track = t;
  document.title = data.tracks[t].title;
  $$('[data-track-link]').forEach((a) => {
    if (a.dataset.trackLink === t) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (push && location.pathname !== data.tracks[t].path) history.pushState({ track: t }, '', data.tracks[t].path);
  if (changed) activate(data.order[t][0]);
}
$$('[data-track-link]').forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault();
    applyTrack(a.dataset.trackLink as Track, true);
  })
);
window.addEventListener('popstate', () => {
  const t = (Object.keys(data.tracks) as Track[]).find((k) => data.tracks[k].path === location.pathname) || 'both';
  applyTrack(t, false);
});

/* Skin: dark by default, remembered on this browser */
const skinBtn = $('[data-skin-toggle]');
function paintSkinLabel() {
  const dark = document.documentElement.dataset.skin !== 'light';
  const l = $('[data-skin-label]');
  if (l) l.textContent = dark ? 'Light skin' : 'Dark skin';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1c1916' : '#e9e0cf');
}
skinBtn?.addEventListener('click', () => {
  const next = document.documentElement.dataset.skin === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.skin = next;
  try {
    localStorage.setItem('skin', next);
  } catch (e) {}
  paintSkinLabel();
});
paintSkinLabel();

/* Scene floor: a wave of lit tiles spreads from the front on the first load of a visit */
const floor = $('.floor');
if (floor && !reduceMotion && getComputedStyle(floor).display !== 'none') {
  let seen = false;
  try {
    seen = sessionStorage.getItem('floorWave') === '1';
    sessionStorage.setItem('floorWave', '1');
  } catch (e) {}
  if (!seen) {
    const cols = 32;
    const rows = 14;
    $$('div', floor).forEach((c, i) => {
      const x = i % cols;
      const y = Math.floor(i / cols);
      c.style.setProperty('--wd', Math.round(300 + Math.hypot(x - (cols - 1) / 2, (rows - 1 - y) * 1.6) * 45) + 'ms');
    });
    floor.classList.add('wave');
    setTimeout(() => floor.classList.remove('wave'), 2900);
  }
}

/* Narrow menu closes once a link is chosen */
const menu = $<HTMLDetailsElement>('[data-menu]');
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => (menu.open = false)));

/* Section parts rise in once, staggered within each section */
const reveals = $$('[data-reveal]');
if ('IntersectionObserver' in window) {
  $$('section').forEach((s) => $$('[data-reveal]', s).forEach((el, i) => el.style.setProperty('--rd', Math.min(i, 6) * 70 + 'ms')));
  const ro = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0 }
  );
  reveals.forEach((el) => ro.observe(el));
} else reveals.forEach((el) => el.classList.add('is-in'));

/* Skills: one name in each sentence is lit at a time */
if (!reduceMotion) {
  $$('[data-cycle]').forEach((g, gi) => {
    const items = $$('.sk-i', g);
    let i = gi;
    setInterval(() => {
      items.forEach((it, j) => it.classList.toggle('lit', j === i % items.length));
      i++;
    }, 2000);
  });
}

/* Lab kit: objects drop in when the section scrolls into view; one can be focused */
const grid = $('[data-kit-grid]');
if (grid) {
  const items = $$('[data-kit]', grid);
  if (!reduceMotion && 'IntersectionObserver' in window) {
    items.forEach((it) => it.classList.add('pre'));
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        items.forEach((it, i) => {
          it.style.animationDelay = (i * 0.12).toFixed(2) + 's';
          it.classList.remove('pre');
          it.classList.add('drop');
        });
        io.disconnect();
      },
      { threshold: 0.15 }
    );
    io.observe(grid);
  }
  items.forEach((it) =>
    it.addEventListener('click', () => {
      const on = it.getAttribute('aria-pressed') !== 'true';
      items.forEach((o) => o.setAttribute('aria-pressed', String(on && o === it)));
      if (on) grid.dataset.focus = it.dataset.kit!;
      else delete grid.dataset.focus;
      const k = data.kit[it.dataset.kit!];
      $('[data-kit-title]')!.textContent = on ? k.name : 'Select an object';
      $('[data-kit-text]')!.textContent = on ? k.text : 'Pick one of the devices above to see how I have used it.';
    })
  );
}
