# Handover: adirar.github.io

Status as of 1 November 2026. Rules and architecture are in `CLAUDE.md`; this file is the project state.

## Kickoff prompt

Paste this into Claude Code from the repository folder:

> You're taking over my portfolio site, adirar.github.io. Read CLAUDE.md and HANDOVER.md first.
> Then give me a short summary of where the project stands, list anything you need from me,
> and propose a plan for the next sprint. Don't push anything to main until I approve the plan.

## Where things stand

| Sprint | Goal | Status |
| --- | --- | --- |
| 0 | Discovery, positioning, visual direction | Done. Option D chosen |
| 1 | First live version | Live since 1 Nov 2026. Waiting for the owner's review on his phone |
| 2 | Projects and video | Next |
| 3 | Credibility (experience timeline, evidence links) | Not started. Publications already done |
| 4 | Polish and reach (SEO, analytics, domain, accessibility) | Not started |
| 5+ | Ongoing updates | Not started |

What is live: editor-style hero (Hierarchy, Scene/Game, Inspector, Timeline/Console/Project, status bar),
three track views (/, /ai/, /xr/), Things I've built (6 projects), Publications (12 peer-reviewed plus
2 theses), Skills and Certificates, Lab kit, Connect, dark and light skins, a styled 404 page, robots.txt, sitemap.xml.

The last broken-link audit (1 Nov 2026) found nothing dead. It fixed: stylesheet 404s after deploys (old hashed
assets are now kept in `_astro/`), Coursera links now go to `/verify/` pages, MS thesis link now goes to the
open-access copy at https://hdl.handle.net/10217/212037, and robots.txt, sitemap.xml and 404.html were added.

## Next sprint (2): projects and video

Goal: replace the low-resolution stand-in images with real footage, without putting large files in the repository.

1. Ask the owner to put his full-resolution and unpublished videos in a `videos` folder inside his
   OneDrive "Website" folder, with one line per video on what it shows. Review the unpublished ones with him.
2. For each project, cut from the full-resolution video:
   - a 4–8 second silent loop for the project card and Scene view (720p, H.264 MP4 plus WebM, under 2 MB),
   - a poster frame (JPEG or WebP, under 150 KB) to replace `public/images/projects/*.jpg`.
3. Cut a 20–40 second highlight reel (1080p, under 8 MB). Decide with the owner whether the toolbar Play
   button should play it instead of the YouTube playlist.
4. Give "Predicting cognitive load in VR" and "Adaptive Friend Agent" real footage (they show SVG art now).
5. Full-length demos stay on YouTube; unpublished ones can be uploaded as Unlisted.

Limits: GitHub blocks files over 100 MB and Pages sites over 1 GB, so no full-resolution video in the repo.
The current project images are 800×450 captures of YouTube thumbnails; the ARtisan Bistro one has a title
burned in.

Example encode for a card loop (adjust start time and crop):
```
ffmpeg -ss 00:00:12 -t 6 -i source.mp4 -an -vf "scale=1280:-2,fps=30" -c:v libx264 -preset veryfast -crf 26 -movflags +faststart loop.mp4
```

## Later sprints (backlog)

- **Sprint 3, credibility**
  - Add an experience and education timeline from the CV:
    - Postdoc, University of Delaware HCI Lab, Jan 2025 to now
    - Graduate research assistant, Colorado State University, Aug 2018 to Dec 2024
    - Adjunct professor and technical mentor, Colorado State University, Aug 2018 to Dec 2024 (200+ students mentored)
    - PhD 2020–2024, MS 2017–2020, BE 2013–2017
  - Link skill chips to the projects that prove them.
  - Write a small script that converts the Scholar BibTeX export to `publications.json`.
- **Sprint 4, polish and reach**
  - Add a designed 1200×630 link-preview image (the current one is a crop of the headshot).
  - Get Lighthouse to 90+ and run an accessibility pass in both skins.
  - Add real brand icons for LinkedIn, GitHub and YouTube from an icon package.
  - Owner decisions needed: analytics (Cloudflare Web Analytics or GoatCounter) and whether to buy a custom domain.
  - Run an SEO pass; the SearchFit SEO plugin is installed in the owner's Claude.
- **Ongoing**
  - Keep the Console log (`site.json > logs`) current with new papers and roles.
  - Keep the site in sync with the CV.

## Waiting on the owner

- [ ] Review the live site on his phone and send changes (closes Sprint 1).
- [ ] Full-resolution and unpublished videos, with a line each (needed for Sprint 2).
- [ ] Photos of his lab devices (AR headset, VR headset, eye tracker, EEG cap, phone) and the project each was used in.
  The Lab kit shows generic outline icons until then.
- [ ] Confirm which signals the CNN-GRU cognitive-load model used. The site says gaze tracking and behavioral logs.
- [x] EEG: confirmed by the owner on 1 Nov 2026. He recorded EEG with a Muse headband, so the EEG mentions on the
  site stand. The Lab kit still calls the device an "EEG cap"; rename it when the Lab kit is reworked.
- [x] Image rights: the owner confirmed on 1 Nov 2026 that he holds the rights to the headshot and project images.
  He will supply high-resolution replacements later.
- [ ] Public resume PDFs, one for Applied AI/ML and one for Spatial computing/XR. The download button stays off until then.
- [ ] His master CV and resume still mention fNIRS and "13 peer-reviewed works". He plans to update them to match the site.

## Reference

- Live site: https://adirar.github.io (views: /ai/ and /xr/)
- Repository: https://github.com/adirar/adirar.github.io (branch `main`; the Claude GitHub App is installed on it)
- Strategy doc, the living plan with sprint statuses (private, owner's claude.ai account): https://claude.ai/artifact/DbLEpYNeVLZUxddaeFTsqc
- Design canvas with Options A–D (private): https://claude.ai/artifact/NRUqssSGn7A8PtgZcqXzyR
- YouTube playlist "Project Demos": `PLRTdJM22ga0HdjqeX8G2KMl1YThJGbN5b`
  - `bxwuPqLUAXo`: ARtisan Bistro demo
  - `63hNEb4o_tU`: AR notification design v2
  - `9y4TCTmgtCM`: AR notification design v1
  - `imjkdcwqTsc`: ISMAR 2023 presentation (imperfect AI cues)
  - `3qTYalJ1mQE`: VR soccer concussion demo
- Google Scholar: https://scholar.google.com/citations?user=JmcUBGsAAAAJ (blocks automated access; ask the owner for a BibTeX export)
- The owner keeps a snapshot copy in his OneDrive "Website\portfolio-site" folder. It is not a git clone; refresh it
  at the end of each sprint if he asks.

## Design history (why it looks this way)

- Sprint 0 explored three directions on the canvas: A "Anchored" (AR callouts over footage), B "Signal"
  (research-instrument look with live traces), C "Bistro" (bold, playful).
- The owner chose a mix, Option D:
  - A's contact block, B's moving graph and C's project cards
  - inside a 3D-engine-editor interface, made darker and more beige at his request
- Reference sites he picked, and what each contributed:
  - joonassandell.com: overall look, warm neutrals, regular-weight large type, pill buttons, a "Now" line
  - alejandro-gomez.vercel.app: tiles that light up under the cursor, now the Scene floor grid
  - hiteshsahu.com: skill and certificate sections; his percentage bars became "used in N of 6 projects"
  - attiq.design/inventory: objects that drop in and come into focus, now the Lab kit
- Owner requests applied since then: evenly spaced timeline milestones, no fNIRS anywhere, a dark default skin
  with a light skin toggle, and no resume download for now.
