# Evolution Schematic — HANDOFF
Last updated: 2026-04-02

## מצב נוכחי
- פרויקט ID: 8 (בתיקייה 8_EvolutionSchematic)
- מצב: **פעיל — Vercel production** ✅
- URL: https://evolution-schematic.vercel.app
- עיצוב פעיל: Dark D3 custom על master
- עיצוב שמור לעתיד: Stitch radial design ב-`design/stitch-radial`

## הצעד הבא
- בדוק שהאתר עולה תקין ב-iPhone (routing תוקן ב-vercel.json)
- הרץ `vercel_deploy.ps1` לכל עדכון עתידי (סורק + פריסה + notification)

## החלטות מחייבות
- אסור לגעת בהגדרות GitHub Pages של EvolutionSchematic כשעובדים על Chadshani
- project 0 (ישן) ו-8 (חדש) — מדובר באותו פרויקט, 8 הוא הגרסה הפעילה
- Vercel migration חייב להיות מלא לפני כל עבודה נוספת

## מה הושלם
- עיצוב Dark D3 פועל על master
- Stitch radial שמור לשלב עיצוב עתידי
- workflow evolution-schematic-update תוקן (2026-03-29)
- **Vercel migration הושלם (2026-04-02)** — vercel.json, SPA rewrites, cache headers
- נתונים רוסקנו ופורסו (snapshot מ-2026-04-02)

## לא לשנות
- `design/stitch-radial` — שמור לעתיד, לא למחוק
