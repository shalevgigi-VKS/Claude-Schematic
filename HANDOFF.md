# Evolution Schematic — HANDOFF
Last updated: 2026-04-03 (session 3)

## מצב נוכחי
- פרויקט ID: 8 (בתיקייה 8_EvolutionSchematic)
- מצב: **פעיל — React + Vite + Vercel production** ✅
- URL: https://evolution-schematic.vercel.app
- Stack: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- Data: `data/snapshot.json` → `scanner/gen_react_data.py` → `react-app/src/data/mindMapData.ts`

## הצעד הבא
- לאמת שה-auto-deploy מ-GitHub push מגיש את React (rootDirectory=react-app מוגדר ב-Vercel API)
- פיפליין אוטומטי כל יום ראשון: `scanner/run_weekly.ps1` (scan → gen data → build → deploy → push)

## החלטות מחייבות
- אסור לגעת בהגדרות GitHub Pages — הושבת לחלוטין (2026-04-03)
- React app חי ב-`react-app/` — אסור לערוך `mindMapData.ts` ידנית, תמיד דרך `gen_react_data.py`
- גיבוי vanilla D3 שמור ב-`backup/vanilla-d3-2026-04-02/`
- **D3 files נמחקו מ-root** (2026-04-03) — index.html, css/, js/, assets/ נמחקו
- **Vercel rootDirectory = react-app** — הוגדר דרך API (prj_HzJnkA77hH633kKVTitpgAJ0PjBX)
- **פריסה ידנית**: `cd 8_EvolutionSchematic && vercel deploy --prod --yes` (מה-root, לא מ-react-app/)

## שינויים אחרונים (session 3 — 2026-04-03)
- **Vercel rootDirectory תוקן לצמיתות** — Vercel API + D3 files נמחקו; auto-deploy תמיד React
- **SVG connectors** — ResizeObserver + timeout 700ms; מתוקנים גם ב-expand-all
- **אחוזי zoom הוסרו** — `zoom-level` span הוסר מ-App.tsx
- **התראות iPhone** — deploy-notify.yml: "אבולוציה סכמטית — עודכן ✅" ללא גוף הודעה
- **GitHub Actions תוקן** — deploy-notify.yml הסיר GitHub Pages deploy; רק notify על push
- **SVG connectors תוקנו** — NodeConnectors עבר ל-mind-map-node-wrapper; callback ref
- **Descriptions לכל node** — 30+ תיאורי סוכנים + 13 תיאורי סקילים ב-gen_react_data.py
- **NotebookLM animations** — פתיחה + סגירה, stagger, auto-center
- **שני כפתורים קבועים** — הרחב הכל / כווץ הכל (bottom-left, fixed)
- **שכבה 3 בעמודה** — level >= 2 מוצג כ-column-layout
- **התראות iPhone אחידות** — כל הפרויקטים: "ProjectName — עודכן ✅" בלבד

## מה הושלם
- **React migration הושלם (2026-04-03)** — mind-map-system.zip → react-app/
- SVG bezier connectors מחוברים לפי DOM positions אמיתיות (ResizeObserver)
- `scanner/gen_react_data.py` נוצר — ממיר snapshot.json → mindMapData.ts אוטומטית
- `scanner/run_weekly.ps1` עודכן — 5 שלבים: scan → gen → build → deploy → push
- GitHub Pages הושבת (DELETE API)
- Vercel rootDirectory = react-app (API, 2026-04-03)
- גיבוי D3 ישן שמור ב-backup/vanilla-d3-2026-04-02/

## Build (ידני)
```bash
cd react-app && pnpm build
cd .. && vercel deploy --prod --yes   # מה-root של הריפו!
```

## לא לשנות
- `backup/vanilla-d3-2026-04-02/` — גיבוי D3 הישן, לא למחוק
