# RPGym landing / waitlist site

Plain HTML + CSS + JS. No build step, no framework, no AI-credit platform —
open `index.html` directly in a browser to preview, or drop the whole folder
onto any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3 —
all have free tiers) to publish it.

## Files

- `index.html` — the landing page (hero, mission, how it works, classes, waitlist form)
- `privacy.html` — the privacy policy page
- `css/styles.css` — all styling and the color system (single ember accent, edit the `:root` variables to re-skin)
- `js/waitlist.js` — waitlist form logic

## Backend: Google Sheets

Waitlist signups are written to a Google Sheet via a Google Apps Script Web
App. **One-time setup required in your own Google account** — see
`GOOGLE_SHEETS_SETUP.md` for exact copy-paste steps (create the sheet, paste
the provided script, deploy it, drop the URL into `js/waitlist.js`).

Until that URL is filled in, the form falls back to storing signups in the
visitor's own browser (`localStorage`) so it's still testable end-to-end.

Keep the privacy contract already written into `privacy.html`: only email +
consent + timestamp are collected, nothing else, no analytics or tracking
scripts anywhere on the site.

## Naming caveat

The site currently says "RPGym" everywhere. Per the team's pitch deck, that's
still a working title pending a 3-founder vote (other options: Anvilled,
Ripped Grimmers, Barbells & Basilisks, Gain or Slain). Do a find-and-replace
across `index.html`, `privacy.html`, and the `<title>`/meta tags once the
name is locked in.
