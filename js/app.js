/**
 * Schematic Evolution — App Logic v4.0
 * Drill-down interactive tree — no D3, pure HTML/CSS/JS
 */
let snapshotData = null, currentView = 'global';

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
  'cpp-build-resolver':   'פותר שגיאות C++, CMake, qllinker',
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
  'e2e-runner':           'מריץ בדיקות End-to-End עם Playwright',
};
const HE_AGENTS_DETAIL = {
  'architect':            'משמש לפני כתיבת קוד — מונע ארכיטקטורה שבורה מאוחר יותר. מתאים להחלטות על מבנה שכבות, בסיס נתונים, microservices ו-APIs.',
  'code-reviewer':        'רץ אוטומטית אחרי כל שינוי קוד. עוצר קוד גרוע לפני ש-commit — חוסך שעות debug.',
  'security-reviewer':    'שכבת ההגנה האחרונה. מגלה סודות שנשכחו ב-code, הזרקות SQL ופגיעויות OWASP לפני שהם מגיעים לפרודקשן.',
  'tdd-guide':            'מוודא שהתוצאה הסופית מכוסה ב-80%+ בדיקות. מפחית באגים בפרודקשן ב-60-80% לפי מחקרים.',
  'planner':              'חוסך זמן עצום — מפרק בקשות עמומות לשלבים ברורים. עדיף שלוחצים על "שמור" לפני כתיבת קוד.',
  'database-reviewer':    'מגלה missing indexes, שאילתות איטיות ובעיות RLS לפני שנגיעים לפרודקשן.',
};
const HE_SKILLS = {
  'ai-regression-testing':   'בדיקות רגרסיה לפיתוח מבוסס AI',
  'configure-ecc':            'מתקין אינטראקטיבי לסקילים וכללים',
  'continuous-learning':      'חילוץ פטרנים לשימוש חוזר מסשנים',
  'create-sparc-agent':       'יצירת סוכן SPARC מובנה',
  'debug-loop':               'לולאת דיבוג אוטומטית',
  'init-sparc':               'אתחול פרויקט SPARC',
  'load-rules':               'טעינת קבצי כללים לפרויקט',
  'mcp-setup':                'הגדרת שרתי MCP',
  'prime':                    'הכנת קונטקסט מהיר לפרויקט',
  'review-pr':                'סקירת Pull Request',
  'run-tests':                'הרצת טסטים',
  'sub-task':                 'ניהול משימות-משנה',
  'update-codemaps':          'עדכון מפות קוד ותיעוד',
  'update-docs':              'עדכון תיעוד ו-CLAUDE.md',
  'vcs-github':               'ניהול גרסאות ב-GitHub',
  'worktree':                 'ניהול git worktrees מבודדים',
  'commit':                   'יצירת commit מסוגנן',
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
  'Gmail':                        'Gmail — חיפוש, קריאה, יצירת טיוטות ממש Claude Code',
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
  'docs':              'עדכון תיעוד — CLAUDE.md, READMEs, codemaps',
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
  'setup-pm':          'הגדרת package manager — npm/pnpm/yarn/bun',
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
    errEl.style.display = 'block';
    errEl.textContent = 'שגיאה בטעינת הנתונים — הרץ את הסורק תחילה.';
  }
}

