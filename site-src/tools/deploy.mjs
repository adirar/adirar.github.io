// Build the site and copy it to the repository root, which GitHub Pages serves.
// Works on Windows, macOS and Linux: run `npm run deploy` from site-src/.
import { execSync } from 'node:child_process';
import { cpSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = resolve(SRC, '..');

// Never removed from the repository root. `_astro` keeps older hashed CSS/JS so pages
// cached by browsers or GitHub's CDN (up to 10 minutes) still find their assets.
const KEEP = new Set(['.git', '.github', '.claude', '.gitignore', 'site-src', '_astro', 'README.md', 'CLAUDE.md', 'HANDOVER.md']);

execSync('npm run build', { cwd: SRC, stdio: 'inherit' });

for (const name of readdirSync(ROOT)) {
  if (!KEEP.has(name)) rmSync(join(ROOT, name), { recursive: true, force: true });
}
cpSync(join(SRC, 'dist'), ROOT, { recursive: true });
writeFileSync(join(ROOT, '.nojekyll'), '');
console.log('Deployed build to ' + ROOT + '. Review with `git status`, then commit and push.');
