/**
 * Schematic Evolution — App Logic v5.0
 * In-place expand/collapse D3 tree — dark theme, RTL Hebrew
 */
let snapshotData = null, currentView = 'global';
let collapsedNodes = new Set(); // category IDs currently collapsed

const DATA_URL = (() => {
  const loc = window.location.pathname;
  const base = loc.endsWith('/') ? loc : loc.substring(0, loc.lastIndexOf('/') + 1);
  return base + 'data/snapshot.json?t=' + Date.now();
})();

// ── Hebrew one-liners ──────────────────────────────────────────────────────
const HE_AGENTS = {
  'architect':            'מומחה ארכיטקטורת תוכנה — עיצוב מערכת, ניתוח טכני, החלטות עיצוב',
  'build-error-resolver': 'פותר שגיאות Build ו-TypeScript במינימום שינויים',
  'chief-of-staff':       'ראש מטה תקשורת — מיון מיילים, Slack, LINE, Messenger',
  'code-reviewer':        'מבקר קוד — איכות, אבטחה ותחזוקה אחרי כל כתיבה',
  'cpp-build-resolver':   'פותר שגיאות C++, CMake, linker',
  'cpp-reviewer':         'מבקר C++ — ניהול זיכרון, מקביליות, ביצועים',
  'database-reviewer':    'מומחה PostgreSQL — שאילתות, סכמה, ביצועים, אבטחה',
  'doc-updater':          'מעדכן תיעוד — CLAUDE.md, READMEs, codemaps',
  'e2e-runner':           'מריץ בדיקות E2E עם Playwright על זרימות קריטיות',
  'flutter-reviewer':     'מבקר Flutter/Dart — State Management, ביצועים',
  'general-purpose':      'סוכן כללי לחיפוש, מחקר ומשימות מורכבות',
  'go-build-resolver':    'פותר שגיאות Build ו-Go vet',
  'go-reviewer':          'מבקר Go — פטרנים, concurrency, טיפול שגיאות',
  'harness-optimizer':    'מנתח ומשפר קונפיגורציית harness מקומית',
  'java-build-resolver':  'פותר שגיאות Java/Maven/Gradle',
  'java-reviewer':        'מבקר Java/Spring Boot — ארכיטקטורה, JPA, אבטחה',
  'kotlin-build-resolver':'פותר שגיאות Kotlin/Gradle',
  'kotlin-reviewer':      'מבקר Kotlin/Android — Coroutines, Compose, KMP',
  'loop-operator':        'מפעיל לולאות סוכנים ומתערב כשנתקעות',
  'notice-manager':       'ניהול הודעות חשובות ב-Chadshani עם תאריכי פג תוקף',
  'plan':                 'ארכיטקט תוכנה — תכנון אסטרטגיית יישום',
  'planner':              'מתכנן פיצ׳רים ורפקטורינג — תוכנית יישום מפורטת',
  'project-status':       'דיווח סטטוס פרויקטים — סריקת git, בדיקת התקדמות',
  'python-reviewer':      'מבקר Python — PEP 8, type hints, אבטחה, ביצועים',
  'pytorch-build-resolver':'פותר שגיאות PyTorch, CUDA ואימון מודלים',
  'refactor-cleaner':     'מנקה קוד מת וכפילויות — knip, depcheck, ts-prune',
  'rust-build-resolver':  'פותר שגיאות Rust ו-Cargo',
  'rust-reviewer':        'מבקר Rust — ownership, lifetimes, unsafe code',
  'security-reviewer':    'מזהה פגיעויות — OWASP, הזרקה, XSS, סודות חשופים',
  'tdd-guide':            'מנחה TDD — טסטים קודם לקוד, כיסוי 80%+',
  'typescript-reviewer':  'מבקר TypeScript/JS — type safety, async, אבטחה',
  'claude-code-guide':    'מומחה Claude Code — CLI, hooks, slash commands, MCP',
  'statusline-setup':     'מגדיר שורת סטטוס ב-Claude Code',
  'Explore':              'חוקר קודבייס לעומק — חיפוש קבצים, קוד ותשובות',
  'backup-agent':         'גיבוי חודשי — snapshots של כל הפרויקטים ל-E:\\backup\\',
  'bug-learner':          'לומד מבאגים — שומר פתרונות, מונע חזרה על שגיאות',
  'chadshani-optimizer':  'מבקר ומשפר Chadshani — עלויות, איכות, שדרוגי API',
};

const HE_AGENTS_DETAIL = {
  'architect':         'משמש לפני כתיבת קוד — מונע ארכיטקטורה שבורה. מתאים להחלטות על מבנה שכבות, DB, microservices.',
  'code-reviewer':     'רץ אחרי כל שינוי קוד. עוצר קוד גרוע לפני commit — חוסך שעות debug.',
  'security-reviewer': 'שכבת ההגנה האחרונה. מגלה סודות שנשכחו, הזרקות SQL ופגיעויות OWASP.',
  'tdd-guide':         'מוודא כיסוי 80%+ בדיקות. מפחית באגים בפרודקשן ב-60-80%.',
  'planner':           'מפרק בקשות עמומות לשלבים ברורים. עדיף לפני כתיבת קוד.',
  'database-reviewer': 'מגלה missing indexes, שאילתות איטיות ובעיות RLS לפני פרודקשן.',
};

