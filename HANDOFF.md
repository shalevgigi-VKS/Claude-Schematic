# Evolution Schematic — HANDOFF
Last updated: 2026-04-02

## מצב נוכחי
- פרויקט ID: 8 (בתיקייה 8_EvolutionSchematic)
- מצב: לא יציב — דורש refactor מלא
- עיצוב פעיל: Dark D3 custom על master
- עיצוב שמור לעתיד: Stitch radial design ב-`design/stitch-radial`

## הצעד הבא (לפי roadmap מאושר)
- שלב 5 ב-roadmap: תיקון ודeploy — כולל Vercel migration
- לפני הכל: בדוק `vercel_deploy.ps1` (קיים בתיקייה)
- תיקון iPhone 404 — בדוק routing ב-Vercel config
- תיקון cron duplicates בworkflows

## החלטות מחייבות
- אסור לגעת בהגדרות GitHub Pages של EvolutionSchematic כשעובדים על Chadshani
- project 0 (ישן) ו-8 (חדש) — מדובר באותו פרויקט, 8 הוא הגרסה הפעילה
- Vercel migration חייב להיות מלא לפני כל עבודה נוספת

## מה הושלם
- עיצוב Dark D3 פועל על master
- Stitch radial שמור לשלב עיצוב עתידי
- workflow evolution-schematic-update תוקן (2026-03-29)

## לא לשנות
- `design/stitch-radial` — שמור לעתיד, לא למחוק
