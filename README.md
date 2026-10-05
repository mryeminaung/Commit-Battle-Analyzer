# Commit Battle Analyzer

Put two GitHub profiles head-to-head and see who wins on public signals — repos, audience reach, activity — on a retro sports scoreboard.

Run a duel, fill a tournament bracket, rank a whole roster in standings, or go one-on-one with a boss legend.

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

1. Pick a mode (Duel by default) and enter GitHub usernames — or click a preset / demo lineup.
2. The app loads each profile from the GitHub API. Demo matchups use local mock data and resolve instantly.
3. Power and activity scores are derived from public profile stats.
4. The board shows the score strip, winner banner, and side-by-side cards — or a full bracket / ranked board, depending on mode.

### Modes

| Mode | What you get |
| --- | --- |
| **Duel** | Two profiles, one battle. Shareable URL, swap players, score breakdown, weekly card. |
| **Tournament** | Random knockout bracket for 2–16 players. Play match-by-match or auto-simulate; BYE padding to a power-of-two. Match detail panel + champion podium. |
| **Standings** | Score every listed fighter once and rank the board (power → followers → login). Failed logins show up at the bottom with errors. |
| **Boss** | Your handle vs a roster legend — a single high-stakes fight on the same battle pipeline. |

Mode is synced to the URL as `?mode=tournament` (and remembered for the session).

### Scoring

Each profile gets sub-scores (capped at 100), then a weighted power score:

| Signal | Weight | Source |
| --- | --- | --- |
| Repos | 40% | `publicRepos / 40` |
| Followers | 25% | `followers / 150_000` |
| Activity | 35% | Heuristic from repos, followers, and account age |

`powerScore = repos×0.40 + followers×0.25 + activity×0.35` (rounded, max 100).

- **Duel winner:** higher power score; ties are a draw.
- **Tournament winner:** power → followers → public repos → activity → left advances (deterministic ties).

Use **Explain score** on a profile card to see the live breakdown and weights.

## Features

### Battle & duel

- **Shareable battles** — matchups sync to the URL as `?a=torvalds&b=dan-abramov`; share button uses the Web Share API, then clipboard
- **Swap players** — button next to Battle, or press `S` outside inputs
- **Loading skeleton** — scoreboard-shaped placeholder while data loads
- **Recent bouts** — last 6 battles in `sessionStorage`; click to replay, Clear to wipe
- **Explain score** — expand a card to see how power was calculated
- **Presets** — one-click matchups (Linus vs Dan, Evan vs Rich, Microsoft vs Dan)
- **Weekly battle** — a rotating mock-card matchup for the current ISO week (`?week=2026-W40`)

### Tournament & standings

- **Demo lineups** — prefill 4, 6, or 16 fighters for Tournament / Standings setup
- **Auto-simulate** — run the whole bracket without clicking each match
- **Match detail** — per-match score breakdown in the tournament view
- **Standings board** — ranked power scores with failed-login section
- **Champion podium** — winner + runner-up after the final

### Boss mode

- Fight a named legend from the mock roster (Linus, Dan, Evan, Rich, Microsoft, …)
- Same scoring pipeline as duel — a clean single-boss test

### Profiles & UI

- **Light / dark mode** — toggle in the top bar; preference is saved and applied before first paint
- **Custom avatars** — pick from bundled options per login (`localStorage` key `cba:avatars`); reset supported
- **Profile cache** — in-memory, 15-minute TTL, so tournaments don't refetch the same user twice
- **Error banner** — rate-limit-aware messages with retry
- **URL persistence** — duel pairs, mode, and `?players=` lineups

### URL parameters

| Param | Meaning |
| --- | --- |
| `?a=` / `?b=` | Duel pair (e.g. `?a=torvalds&b=dan-abramov`) |
| `?week=2026-W40` | Weekly card for a specific ISO week |
| `?mode=tournament` | Open in Tournament (also `standings`, `boss`) |
| `?players=a,b,c` | Prefill Tournament / Standings lineup |

Example: [Tournament with demo 6](/?mode=tournament&players=torvalds,dan-abramov,yyx990803,rich-harris,microsoft,gaearon)

## Demo & offline data

Mock logins resolve instantly without hitting the API (used by presets, weekly cards, Boss mode, and demo tournaments):

`torvalds`, `dan-abramov`, `yyx990803`, `rich-harris`, `microsoft`, `gaearon`

Any other username loads live from the GitHub API and needs network access.

## Optional GitHub token

Unauthenticated GitHub API calls are limited to **60/hour**. A token raises that to **5000/hour** — recommended for large tournaments.

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
- Vite 8 (dev server on port 3000)
- Tailwind CSS 4