const HE_SKILLS = {
  'ai-regression-testing':    'בדיקות רגרסיה לפיתוח מבוסס AI',
  'configure-ecc':             'מתקין אינטראקטיבי לסקילים וכללים',
  'continuous-learning':       'חילוץ פטרנים לשימוש חוזר מסשנים',
  'continuous-learning-v2':    'מערכת למידה מבוססת instincts',
  'e2e-testing':               'בדיקות E2E עם Playwright — POM, artifacts',
  'frontend-design':           'עיצוב ממשק משתמש — production-grade, distinctive',
  'tdd-workflow':              'TDD — טסטים קודם לקוד, כיסוי 80%+',
  'update-docs':               'עדכון תיעוד ו-CLAUDE.md',
  'update-codemaps':           'עדכון מפות קוד ותיעוד ארכיטקטורה',
  'commit':                    'יצירת commit מסוגנן',
  'code-review':               'ביקורת קוד — אבטחה, איכות',
  'plan':                      'תכנון יישום — דרישות + סיכונים',
  'learn':                     'למד מה-session — חלץ פטרנים',
  'verify':                    'אימות מקיף — בדיקת מצב הקוד',
  'build-fix':                 'תיקון build שגיאות',
  'checkpoint':                'שמירת נקודת ביקורת ב-workflow',
  'save-session':              'שמירת session לקובץ',
  'resume-session':            'חזרה ל-session מהקובץ האחרון',
  'security-audit':            'סריקת אבטחה מלאה — OWASP, סודות',
  'instinct-status':           'הצגת instincts פעילים',
  'model-route':               'בחירת מודל — Haiku/Sonnet/Opus',
  'docs':                      'תיעוד ספריות עדכני דרך Context7',
  'devfleet':                  'ניהול צוות סוכני פיתוח מקביל',
};

// ── Hebrew: Modes ──────────────────────────────────────────────────────────
const HE_MODES = {
  'architect_mode':            'מצב ברירת מחדל — קרא → בדוק → תכנן → אשר → בצע',
  'audit_mode':                'בדיקה בטוחה בלבד — לא מוחק, לא יוצר, רק מנתח ומדווח',
  'build_mode':                'ביצוע מבוקר — פועל רק לפי תוכנית מאושרת, מעדיף מיזוג',
  'consolidation_mode':        'גיבוש זיכרון — ניקוי כפילויות, זיהוי סתירות, ארכיב',
  'document_ingestion_mode':   'קליטת מסמכים — עיבוד ותיוק ידע חיצוני',
  'evolution_pathways_mode':   'מסלולי אבולוציה — ניתוח נתיבי שדרוג למערכת',
  'external_skill_intake_mode':'קליטת סקיל חיצוני — הערכה ושילוב בטוח',
  'integration_mode':          'שילוב כלים — בדיקה, אימות ורישום MCPs ו-CLIs',
  'knowledge_mode':            'שילוב ידע — 5 שלבי הערכה, ביצוע רק אחרי אישור',
  'monthly_calibration_mode':  'כיול חודשי — בריאות מערכת, עדכון זיכרון, ניקוי',
  'project_closure_mode':      'סגירת פרויקט — תיעוד לקחים, עדכון skills registry',
  'project_status_review_mode':'סקירת סטטוס — בדיקת התקדמות כל הפרויקטים',
  'security_scan_mode':        'סריקת אבטחה — פגיעויות OWASP, סודות חשופים',
  'shadow_agent_mode':         'סוכן צל — רץ אוטומטי, משווה מציאות מול זיכרון',
  'README':                    'מדריך למצבי המערכת',
};

// ── Hebrew: MCP Servers ─────────────────────────────────────────────────────
const HE_MCP = {
  'everything-claude-code (ECC)': 'מערכת הרחבת Claude Code — סוכנים, סקילים, hooks, פקודות',
  'gh — GitHub CLI':              'GitHub CLI — repos, PRs, issues, workflows מהטרמינל',
  'context7':                     'תיעוד עדכני של ספריות — React, Next.js, Prisma ועוד',
  'Context7':                     'תיעוד עדכני של ספריות — API עכשווי תמיד',
  'Playwright':                   'אוטומציית דפדפן — E2E, צילומי מסך, Chrome/Firefox',
  'playwright':                   'אוטומציית דפדפן — E2E, צילומי מסך, Chrome/Firefox',
  'Figma':                        'שרת Figma — קריאת עיצובים, Code Connect, HTML/Tailwind',
  'figma':                        'שרת Figma — קריאת עיצובים, Code Connect',
  'Gmail':                        'Gmail — חיפוש, קריאה, יצירת טיוטות מתוך Claude Code',
  'gmail':                        'Gmail — חיפוש, קריאה, יצירת טיוטות',
  'Google Calendar':              'Google Calendar — אירועים, פנוי/תפוס, תזמון פגישות',
  'Google Stitch MCP':            'Google Labs UI — ממשקים מטקסט, HTML/Tailwind',
  'mcp2cli':                      'ניתוב MCP ל-CLI — חוסך טוקנים, CLI First',
  'claudeusage-mcp':              'מעקב שימוש Claude Pro/Max בזמן אמת',
  'tradingview-mcp':              'נתוני TradingView — פרויקטי פיננסים ומסחר',
  'gsd-build/gsd-2':              'TypeScript meta-prompting — פיתוח מבוסס מפרטים',
};

