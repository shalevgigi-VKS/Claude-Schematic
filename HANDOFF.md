# Evolution Schematic — HANDOFF
Last updated: 2026-04-03

## מצב נוכחי
- פרויקט ID: 8 (בתיקייה 8_EvolutionSchematic)
- מצב: **פעיל — React + Vite + Vercel production** ✅
- URL: https://evolution-schematic.vercel.app
- Stack: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- Data: `data/snapshot.json` → `scanner/gen_react_data.py` → `react-app/src/data/mindMapData.ts`

## הצעד הבא
- בדוק שהאתר עולה תקין ב-iPhone
- פיפליין אוטומטי כל יום ראשון: `scanner/run_weekly.ps1` (scan → gen data → build → deploy → push)

## החלטות מחייבות
- אסור לגעת בהגדרות GitHub Pages — הושבת לחלוטין (2026-04-03)
- React app חי ב-`react-app/` — אסור לערוך `mindMapData.ts` ידנית, תמיד דרך `gen_react_data.py`
- גיבוי vanilla D3 שמור ב-`backup/vanilla-d3-2026-04-02/`

## מה הושלם
- **React migration הושלם (2026-04-03)** — mind-map-system.zip → react-app/
- SVG bezier connectors מחוברים לפי DOM positions אמיתיות (useLayoutEffect)
- App.tsx עודכן לשם "אבולוציה סכמטית"
- `scanner/gen_react_data.py` נוצר — ממיר snapshot.json → mindMapData.ts אוטומטית
- `scanner/run_weekly.ps1` עודכן — 5 שלבים: scan → gen → build → deploy → push
- GitHub Pages הושבת (DELETE API)
- Vercel deployed & aliased: evolution-schematic.vercel.app
- גיבוי D3 ישן שמור ב-backup/vanilla-d3-2026-04-02/
- workflow evolution-schematic-update תוקן (2026-03-29)

## Build
```bash
cd react-app
pnpm build          # TypeScript + Vite
vercel deploy --prod --yes
```

## לא לשנות
- `backup/vanilla-d3-2026-04-02/` — גיבוי D3 הישן, לא למחוק
