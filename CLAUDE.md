# Evolution Schematic — Project Rules

## Stack
React + D3.js | Vercel (https://evolution-schematic.vercel.app) | pnpm

## מגבלות קריטיות
- deploy רק דרך Vercel — לא GitHub Pages
- branch master = production
- scanner/run_weekly.ps1 מריץ scan → rebuild → deploy אוטומטית

## לא לעשות
- לא לפרסם ל-GitHub Pages (URL ישן, מת)
- לא לשנות ארכיטקטורת D3 custom (branch stitch-radial שמור לעתיד)
- לא לשנות שם הפרויקט — URL קבוע