// ── Hebrew: Hooks descriptions ──────────────────────────────────────────────
const HE_HOOKS_KNOWN = [
  ['Block git hook-bypass',    'חוסם --no-verify — מגן על pre-commit ו-pre-push hooks',     'PreToolUse'],
  ['Auto-start dev servers',   'מפעיל dev servers ב-tmux לפי שם תיקייה אוטומטית',          'PreToolUse'],
  ['Reminder to use tmux',     'תזכורת להשתמש ב-tmux לפקודות ממושכות',                     'PreToolUse'],
  ['Reminder before git push', 'תזכורת לסקור שינויים לפני git push',                       'PreToolUse'],
  ['doc-file-warning',         'אזהרה לפני יצירת קובץ תיעוד — מניעת יצירה מיותרת',        'PreToolUse'],
  ['memory-heartbeat',         'עדכון זיכרון אחרי כל כתיבה — שומר פטרנים לשימוש חוזר',   'PostToolUse'],
  ['project-guard',            'Project Isolation — מונע כתיבה מחוץ לתיקיית הפרויקט',     'PostToolUse'],
  ['security-check',           'בדיקת אבטחה לפני Bash — מסנן פקודות מסוכנות',             'PreToolUse'],
  ['ntfy',                     'שליחת התראה ל-iPhone ב-ntfy.sh בסיום session',              'Stop'],
  ['notification',             'התראת iPhone ב-ntfy.sh',                                    'Stop'],
];

function getHookDesc(h) {
  const desc = (h.description || '') + ' ' + (h.script || '');
  for (const [kw, he] of HE_HOOKS_KNOWN) {
    if (desc.toLowerCase().includes(kw.toLowerCase()) ||
        (h.script || '').toLowerCase().includes(kw.toLowerCase())) return he;
  }
  if (h.type === 'Stop') return 'פועל בסיום session';
  if (h.type === 'PreToolUse') return `בדיקה לפני שימוש ב-${h.trigger || 'כלי'}`;
  if (h.type === 'PostToolUse') return `פעולה אחרי שימוש ב-${h.trigger || 'כלי'}`;
  return h.description || h.trigger || '';
}

// ── Hebrew: Memory types ────────────────────────────────────────────────────
const HE_MEMORY_TYPE = {
  'feedback':  'משוב — הנחיות כיצד לעבוד, מה לעשות ומה להימנע ממנו',
  'user':      'פרופיל משתמש — תפקיד, תחומי ידע, העדפות עבודה',
  'project':   'פרויקט — מצב, יעדים, החלטות ותאריכי יעד',
  'reference': 'מקורות — איפה למצוא מידע במערכות חיצוניות',
  'memory':    'זיכרון כללי',
};

// ── Hebrew: Rules ──────────────────────────────────────────────────────────
const HE_RULES = {
  'common':      'כללים אוניברסליים — immutability, error handling, security, testing לכל שפה',
  'typescript':  'TypeScript/JS — type safety, interfaces, async/await, Zod validation',
  'python':      'Python — PEP 8, type annotations, pytest, black/ruff/bandit',
  'golang':      'Go — idiomatic patterns, goroutines, error wrapping',
  'rust':        'Rust — ownership, lifetimes, cargo, unsafe guidelines',
  'swift':       'Swift — iOS/macOS, async/await, SwiftUI patterns',
  'kotlin':      'Kotlin/Android — Coroutines, Compose, KMP patterns',
  'java':        'Java/Spring Boot — layered architecture, JPA, security',
  'cpp':         'C++ — memory safety, templates, CMake, RAII',
  'csharp':      'C# — .NET patterns, async, LINQ, DI',
  'php':         'PHP — Laravel/Symfony patterns, PSR standards',
  'perl':        'Perl — scripting patterns, regex, file handling',
};

