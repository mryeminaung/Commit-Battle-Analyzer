# Commit Battle Analyzer

Put two GitHub profiles head-to-head and see who wins on public signals — repos, audience reach, activity — on a retro sports scoreboard.

## Quick start

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:3000`).

Other scripts:

```bash
pnpm build    # typecheck + production build
pnpm preview  # serve the production build
pnpm lint     # ESLint
```

## How it works

1. Enter two GitHub usernames (or click a preset matchup).
2. The app loads each profile from the GitHub API (demo matchups use local mock data).
3. Power / activity scores are derived from public profile stats.
4. The board shows the score strip, winner banner, and side-by-side cards.

Mock logins resolve instantly without hitting the API: `torvalds`, `dan-abramov`, `yyx990803`, `rich-harris`, `microsoft`, `gaearon`.

## Features

- **Shareable battles** — matchups sync to the URL as `?a=torvalds&b=dan-abramov`
- **Swap players** — button next to Battle, or press `S` outside inputs
- **Loading skeleton** — scoreboard-shaped placeholder while data loads
- **Recent bouts** — last 6 battles stored in `sessionStorage`; click to replay, Clear to wipe
- **Explain score** — expand a card to see how power was calculated (repos / followers / activity weights)
- **Light / dark mode** — toggle in the top bar; preference is saved and applied before first paint

## Optional GitHub token

Unauthenticated GitHub API calls are limited to **60/hour**. A token raises that to **5000/hour**.

```bash
cp .env.example .env
# edit .env and set VITE_GITHUB_TOKEN=ghp_...
```

Restart `pnpm dev` after changing env files.

> **Note:** Vite inlines `VITE_*` values into the client bundle. Anyone who opens DevTools can read the token. Fine for local/demo use; if you ship this publicly with a real token, proxy the GitHub calls through a backend instead.

`.env` and `secrets/` are gitignored. Only commit `.env.example`.

## Design

Retro scoreboard look — flat surfaces, amber accents, condensed broadcast type. Dark is the default; light mode uses a warm paper palette with the same layout.

| Token | Dark | Light |
| --- | --- | --- |
| Background | `#14161A` | `#F2EFE6` |
| Panel | `#1B1E24` | `#FFFCF5` |
| Ink | `#F2EFE6` | `#14161A` |
| Amber (text) | `#F5A623` | `#B45309` |
| Amber (fill) | `#F5A623` | `#F5A623` |
| Score red | `#D64545` | `#B33030` |

- **Type:** Barlow Condensed (display) + Barlow (body)
- **Tailwind v4** via `@tailwindcss/vite`; semantic tokens switch on `html.dark` (`@theme inline` + CSS variables in `src/index.css`)
- Theme stored in `localStorage` (`cba:theme`); first visit follows `prefers-color-scheme`
- No gradients, glows, or glassmorphism — hard borders and solid blocks only

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
