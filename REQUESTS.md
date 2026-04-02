# Evolution Schematic — יומן בקשות ושינויים

> קובץ זה מתועד אוטומטית. כל בקשה, מה שבוצע, מה לא בוצע ולמה.

---

## סשן 2026-04-02

### בקשה 1 — Vercel migration
**בוצע:** הגדרת vercel.json עם SPA rewrites ו-cache headers. פריסה ל-https://evolution-schematic.vercel.app  
**לא בוצע:** —

### בקשה 2 — עיצוב מחדש (light theme, NotebookLM style)
**בוצע:** colors.js עודכן לפסטל בהיר. mindmap.js נכתב מחדש עם pill nodes.  
**לא בוצע בפועל:** mindmap.js לא בשימוש — ה-renderer האמיתי הוא `_renderD3` ב-app.js, שנשאר כהה. נגלה רק בסבב הבא.

### בקשה 3 — תיקון עיצוב אמיתי (top-to-bottom, light, text in box, animation)
**הבעיות שזוהו:**
- `_renderD3` ב-app.js: שימוש ב-`d3.linkHorizontal()` → שמאל-ימין
- SVG background hardcoded `#0A0F1E` (שחור)
- מיקום טקסט לא מרוכז בתוך הקופסאות
- אין אנימציה בלחיצת expand/collapse

**בוצע:**
- `_renderD3` נכתב מחדש: top-to-bottom (d.x→אופקי, d.y→עומק), vertical bezier curves
- Background: `#F8FAFC` (לבן כמעט)
- Nodes: pill shape עם text-anchor:middle + dominant-baseline:central → טקסט מרוכז
- אנימציה: fade-in על כניסת nodes (0.3s stagger), fade-out לפני re-render
- hover effect: scale(1.04) + stroke intensity
- `showLeafDetail`: צבעי טקסט עודכנו ל-light

### בקשה 4 — מחיקת פרויקט 0
**בוצע:** scanner.py — מדלג על proj_id == 0  
**לא בוצע:** מחיקת תיקיית 0_EvolutionSchematic — נדרש אישור ידני

**פעולה נדרשת:** מחק ידנית את התיקייה:
```powershell
Remove-Item -Recurse -Force "e:\Claude\Shalev's_Projects\0_EvolutionSchematic"
```

### בקשה 5 — תיעוד קבוע של בקשות
**בוצע:** יצירת קובץ זה (REQUESTS.md) בכל פרויקט פעיל  
**כלל לעתיד:** בכל סשן — עדכן REQUESTS.md עם הבקשות, מה שבוצע, מה לא

---

## כלל תיעוד מחייב
בכל סשן עבודה:
1. פתח REQUESTS.md של הפרויקט
2. הוסף section חדש עם תאריך
3. לכל בקשה: מה התבקש | מה בוצע | מה לא בוצע ולמה