// ── Hebrew: Commands ───────────────────────────────────────────────────────
const HE_COMMANDS = {
  'plan':              'תכנון יישום — דרישות + סיכונים לפני כתיבת קוד',
  'code-review':       'ביקורת קוד — אבטחה, איכות, סטנדרטים לפני commit',
  'tdd':               'TDD — טסטים קודם, יישום אחר כך, כיסוי 80%+',
  'learn':             'למד מה-session — חלץ פטרנים לשימוש חוזר',
  'checkpoint':        'נקודת ביקורת — שמירת מצב workflow',
  'build-fix':         'תיקון build — שגיאות TypeScript/Webpack במינימום',
  'e2e':               'בדיקות E2E — Playwright על זרימות קריטיות',
  'docs':              'תיעוד עדכני ספריות דרך Context7',
  'refactor-clean':    'ניקוי קוד מת — knip, depcheck, הסרה בטוחה',
  'verify':            'אימות מקיף — בדיקת מצב הקוד הנוכחי',
  'orchestrate':       'אורקסטרציה — ניהול זרימת עבודה רב-סוכני',
  'multi-plan':        'תכנון רב-מודלי — Claude + Codex + Gemini',
  'multi-execute':     'ביצוע רב-מודלי — פרוטוטייפ → Claude → audit',
  'multi-workflow':    'workflow שלם — מחקר → תכנון → ביצוע → אופטימיזציה',
  'multi-frontend':    'Frontend workflow — Gemini מוביל, React/Next.js',
  'multi-backend':     'Backend workflow — Codex מוביל, API/DB',
  'model-route':       'בחירת מודל — Haiku/Sonnet/Opus לפי מורכבות',
  'loop-start':        'לולאה אוטונומית — הפעלה עם ברירות בטוחות',
  'loop-status':       'סטטוס לולאה — התקדמות ואיתותי כשל',
  'save-session':      'שמירת session — state לקובץ ~/.claude/sessions/',
  'resume-session':    'חזרה ל-session — טעינת context מהקובץ האחרון',
  'sessions':          'ניהול sessions — היסטוריה, aliases, metadata',
  'quality-gate':      'quality pipeline — ECC על קובץ או פרויקט',
  'evolve':            'אבולוציה — הצעות שדרוג למערכת Claude הנוכחית',
  'harness-audit':     'audit תשתית — scorecard עדיפויות ממוין',
  'pm2':               'PM2 — ניהול תהליכי Node.js ב-production',
  'python-review':     'ביקורת Python — PEP 8, type hints, אבטחה',
  'rust-review':       'ביקורת Rust — ownership, lifetimes, unsafe',
  'rust-build':        'תיקון Rust — borrow checker, Cargo',
  'rust-test':         'TDD ל-Rust — cargo-llvm-cov, 80%+',
  'cpp-review':        'ביקורת C++ — memory safety, concurrency',
  'cpp-build':         'תיקון C++ — CMake, linker',
  'cpp-test':          'בדיקות C++ — Google Test',
  'go-review':         'ביקורת Go — idiomatic, goroutines',
  'go-build':          'תיקון Go — go vet, לינקר',
  'go-test':           'בדיקות Go — testify, coverage',
  'kotlin-review':     'ביקורת Kotlin — coroutines, Compose',
  'kotlin-build':      'תיקון Kotlin/Gradle',
  'kotlin-test':       'בדיקות Kotlin — JUnit, MockK',
  'gradle-build':      'תיקון Gradle — dependencies, build scripts',
  'instinct-export':   'ייצוא instincts — שמירת תובנות session',
  'instinct-import':   'ייבוא instincts — טעינת תובנות קודמות',
  'instinct-status':   'סטטוס instincts — רשימת תובנות פעילות',
  'learn-eval':        'הערכת למידה — איכות הסקילים שנוצרו',
  'aside':             'הצדה — שמירת מחשבה לצד session הנוכחי',
  'context-budget':    'ניהול context — תקציב טוקנים ומצב דחיסה',
  'eval':              'הרצת evals — מדידת ביצועי מודל על benchmark',
  'prompt-optimize':   'אופטימיזציית prompt — ניתוח ושיפור ללא ביצוע',
  'prune':             'גיזום — קבצים/תלויות מיותרים',
  'projects':          'סקירת פרויקטים — סטטוס כל הפרויקטים',
  'promote':           'קידום — העברת code/config בין סביבות',
  'rules-distill':     'חילוץ כללים — מ-skills לעקרונות כלליים',
  'skill-create':      'יצירת סקיל — תיעוד פטרן חדש עם frontmatter',
  'skill-health':      'בריאות סקילים — בדיקה ועדכון status',
  'test-coverage':     'כיסוי טסטים — ניתוח gap, ייצור טסטים חסרים',
  'update-codemaps':   'עדכון codemaps — תיעוד ארכיטקטורה lean',
  'update-docs':       'עדכון docs — סנכרון תיעוד עם קוד',
  'devfleet':          'DevFleet — ניהול צוות סוכני פיתוח',
  'claw':              'CLAW — מצב Claude Agent מתקדם',
};

// ── Init & Data ────────────────────────────────────────────────────────────
async function init() {
  showLoading(true);
  await loadData();
}

async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    snapshotData = await res.json();
    showLoading(false);
    updateTimestamp(snapshotData.generated_at);
    buildProjectMenu(snapshotData.projects);
    setView(currentView);
  } catch (err) {
    showLoading(false);
    const errEl = document.getElementById('errorMsg');
    if (errEl) {
      errEl.style.display = 'block';
      errEl.textContent = 'שגיאה בטעינת הנתונים — הרץ את הסורק תחילה.';
    }
  }
}

function updateTimestamp(iso) {
  if (!iso) return;
  const s = new Date(iso).toLocaleString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  const el = document.getElementById('lastUpdated');
  if (el) el.textContent = `עודכן: ${s}`;
  document.querySelectorAll('.last-updated').forEach(e => e.textContent = `עודכן: ${s}`);
}