function updateTimestamp(iso) {
  if (!iso) return;
  const s = new Date(iso).toLocaleString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  document.querySelectorAll('.last-updated').forEach(el => el.textContent = `עודכן: ${s}`);
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

// ── Global Tree ────────────────────────────────────────────────────────────

function renderGlobalTree() {
  if (!snapshotData) return;
  const g = snapshotData.claude_global;
  const area = document.getElementById('contentArea');

  const total = [g.agents, g.skills, g.mcp_servers, g.hooks, g.modes, g.memory, g.commands]
    .reduce((s, a) => s + (a || []).length, 0) + (snapshotData.projects || []).length;

  const root = makeNode({
    id: 'root', icon: '🧠', label: 'מערכת Claude Code',
    count: total, color: '#4F6EF7', expanded: true,
    children: [
      makeCategoryNode('agents',     'סוכנים',    g.agents,
        a => makeItemNode(a.name, HE_AGENTS[a.name] || a.purpose, HE_AGENTS_DETAIL[a.name] || a.purpose)),
      makeCategoryNode('skills',     'סקילים',    g.skills,
        s => makeItemNode(s.name, HE_SKILLS[s.name] || s.purpose, s.purpose, s.status && s.status !== 'active' ? s.status : null)),
      makeCategoryNode('mcp_servers','MCP שרתים', g.mcp_servers.filter(m => m.name && m.name !== '[Integration Name]' && m.purpose && m.purpose.length > 3),
        m => makeItemNode(m.name, HE_MCP[m.name] || m.purpose, null, m.tier || null)),
      makeCategoryNode('modes',      'מצבים',     g.modes,
        m => makeItemNode(m.name.replace(/_mode$/,''), HE_MODES[m.name] || m.description || m.trigger, null, m.version ? `v${m.version}` : null)),
      makeCategoryNode('hooks',      'Hooks',     g.hooks,
        (h,i) => {
          const label = h.description ? h.description.substring(0,35) : (h.trigger || `Hook ${i+1}`);
          const he = getHookDesc(h);
          return makeItemNode(label, he, null, h.type);
        }),
      makeCategoryNode('rules',      'כללים',     buildRulesItems(g.rules),
        r => makeItemNode(r.name, r.he, null, r.tag)),
      makeCategoryNode('memory',     'זיכרון',    g.memory,
        m => makeItemNode(m.name || m.file, HE_MEMORY_TYPE[m.type] || m.description || m.type, null, m.type)),
      makeCategoryNode('commands',   'פקודות',    g.commands,
        c => makeItemNode(`/${c.name}`, HE_COMMANDS[c.name] || c.description || null, null, c.category !== 'general' ? c.category : null)),
      {
        icon: '📁', label: 'פרויקטים', count: (snapshotData.projects||[]).length,
        color: COLORS.getCategory('projects').border, expanded: false,
        children: (snapshotData.projects || []).map(p => makeProjectSubtree(p))
      }
    ]
  });

  area.innerHTML = '';
  area.appendChild(buildTreeDOM(root, 0));
}

function buildRulesItems(rules) {
  if (!rules) return [];
  const items = [{ name: 'common', he: HE_RULES['common'] || `${rules.common_count || 0} כללים משותפים`, tag: `${rules.common_count||0} קבצים` }];
  (rules.languages || []).forEach(l => items.push({ name: l, he: HE_RULES[l] || `כללים ל-${l}`, tag: '' }));
  return items;
}

function makeCategoryNode(cat, label, items, childMapper) {
  const c = COLORS.getCategory(cat);
  const icon = CAT_ICONS[cat];
  return {
    icon, label, count: (items || []).length,
    color: c.border, expanded: false,
    children: (items || []).map((item, i) => childMapper(item, i))
  };
}

function makeItemNode(name, he, detail, tag) {
  return { name, he, detail, tag, leaf: true };
}

function makeProjectSubtree(p) {
  const color = COLORS.projectColors[p.id % COLORS.projectColors.length];
  const updated = p.last_modified
    ? new Date(p.last_modified).toLocaleDateString('he-IL') : '—';
  const children = [];
  if (p.description) children.push({ name: 'תיאור', he: p.description, leaf: true });
  if (p.tech_stack && p.tech_stack.length) {
    children.push({
      icon: '⚙️', label: 'Tech Stack', count: p.tech_stack.length, color: '#6B7280',
      expanded: false,
      children: p.tech_stack.map(t => ({ name: t, he: null, leaf: true }))
    });
  }
  children.push({ name: 'סטטוס', he: p.status || 'active', leaf: true });
  children.push({ name: 'קבצים', he: `${p.files_count || 0} קבצים | עודכן: ${updated}`, leaf: true });
  return {
    icon: '📁', label: p.name, id_label: p.id, color,
    expanded: false, clickProject: p.id,
    children
  };
}

// ── Project Tree ───────────────────────────────────────────────────────────

function renderProjectTree(projId) {
  if (!snapshotData) return;
  const proj = snapshotData.projects.find(p => p.id === projId);
  if (!proj) return;
  const area = document.getElementById('contentArea');
  area.innerHTML = '';

  const color = COLORS.projectColors[proj.id % COLORS.projectColors.length];
  const updated = proj.last_modified
    ? new Date(proj.last_modified).toLocaleDateString('he-IL') : '—';

  const children = [];
  if (proj.description) children.push({ name: 'תיאור', he: proj.description, leaf: true });
  if (proj.tech_stack && proj.tech_stack.length) {
    children.push({
      icon: '⚙️', label: 'Tech Stack', count: proj.tech_stack.length, color: '#6B7280',
      expanded: true,
      children: proj.tech_stack.map(t => ({ name: t, leaf: true }))
    });
  }
  children.push({ name: 'סטטוס', he: proj.status || 'active', leaf: true });
  children.push({ name: 'ספרייה', he: proj.folder, leaf: true, isEn: true });
  children.push({ name: 'קבצים', he: `${proj.files_count || 0} קבצים`, leaf: true });
  children.push({ name: 'עדכון אחרון', he: updated, leaf: true });

  const root = makeNode({
    icon: '📁', label: proj.name, id_label: proj.id,
    color, expanded: true, children
  });

  const backRow = document.createElement('div');
  backRow.className = 'back-row';
  backRow.innerHTML = `<button class="btn-back" onclick="setView('global')">← מפה גלובלית</button>`;
  area.appendChild(backRow);
  area.appendChild(buildTreeDOM(root, 0));
}

// ── Tree DOM Builder ───────────────────────────────────────────────────────

function makeNode(props) { return props; }

function buildTreeDOM(node, depth) {
  const wrap = document.createElement('div');
  wrap.className = 'tree-node' + (node.leaf ? ' tree-leaf' : '');
  if (node.expanded) wrap.classList.add('tree-expanded');

  // Row
  const row = document.createElement('div');
  row.className = 'tree-row';
  if (depth > 0) row.style.paddingRight = `${depth * 22 + 16}px`;

  if (!node.leaf) {
    // Toggle arrow
    const arrow = document.createElement('span');
    arrow.className = 'tree-arrow';
    arrow.textContent = node.expanded ? '▼' : '▶';
    row.appendChild(arrow);

    // Icon
    if (node.icon) {
      const ic = document.createElement('span');
      ic.className = 'tree-row-icon';
      ic.textContent = node.icon;
      row.appendChild(ic);
    }

    // Label (Hebrew) + count
    const lbl = document.createElement('span');
    lbl.className = 'tree-row-label';
    if (node.id_label !== undefined) {
      const numSpan = document.createElement('span');
      numSpan.className = 'tree-proj-num';
      numSpan.style.color = node.color || '#4F6EF7';
      numSpan.textContent = node.id_label;
      lbl.appendChild(numSpan);
    }
    lbl.appendChild(document.createTextNode(node.label || ''));
    row.appendChild(lbl);

    if (node.count !== undefined) {
      const cnt = document.createElement('span');
      cnt.className = 'tree-count';
      cnt.style.cssText = `background:${node.color || '#4F6EF7'};`;
      cnt.textContent = node.count;
      row.appendChild(cnt);
    }

    // Color bar
    if (node.color && depth > 0) {
      row.style.borderRight = `3px solid ${node.color}`;
    }
    if (depth === 0) {
      row.classList.add('tree-row-root');
      row.style.borderRight = `4px solid ${node.color || '#4F6EF7'}`;
    }

    // Click: toggle children
    row.onclick = () => {
      if (node.clickProject !== undefined) { setView(`project_${node.clickProject}`); return; }
      const wasExpanded = wrap.classList.contains('tree-expanded');
      wrap.classList.toggle('tree-expanded', !wasExpanded);
      arrow.textContent = !wasExpanded ? '▼' : '▶';
      const childContainer = wrap.querySelector(':scope > .tree-children');
      if (childContainer) childContainer.style.display = !wasExpanded ? 'block' : 'none';
    };

    wrap.appendChild(row);

    // Children
    const childContainer = document.createElement('div');
    childContainer.className = 'tree-children';
    childContainer.style.display = node.expanded ? 'block' : 'none';
    (node.children || []).forEach(child => {
      childContainer.appendChild(buildTreeDOM(child, depth + 1));
    });
    wrap.appendChild(childContainer);

  } else {
    // Leaf node
    const dot = document.createElement('span');
    dot.className = 'tree-leaf-dot';
    dot.textContent = '○';
    row.appendChild(dot);

    // Name — English names get LTR + UPPERCASE
    const nameEl = document.createElement('span');
    const rawName = node.name || '';
    const isEnName = rawName && /^[/a-z0-9\-\._]+$/i.test(rawName);
    if (isEnName || node.isEn) {
      nameEl.className = 'tree-leaf-name tree-en';
      nameEl.dir = 'ltr';
      nameEl.textContent = rawName.toUpperCase();
    } else {
      nameEl.className = 'tree-leaf-name';
      nameEl.textContent = rawName;
    }
    row.appendChild(nameEl);

    // Tag badge
    if (node.tag) {
      const tag = document.createElement('span');
      tag.className = 'tree-tag';
      tag.textContent = node.tag;
      row.appendChild(tag);
    }

    // Hebrew description
    if (node.he) {
      const he = document.createElement('div');
      he.className = 'tree-leaf-he';
      he.textContent = node.he;
      row.appendChild(he);
    }

    // Detail expand
    if (node.detail && node.detail !== node.he) {
      const detailEl = document.createElement('div');
      detailEl.className = 'tree-leaf-detail';
      detailEl.textContent = node.detail;
      detailEl.style.display = 'none';
      const hint = document.createElement('span');
      hint.className = 'tree-detail-hint';
      hint.textContent = '+ פרטים';
      row.appendChild(hint);
      row.appendChild(detailEl);
      row.onclick = () => {
        const open = detailEl.style.display !== 'none';
        detailEl.style.display = open ? 'none' : 'block';
        hint.textContent = open ? '+ פרטים' : '− סגור';
        row.classList.toggle('tree-leaf-open', !open);
      };
      row.style.cursor = 'pointer';
    }

    if (depth > 0) row.style.paddingRight = `${depth * 22 + 16}px`;
    wrap.appendChild(row);
  }

  return wrap;
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
  // Full page reload — picks up latest snapshot.json, JS, and CSS
  window.location.reload(true);
  return;
  // (dead code below kept for fallback reference)
  showLoading(true);
  document.getElementById('contentArea').innerHTML = '';
  try {
    const res = await fetch('data/snapshot.json?t=' + Date.now());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    snapshotData = await res.json();
    showLoading(false);
    updateTimestamp(snapshotData.generated_at);
    buildProjectMenu(snapshotData.projects);
    setView(currentView);
  } catch (err) {
    showLoading(false);
    document.getElementById('errorMsg').style.display = 'block';
    document.getElementById('errorMsg').textContent = 'שגיאה בטעינת הנתונים.';
  }
  if (btn) btn.classList.remove('updating');
}

function showLoading(on) {
  const el = document.getElementById('loadingOverlay');
  if (el) el.style.display = on ? 'flex' : 'none';
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', init);
