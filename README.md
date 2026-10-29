# Apex Auto Works — single-page garage website

A fast, framework-free website for a local auto mechanic, deployable on Vercel.
Everything on the page — copy, services, prices, reviews, hours, colours, fonts,
SEO tags and the LocalBusiness structured data — renders from one file:
[`site.config.js`](site.config.js). Reskin it for a new client by editing that
file; you rarely need to touch the HTML, CSS or JS.

## What's in the box

```
├── index.html          # Shell + <head> bootstrap (title/meta/OG/JSON-LD from config)
├── site.config.js      # ← EDIT THIS. The single source of truth.
├── styles.css          # Design system (colours/fonts come from config at load)
├── app.js              # Renders every section from the config; form + animations
├── api/
│   └── contact.js      # Vercel serverless function → emails the form via Resend
├── scripts/
│   └── fetch-images.js # Optional: download free-licence photos into /images
├── images/             # Drop real photos here; otherwise SVG fallbacks are used
├── vercel.json         # Clean URLs + basic security headers
├── .env.example        # Copy to .env for local dev
├── CREDITS.md          # Image sources & licences
└── package.json
```

- **No build step.** Plain HTML/CSS/vanilla JS. Open `index.html` to preview the
  page (the contact form needs the serverless function, see below).
- **No photos required.** Every image slot has an original inline SVG
  illustration, so the page looks finished with zero image files. Drop a real
  photo into `/images` with the expected filename and it replaces the SVG
  automatically — no code change.

## Reskin it for a new client

Open [`site.config.js`](site.config.js) and change:

- **Identity**: `name`, `tagline`, `hero.headline`, `intro`, `legalName`.
- **Contact**: `phoneDisplay` / `phoneDial` (E.164), `email`, `address`, `geo`.
- **Content**: `services`, `reasons`, `process`, `reviews`, `pricing`, `faq`,
  `serviceArea`, `hours`, `stats`, `socials`.
- **Branding**: `theme.colors` (one accent + steel/paper neutrals) and
  `theme.fonts`. If you change fonts, also update the Google Fonts `<link>` in
  `index.html`.
- **SEO**: `seo.url` (your real domain — used for canonical + Open Graph),
  `seo.title`, `seo.description`, `seo.ogImage`.

Service tiles pick their icon by name (`icon: "brakes"` etc.); available icons:
`diagnostics, service, brakes, tyre, ac, battery` (plus `quote, wrench, shield,
car` for the "why" section). Add more in the `ICONS` map in `app.js`.

## Images (optional)

The page ships with SVG illustrations. To use real photos instead:

1. **With an API key** — get a free key from
   [Pexels](https://www.pexels.com/api/) or
   [Unsplash](https://unsplash.com/developers), put it in `.env`:
   ```
   PEXELS_API_KEY=your_key_here
   ```
   then run:
   ```bash
   npm run fetch-images
   ```
   It downloads the best match for each slot, saves it with the right filename,
   compresses it (if [`sharp`](https://sharp.pixelplumbing.com/) is installed:
   `npm i sharp`), and records credits in `CREDITS.md`.

2. **Manually** — drop JPGs into `/images` named exactly:
   `hero-workshop.jpg`, `workshop.jpg`, `team.jpg`. Keep them ≤ ~1600px wide and
   ~300 KB. Then set `images.usePhotos: true` in `site.config.js` (one line) and
   add their source/licence to `CREDITS.md`. (The `fetch-images` script sets the
   flag for you.)

The `usePhotos` flag keeps the page request-free when there are no photos (clean
console, pure SVG). With it on, any individual photo that's missing or fails
still falls back to its SVG illustration — nothing breaks.

## Deploy to Vercel

### Option A — Git (recommended)

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. In [Vercel](https://vercel.com/new), **Add New → Project** and import the repo.
3. Framework preset: **Other** (no build command, no output dir — it's static +
   serverless functions in `/api`). Leave the defaults; Vercel detects `/api`.
4. Add **Environment Variables** (Project → Settings → Environment Variables):

   | Name | Required | Example | Notes |
   |------|----------|---------|-------|
   | `RESEND_API_KEY` | ✅ | `re_xxx` | From [resend.com](https://resend.com) |
   | `CONTACT_TO_EMAIL` | ✅ | `hello@apexautoworks.co.uk` | Where enquiries land |
   | `CONTACT_FROM_EMAIL` | optional | `Apex <hello@yourdomain.co.uk>` | Must be a Resend-verified domain in production |

   Add them for **Production** (and Preview/Development if you want). Redeploy
   after adding env vars so they take effect.
5. **Deploy.** Your site is live. Add your custom domain under Project →
   Domains, then set `seo.url` in `site.config.js` to that domain and redeploy.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel          # first run links/creates the project (preview deploy)
vercel env add RESEND_API_KEY
vercel env add CONTACT_TO_EMAIL
vercel --prod   # production deploy
```

## Local development

The static page works by just opening `index.html`, but the contact form POSTs
to `/api/contact`, which needs the Vercel runtime:

```bash
npm i -g vercel
cp .env.example .env     # fill in RESEND_API_KEY + CONTACT_TO_EMAIL
vercel dev               # serves the page AND the function at http://localhost:3000
```

Without keys configured, the form validates and then returns a friendly
"not configured yet" message — expected in local/dev.

## The contact form

`api/contact.js` handles `POST /api/contact` and:

- accepts **POST only** (405 otherwise);
- **validates** name, email and message, returning field-level errors (422);
- has a **hidden honeypot** field (`company`) — if filled, it silently succeeds
  and sends nothing;
- applies **best-effort rate limiting** (5 requests / 10 min per IP, per warm
  instance);
- sends via **Resend** using `RESEND_API_KEY`, to `CONTACT_TO_EMAIL`, with the
  sender's address as `reply_to`;
- returns friendly JSON so the front-end shows success/error **without a page
  reload**.

> Rate limiting is in-memory and resets when the function cold-starts or scales
> out. For high-traffic sites, back it with a shared store (e.g. Upstash Redis)
> or Vercel's firewall — the honeypot + validation already stop most spam.

## Accessibility & performance notes

- Semantic landmarks, a skip link, labelled form fields, `aria-live` status, and
  visible keyboard focus throughout.
- `prefers-reduced-motion` is respected — scroll animations and hover transforms
  switch off.
- Images are lazy-loaded; the map iframe is lazy-loaded; fonts use
  `display=swap`.
- Colour palette is checked for contrast (dark ink on light paper; dark text on
  the amber accent).

## Secrets

No secret is ever hardcoded. Keys live only in environment variables (`.env`
locally, Vercel project settings in production). `.env` is gitignored.

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