function buildProjectMenu(projects) {
  const list = document.getElementById('projectList');
  if (!list) return;
  list.innerHTML = '';
  (projects || []).forEach(p => {
    const color = COLORS.projectColors[p.id % COLORS.projectColors.length];
    const div = document.createElement('div');
    div.className = 'sidebar-item';
    div.dataset.view = `project_${p.id}`;
    div.innerHTML = `
      <span class="sidebar-badge" style="background:${color}22;color:${color};border:1px solid ${color}40">${p.id}</span>
      <span class="sidebar-label">${esc(p.name)}</span>`;
    div.onclick = () => setView(`project_${p.id}`);
    list.appendChild(div);
  });
}

function setView(view) {
  currentView = view;
  document.querySelectorAll('.sidebar-item').forEach(el =>
    el.classList.toggle('active', el.dataset.view === view));
  const titleEl = document.getElementById('viewTitle');
  if (view === 'global') {
    if (titleEl) titleEl.textContent = 'מפת המערכת הגלובלית';
    renderGlobalTree();
  } else if (view.startsWith('project_')) {
    const id = parseInt(view.replace('project_', ''));
    const proj = snapshotData?.projects?.find(p => p.id === id);
    if (titleEl && proj) titleEl.textContent = proj.name;
    renderProjectTree(id);
  }
}

// ── Navigation Stack ───────────────────────────────────────────────────────
let navStack = [];
let currentD3Data = null;
let currentD3Title = '';

function navigateBack() {
  if (navStack.length === 0) return;
  const prev = navStack.pop();
  _renderD3(prev.data, prev.title);
}

// ── Data builders ──────────────────────────────────────────────────────────

function buildGlobalData() {
  const g = snapshotData.claude_global;
  const total = [g.agents, g.skills, g.mcp_servers, g.hooks, g.modes, g.memory, g.commands]
    .reduce((s, a) => s + (a || []).length, 0) + (snapshotData.projects || []).length;

  const mcpClean = g.mcp_servers.filter(m => m.name && m.name !== '[Integration Name]' && (m.purpose||'').length > 3);
  const rulesItems = buildRulesItems(g.rules);

  return {
    id: 'root', icon: '🧠', label: 'מערכת Claude Code', count: total, color: '#38BDF8',
    children: [
      catData('agents',     'סוכנים',    g.agents,     a => ({ name: a.name, he: HE_AGENTS[a.name] || a.purpose, detail: HE_AGENTS_DETAIL[a.name] })),
      catData('skills',     'סקילים',    g.skills,     s => ({ name: s.name, he: HE_SKILLS[s.name] || s.purpose, tag: s.status !== 'active' ? s.status : null })),
      catData('mcp_servers','MCP שרתים', mcpClean,     m => ({ name: m.name, he: HE_MCP[m.name] || m.purpose, tag: m.tier || null })),
      catData('modes',      'מצבים',     g.modes,      m => ({ name: m.name.replace(/_mode$/,''), he: HE_MODES[m.name] || m.description || m.trigger, tag: m.version ? `v${m.version}` : null })),
      catData('hooks',      'Hooks',     g.hooks,      (h,i) => ({ name: h.description ? h.description.substring(0,30) : (h.trigger||`Hook ${i+1}`), he: getHookDesc(h), tag: h.type })),
      catData('rules',      'כללים',     rulesItems,   r => ({ name: r.name, he: r.he, tag: r.tag })),
      catData('memory',     'זיכרון',    g.memory,     m => ({ name: m.name || m.file, he: HE_MEMORY_TYPE[m.type] || m.description, tag: m.type })),
      catData('commands',   'פקודות',    g.commands,   c => ({ name: `/${c.name}`, he: HE_COMMANDS[c.name] || c.description, tag: c.category !== 'general' ? c.category : null })),
      catData('projects',   'פרויקטים',  snapshotData.projects || [],
        p => {
          const s = COLORS.status[p.status] || COLORS.status.active;
          return {
            name: `${s.icon} ${p.name}`,
            he: p.description || '',
            tag: s.label,
            isProject: p.id,
            color: s.color
          };
        }),
    ]
  };
}

function buildRulesItems(rules) {
  if (!rules) return [];
  const items = [{ name: 'common', he: HE_RULES['common'], tag: `${rules.common_count||0} קבצים` }];
  (rules.languages || []).forEach(l => items.push({ name: l, he: HE_RULES[l] || `כללים ל-${l}`, tag: '' }));
  return items;
}

function catData(cat, label, items, mapper) {
  const c = COLORS.getCategory(cat);
  const icon = CAT_ICONS[cat];
  return {
    id: cat, icon, label, count: (items||[]).length, color: c.border, cat,
    children: (items||[]).map((item, i) => ({ leaf: true, cat, ...mapper(item, i) }))
  };
}

// ── D3 Tree Renderer — Top-to-Bottom, Light Theme ─────────────────────────

function _getCat(d) {
  if (d.depth === 0) return 'root';
  if (d.depth === 1) return d.data.id || 'root';
  return d.data.cat || d.data.id || 'root';
}

