# Personal Power II Journal

A local-first, offline-capable Progressive Web App for completing the **Anthony Robbins Personal Power II** 30-day program. All data is stored in your browser's IndexedDB — no account, no server, no tracking.

---

## Features

- 📅 **30-day schema-driven program** — every day rendered from typed data
- 🧠 **Emotional memory layer** — Evidence Timeline, Confidence Bank, Saved Beliefs, Greatest Successes
- 🔥 **Journey board** — visual 30-tile progress grid with streak tracking and milestone markers
- ☀️ **Morning rituals** — accordion Q&A for Morning Power Questions, income ideas, breathing & diet
- ⚡ **Engagement systems** — celebration overlays, recovery dialog, install prompt
- 📵 **Offline-first** — full PWA with service worker, installable, no network dependency
- 💾 **Export/Import** — full JSON backup and restore

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install
```bash
npm install
```

### Local Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

> **Note:** The service worker is disabled in dev mode. To test PWA behavior locally, use `npm run preview` after building.

### Build
```bash
npm run build
```
Output is in `dist/`.

### Preview Production Build Locally
```bash
npm run preview
```

---

## Deploy to GitHub Pages

### One-time Setup

1. **Enable GitHub Pages** in your repo settings:
   - Go to **Settings → Pages**
   - Source: **GitHub Actions**

2. **Set the base path variable** (required for sub-directory deployments):
   - Go to **Settings → Variables → Actions**
   - Create a variable: `VITE_BASE_PATH` = `/<your-repo-name>/`
   - Example: `/personal-power-2/`
   - If using a custom domain at root, use `/`

3. **Push to `main`** — the workflow runs automatically.

### Manual Deploy
```bash
# Trigger a deployment manually from GitHub Actions tab
# or push a commit to main
git push origin main
```

### Workflow File
`.github/workflows/deploy.yml` — builds with Node 20, passes `VITE_BASE_PATH`, uploads `dist/` as Pages artifact.

---

## SPA Routing on GitHub Pages

GitHub Pages serves static files only and doesn't support server-side routing. This app uses:

- **`base: './'`** in `vite.config.ts` for relative asset paths
- **Workbox `navigateFallback: 'index.html'`** to handle all SPA routes in the service worker

> After install, all routes (`/today`, `/journey`, `/day/3`, etc.) resolve correctly through the service worker cache. On first load before SW install, a hard-refresh of a deep link will return 404. Workaround: always link to the root URL for first-time sharing.

---

## Setting the Base Path

| Deployment target | `VITE_BASE_PATH` value |
|---|---|
| `username.github.io/repo-name/` | `/repo-name/` |
| Custom domain root | `/` |
| Local preview | `./` (default) |

Set the variable in GitHub → Settings → Variables → Repository variables → `VITE_BASE_PATH`.

---

## Troubleshooting Offline Issues

| Symptom | Fix |
|---|---|
| App doesn't load offline | Open the app once while online; the SW caches everything on first visit |
| Old version still showing | The SW auto-updates (`registerType: 'autoUpdate'`); force refresh or clear cache |
| Routes 404 after deploy | Ensure `VITE_BASE_PATH` matches the repo sub-path exactly, including trailing `/` |
| Install prompt not appearing | Must be served over HTTPS; prompt appears automatically after criteria are met |
| Data lost after reinstall | Export a backup first from Settings → Data → Export Backup |

---

## Architecture

```
src/
├── components/
│   ├── day/          # DayScreen, GuidedAssignmentIntro, DayProgressPill
│   ├── engagement/   # CelebrationLayer, MilestoneCard, RecoveryDialog
│   ├── journey/      # JourneyGrid, JourneyTile, StreakCard, MomentumBanner
│   ├── layout/       # AppShell, Header, BottomNav
│   ├── review/       # ConfidenceBankCard, EvidenceTimeline, GreatestSuccessesPanel
│   ├── rituals/      # RitualCard, MorningQuestionsPanel, HabitOverlayCard
│   ├── settings/     # ReminderSettings
│   ├── system/       # InstallPromptCard
│   ├── tasks/        # TaskRenderer + all 12 task primitives
│   ├── today/        # TodayHeader, TaskList, CarryForwardStrip, NotesPanel
│   └── weekend/      # WeekendModeCard, BonusSessionCard, AffirmationSession
├── data/             # programDays, recurringRituals, bonusSessions, rawProgramContent
├── lib/              # programEngine, ritualEngine, progressEngine, engagementEngine, pwa
├── pages/            # TodayPage, JourneyPage, DayPage, RitualsPage, ReviewPage, SettingsPage
├── store/            # appStore (Zustand + IndexedDB), selectors, evidenceSelectors
└── types/            # program.ts, state.ts, evidence.ts
```

---

## Final QA Checklist

- [x] Routing — all 6 routes resolve; 404 page for unknown paths
- [x] Mobile layout — 44px touch targets, safe-area insets, no overflow
- [x] Form autosave — all task inputs debounce/immediate save to IndexedDB
- [x] Day completion logic — required task gating, day mark, celebration overlay
- [x] Carry-forward habits — ritualEngine computes active habits by day; auto-shown on Today
- [x] PWA installability — valid manifest, service worker registered, HTTPS required
- [x] Accessibility — semantic HTML, ARIA labels on interactive elements, focus states
- [x] Empty states — all panels have onboarding/empty copy
- [x] Export/Import — JSON backup download + file restore
- [x] Offline fallback — Workbox `navigateFallback` covers all routes after first load

---

## License

Personal use. Program content © Anthony Robbins Research International.
