# Evolution Schematic — HANDOFF
Last updated: 2026-04-05 (session 6 — connectors + centering + layered overview)

## מצב נוכחי
- פרויקט ID: 8 (תיקייה: 8_EvolutionSchematic)
- מצב: **פעיל ✅ מושלם**
- URL: https://claude-brain-sg.vercel.app
- Stack: React 18 + TypeScript + Vite (Mermaid הוסר)
- Data: `data/snapshot.json` → `scanner/gen_react_data.py` → `react-app/src/data/mindMapData.ts`

## עדכון שבועי אוטומטי
- **Task Scheduler**: `SchematicEvolution_WeeklyScanner` — כל ראשון 11:00
- Pipeline: `scan_system.py` → `gen_react_data.py` → `npx vite build` → `vercel deploy` → `vercel alias` → `git push`
- עדכון ידני: הרץ `scanner/run_weekly.ps1` ישירות

## עדכון על פי דרישה
כאשר המשתמש מבקש — הרץ: `scanner/run_weekly.ps1`

## החלטות מחייבות
- **אסור** לגעת ב-GitHub Pages (הושבת לצמיתות)
- **אסור** לערוך `mindMapData.ts` ידנית — תמיד דרך `gen_react_data.py`
- **פריסה**: `cd 8_EvolutionSchematic && vercel deploy --prod --yes` + `vercel alias set <url> claude-brain-sg.vercel.app`
- **Build**: `npx vite build` מתוך `react-app/` (לא `pnpm build` — EBUSY)
- Vercel rootDirectory = `react-app` (מוגדר ב-Vercel API)

## ארכיטקטורת הרכיבים
```
App.tsx
  ├── MindMapNode.tsx       — node cards + SVG bezier connectors
  ├── SystemOverview.tsx    — modal: ארכיטקטורת 5 שכבות (לא מפת חשיבה)
  └── data/
       ├── mindMapData.ts   — עץ הסכמה (auto-generated)
       └── systemOverview.ts — stats + generatedAt (auto-generated)
```

## מה עובד
- קווי חיצים: `pathLength="1"` + CSS `stroke-dasharray: 1` — לא נחתכים גם ב-expand-all
- מרכוז: `scrollIntoView` על root card — תמיד מדויק
- Hebrew descriptions: מוצג ראשון, bold; שם אנגלי אחריו, אפור קטן
- "🧠 אבולוציה עכשוית": modal עם 5 שכבות ארכיטקטורה + זרימת תהליכים
- Zoom + pan + pinch-to-zoom מובייל
- NotebookLM-style spring animations

## שינויים session 6 (2026-04-05)
- connectors תוקנו סופית: `pathLength="1"` + `@keyframes connectorDraw` עם ערכים 0→1
- getOffset חזר ל-offsetParent chain (getBoundingClientRect הושפע מ-scale transform)
- מרכוז expand-all עבר ל-`scrollIntoView` על rootCardRef
- SystemOverview: הוחלף ל-ארכיטקטורת שכבות (5 שכבות + חיצי זרימה + feedback loop)
- run_weekly.ps1 תוקן: `npx vite build` + `vercel alias` אחרי deploy
- deploy-notify.yml: URL תוקן ל-claude-brain-sg.vercel.app

## לא לשנות
- `backup/vanilla-d3-2026-04-02/` — גיבוי D3 ישן, לא למחוק