function _renderD3(data, title) {
  currentD3Data = data;
  currentD3Title = title;

  const area = document.getElementById('contentArea');
  area.innerHTML = '';

  // Nav bar
  if (navStack.length > 0) {
    const bar = document.createElement('div');
    bar.className = 'nav-bar';
    bar.innerHTML = `<button class="btn-back-nav" onclick="navigateBack()">← חזרה</button>
      <span class="crumb-trail">${esc(navStack.map(s=>s.title).join(' › '))} › <b>${esc(title)}</b></span>`;
    area.appendChild(bar);
  }

  const svgWrap = document.createElement('div');
  svgWrap.className = 'svg-wrap';
  svgWrap.style.cssText = 'animation:fadeIn 0.28s ease;overflow:auto;';
  area.appendChild(svgWrap);

  // ── Layout constants ──
  const NODE_W = 210;  // pill width
  const NODE_H = 46;   // pill height
  const GAP_X  = 24;   // horizontal gap between siblings
  const GAP_Y  = 88;   // vertical gap between depth levels

  // ── D3 hierarchy (vertical: x=spread, y=depth) ──
  const hier = d3.hierarchy(data, d => {
    if (collapsedNodes.has(d.id)) return null;
    return d.children?.length ? d.children : null;
  });
  d3.tree().nodeSize([NODE_W + GAP_X, NODE_H + GAP_Y])(hier);

  const descs = hier.descendants();
  const minX  = d3.min(descs, d => d.x) - NODE_W/2 - 30;
  const maxX  = d3.max(descs, d => d.x) + NODE_W/2 + 30;
  const maxY  = d3.max(descs, d => d.y) + NODE_H + 60;
  const svgW  = Math.max(800, maxX - minX);
  const svgH  = Math.max(500, maxY);
  const offX  = -minX;

  // ── SVG ──
  const svg = d3.select(svgWrap).append('svg')
    .attr('width', svgW).attr('height', svgH)
    .style('display', 'block')
    .style('background', '#F8FAFC');

  const defs = svg.append('defs');

  // Dot grid background
  defs.append('pattern').attr('id','dg').attr('width',28).attr('height',28)
    .attr('patternUnits','userSpaceOnUse').append('circle')
    .attr('cx',1).attr('cy',1).attr('r',0.9).attr('fill','#CBD5E1');
  svg.append('rect').attr('width','100%').attr('height','100%').attr('fill','url(#dg)').attr('opacity',0.5);

  // Drop shadow filter
  const sf = defs.append('filter').attr('id','nshadow')
    .attr('x','-20%').attr('y','-20%').attr('width','140%').attr('height','160%');
  sf.append('feDropShadow').attr('dx',0).attr('dy',2).attr('stdDeviation',4)
    .attr('flood-color','#0F172A').attr('flood-opacity',0.07);

  // Zoom + pan
  const zoom = d3.zoom().scaleExtent([0.1,4]).on('zoom', e => g.attr('transform', e.transform));
  svg.call(zoom);
  const g = svg.append('g').attr('transform', `translate(${offX},40)`);

  // ── Links — vertical bezier ──
  g.selectAll('.edge')
    .data(hier.links())
    .enter().append('path')
    .attr('class','edge')
    .attr('fill','none')
    .attr('stroke', d => {
      const cat = COLORS.getCategory(_getCat(d.target));
      return cat.border;
    })
    .attr('stroke-width', d => d.target.depth === 1 ? 1.5 : 1)
    .attr('stroke-opacity', d => d.target.depth === 1 ? 0.28 : 0.16)
    .attr('stroke-linecap','round')
    .attr('d', d => {
      const sx = d.source.x, sy = d.source.y + NODE_H/2;
      const tx = d.target.x, ty = d.target.y - NODE_H/2;
      const my = (sy + ty) / 2;
      return `M${sx},${sy} C${sx},${my} ${tx},${my} ${tx},${ty}`;
    });

  // ── Nodes ──
  const node = g.selectAll('.d3nd')
    .data(descs)
    .enter().append('g')
    .attr('class','d3nd')
    .attr('transform', d => `translate(${d.x - NODE_W/2},${d.y - NODE_H/2})`)
    .style('cursor', d => (!d.data.leaf || d.data.isProject !== undefined) ? 'pointer' : 'default')
    .attr('opacity', 0);

  // Fade-in animation on enter
  node.transition().duration(300).delay((d,i) => Math.min(i * 12, 200)).attr('opacity', 1);

  // Pill background
  node.append('rect')
    .attr('width', NODE_W).attr('height', NODE_H)
    .attr('rx', NODE_H / 2)
    .attr('fill', d => {
      const cat = COLORS.getCategory(_getCat(d));
      return d.depth === 0 ? cat.bg : d.depth === 1 ? cat.bg : '#FFFFFF';
    })
    .attr('stroke', d => COLORS.getCategory(_getCat(d)).border)
    .attr('stroke-width', d => d.depth === 0 ? 2 : d.depth === 1 ? 1.5 : 0.75)
    .attr('stroke-opacity', d => d.depth === 0 ? 1 : d.depth === 1 ? 0.6 : 0.22)
    .attr('filter', 'url(#nshadow)');

  // Left dot accent
  node.append('circle')
    .attr('cx', NODE_H / 2)
    .attr('cy', NODE_H / 2)
    .attr('r', d => d.depth === 0 ? 7 : d.depth === 1 ? 5 : 3)
    .attr('fill', d => COLORS.getCategory(_getCat(d)).border)
    .attr('opacity', d => d.depth === 0 ? 0.9 : d.depth === 1 ? 0.7 : 0.4);

  // Text — centered in pill
  node.append('text')
    .attr('x', NODE_W / 2)
    .attr('y', NODE_H / 2)
    .attr('dominant-baseline', 'central')
    .attr('text-anchor', 'middle')
    .attr('fill', d => COLORS.getCategory(_getCat(d)).text)
    .attr('font-size', d => d.depth === 0 ? 14 : d.depth === 1 ? 13 : 11)
    .attr('font-weight', d => d.depth <= 1 ? 700 : 500)
    .attr('font-family', 'Heebo, sans-serif')
    .text(d => {
      const raw = d.data.label || d.data.name || '';
      const max = d.depth <= 1 ? 24 : 26;
      return raw.length > max ? raw.substring(0, max - 1) + '…' : raw;
    });

  // Count badge on category nodes
  node.filter(d => !d.data.leaf && d.data.count && d.depth === 1)
    .each(function(d) {
      const cat = COLORS.getCategory(_getCat(d));
      const bw = 26, bx = NODE_W - NODE_H/2 - bw - 4;
      d3.select(this).append('rect')
        .attr('x', bx).attr('y', NODE_H/2 - 9).attr('width', bw).attr('height', 17).attr('rx', 8)
        .attr('fill', cat.border).attr('opacity', 0.15);
      d3.select(this).append('text')
        .attr('x', bx + bw/2).attr('y', NODE_H/2)
        .attr('dominant-baseline','central').attr('text-anchor','middle')
        .attr('font-size', 9).attr('font-weight', 700).attr('font-family','Heebo, sans-serif')
        .attr('fill', cat.border).text(d.data.count);
    });

  // Expand/collapse toggle circle
  node.filter(d => !d.data.leaf && d.data.children?.length > 0)
    .each(function(d) {
      const cat = COLORS.getCategory(_getCat(d));
      const cx = NODE_W - NODE_H/2 + 1, cy = NODE_H/2;
      // Overlap toggle on right edge of pill
      const tog = d3.select(this).append('g').attr('class','toggle-g');
      tog.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 9)
        .attr('fill', '#fff').attr('stroke', cat.border).attr('stroke-width', 1.5).attr('stroke-opacity', 0.5);
      tog.append('text')
        .attr('x', cx).attr('y', cy)
        .attr('dominant-baseline','central').attr('text-anchor','middle')
        .attr('font-size', 11).attr('font-weight', 700)
        .attr('font-family', 'Heebo, sans-serif')
        .attr('fill', cat.border)
        .text(collapsedNodes.has(d.data.id) ? '+' : '−');
    });

  // Hover effects
  node.on('mouseenter', function(event, d) {
    d3.select(this).select('rect')
      .transition().duration(120)
      .attr('stroke-opacity', 1)
      .attr('stroke-width', d.depth === 0 ? 2.5 : d.depth === 1 ? 2 : 1.2);
    d3.select(this)
      .transition().duration(120)
      .attr('transform', `translate(${d.x - NODE_W/2},${d.y - NODE_H/2}) scale(1.04)`);
  })
  .on('mouseleave', function(event, d) {
    d3.select(this).select('rect')
      .transition().duration(180)
      .attr('stroke-opacity', d.depth === 0 ? 1 : d.depth === 1 ? 0.6 : 0.22)
      .attr('stroke-width', d.depth === 0 ? 2 : d.depth === 1 ? 1.5 : 0.75);
    d3.select(this)
      .transition().duration(180)
      .attr('transform', `translate(${d.x - NODE_W/2},${d.y - NODE_H/2})`);
  });

  // Click handlers
  node.on('click', (event, d) => {
    event.stopPropagation();
    if (d.data.isProject !== undefined) {
      navStack.push({ data: currentD3Data, title: currentD3Title });
      setViewProject(d.data.isProject);
      return;
    }
    if (d.data.id && !d.data.leaf && d.data.children?.length > 0) {
      collapsedNodes.has(d.data.id)
        ? collapsedNodes.delete(d.data.id)
        : collapsedNodes.add(d.data.id);
      // Animate out then re-render
      d3.select(svgWrap).style('opacity', 1)
        .transition().duration(150).style('opacity', 0)
        .on('end', () => _renderD3(currentD3Data, currentD3Title));
      return;
    }
    if (d.data.leaf) showLeafDetail(event, d.data);
  });

  updateExpandBtn();
}

// ── Leaf Detail Tooltip ────────────────────────────────────────────────────
function showLeafDetail(event, data) {
  const tt = document.getElementById('tooltip');
  if (!tt) return;
  const nameDisplay = (/^[/a-z0-9\-\._\s]+$/i.test(data.name) && !/[\u0590-\u05FF]/.test(data.name))
    ? data.name.toUpperCase() : data.name;
  const detail = data.detail || data.he || '';
  tt.innerHTML = `
    <div style="font-weight:700;margin-bottom:6px;font-size:14px;color:${data.color||'#6366F1'}">${esc(nameDisplay)}</div>
    <div style="color:#475569;font-size:12px;line-height:1.6">${esc(detail)}</div>
    ${data.tag ? `<div style="margin-top:8px;font-size:10px;color:${data.color||'#64748B'};opacity:0.8">${esc(data.tag)}</div>` : ''}
  `;
  tt.style.display = 'block';
  const tw = 260;
  const left = (event.clientX + 14 > window.innerWidth - tw - 10)
    ? event.clientX - tw - 14
    : event.clientX + 14;
  const top = (event.clientY + 120 > window.innerHeight)
    ? event.clientY - 120
    : event.clientY - 10;
  tt.style.left = left + 'px';
  tt.style.top  = top + 'px';
  // Auto-hide after 5s
  clearTimeout(tt._hideTimer);
  tt._hideTimer = setTimeout(() => { tt.style.display = 'none'; }, 5000);
}

// Hide tooltip on outside click
document.addEventListener('click', () => {
  const tt = document.getElementById('tooltip');
  if (tt) tt.style.display = 'none';
});

// ── Expand / Collapse All ─────────────────────────────────────────────────
function expandAll() {
  collapsedNodes.clear();
  _renderD3(currentD3Data, currentD3Title);
}

function collapseAll() {
  (currentD3Data?.children || []).forEach(c => c.id && collapsedNodes.add(c.id));
  _renderD3(currentD3Data, currentD3Title);
}

function toggleExpandAll() {
  const allCollapsed = currentD3Data?.children?.every(c => !c.id || collapsedNodes.has(c.id));
  allCollapsed ? expandAll() : collapseAll();
}

function updateExpandBtn() {
  const btn = document.getElementById('btn-expand-all');
  if (!btn) return;
  const allCollapsed = currentD3Data?.children?.every(c => !c.id || collapsedNodes.has(c.id));
  btn.textContent = allCollapsed ? 'הרחב הכל' : 'כווץ הכל';
}

// ── Tree Renderers ─────────────────────────────────────────────────────────

function renderGlobalTree() {
  if (!snapshotData) return;
  navStack = [];
  const data = buildGlobalData();
  // On first load: start with all categories collapsed
  if (collapsedNodes.size === 0) {
    data.children.forEach(c => c.id && collapsedNodes.add(c.id));
  }
  _renderD3(data, 'מפת המערכת הגלובלית');
}

function setViewProject(projId) {
  if (!snapshotData) return;
  const proj = snapshotData.projects.find(p => p.id === projId);
  if (!proj) return;
  const color = COLORS.projectColors[proj.id % COLORS.projectColors.length];

  const techChildren = (proj.tech_stack || []).map(t => ({
    leaf: true, name: t, he: null, color: '#6B7280'
  }));

  const agentItems = (proj.project_agents || []).map(a => ({
    leaf: true, name: a,
    he: HE_AGENTS[a] || '',
    detail: HE_AGENTS_DETAIL[a] || HE_AGENTS[a] || '',
    color: COLORS.getCategory('agents').border,
    cat: 'agents'
  }));

  const skillItems = (proj.project_skills || []).map(s => ({
    leaf: true, name: s,
    he: HE_SKILLS[s] || '',
    color: COLORS.getCategory('skills').border,
    cat: 'skills'
  }));

  const data = {
    id: `proj_${proj.id}`, icon: '📁',
    label: proj.name, color,
    description: proj.description || '',
    count: agentItems.length + skillItems.length,
    children: [
      proj.description ? { leaf: true, name: 'תיאור', he: proj.description, color } : null,
      techChildren.length ? {
        id: 'tech', icon: '⚙️', label: 'Tech Stack',
        color: '#6B7280', count: techChildren.length, children: techChildren
      } : null,
      { 
        leaf: true, 
        name: 'סטטוס', 
        he: (COLORS.status[proj.status] || COLORS.status.active).label, 
        tag: (COLORS.status[proj.status] || COLORS.status.active).icon,
        color: (COLORS.status[proj.status] || COLORS.status.active).color 
      },
      agentItems.length ? {
        id: `proj_agents_${proj.id}`, icon: '🤖', label: 'סוכנים',
        color: COLORS.getCategory('agents').border,
        cat: 'agents',
        count: agentItems.length,
        children: agentItems
      } : null,
      skillItems.length ? {
        id: `proj_skills_${proj.id}`, icon: '✨', label: 'סקילים',
        color: COLORS.getCategory('skills').border,
        cat: 'skills',
        count: skillItems.length,
        children: skillItems
      } : null,
    ].filter(Boolean)
  };
  _renderD3(data, proj.name);
}

function renderProjectTree(projId) {
  navStack = [{ data: buildGlobalData(), title: 'מפת המערכת הגלובלית' }];
  // Reset collapsed state for project view
  collapsedNodes.clear();
  setViewProject(projId);
}

// ── Helpers ────────────────────────────────────────────────────────────────

const CAT_ICONS = {
  agents: '🤖', skills: '✨', mcp_servers: '🔌', hooks: '🪝',
  modes: '🎭', rules: '📋', memory: '💾', commands: '⚡', projects: '📁',
};

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function refreshData() {
  const btn = document.getElementById('btnRefresh');
  if (btn) btn.classList.add('updating');
  window.location.reload(true);
}

function showLoading(on) {
  const el = document.getElementById('loadingOverlay');
  if (el) el.style.display = on ? 'flex' : 'none';
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', init);
