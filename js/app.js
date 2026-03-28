/**
 * Schematic Evolution — App Logic v3.0
 * Visual system map + Hebrew descriptions + card grid
 */
let snapshotData = null, currentView = 'global';

const DATA_URL = (() => {
  const loc = window.location.pathname;
  const base = loc.endsWith('/') ? loc : loc.substring(0, loc.lastIndexOf('/') + 1);
  return base + 'data/snapshot.json?t=' + Date.now();
})();

// One-sentence Hebrew descriptions for agents
const HE_AGENTS = {
  'architect':            'מומחה ארכיטקטורת תוכנה — עיצוב מערכת, ניתוח ועסקיות',
  'build-error-resolver': 'פותר שגיאות Build ו-TypeScript — מתקן במינימום שינויים',
  'chief-of-staff':       'מנהל תקשורת — מיון מיילים, Slack, LINE',
  'code-reviewer':        'מבקר קוד — איכות, אבטחה ותחזוקה',
  'cpp-build-resolver':   'פותר שגיאות בנייה C++, CMake ולינקר',
  'cpp-reviewer':         'מבקר קוד C++ — ניהול זיכרון, מקביליות, ביצועים',
  'database-reviewer':    'מומחה PostgreSQL — ביצועים, סכמה, אבטחה',
  'doc-updater':          'מעדכן תיעוד ו-codemaps — CLAUDE.md, READMEs',
  'e2e-runner':           'מריץ בדיקות E2E עם Playwright — זרימות משתמש קריטיות',
  'flutter-reviewer':     'מבקר Flutter/Dart — State Management, ביצועים',
  'general-purpose':      'סוכן כללי — חיפוש, מחקר, ניתוח קבצים',
  'go-build-resolver':    'פותר שגיאות Build ב-Go',
  'go-reviewer':          'מבקר קוד Go — פטרנים, concurrency, טיפול שגיאות',
  'harness-optimizer':    'מנתח ומשפר קונפיגורציית harness מקומית',
  'java-build-resolver':  'פותר שגיאות Java/Maven/Gradle',
  'java-reviewer':        'מבקר Java/Spring Boot — ארכיטקטורה, JPA, אבטחה',
  'kotlin-build-resolver':'פותר שגיאות Kotlin/Gradle',
  'kotlin-reviewer':      'מבקר Kotlin/Android — Coroutines, Compose',
  'loop-operator':        'מפעיל לולאות סוכנים — מעקב התקדמות והתערבות',
  'planner':              'מתכנן פיצ׳רים ורפקטורינג — תוכנית יישום מפורטת',
  'plan':                 'ארכיטקט תוכנה — תכנון אסטרטגיית יישום',
  'python-reviewer':      'מבקר Python — PEP 8, type hints, אבטחה, ביצועים',
  'pytorch-build-resolver':'פותר שגיאות PyTorch, CUDA ואימון מודלים',
  'refactor-cleaner':     'מנקה קוד מת וכפילויות — knip, depcheck, ts-prune',
  'rust-build-resolver':  'פותר שגיאות Rust ו-Cargo',
  'rust-reviewer':        'מבקר Rust — ownership, lifetimes, unsafe',
  'security-reviewer':    'מזהה פגיעויות אבטחה — OWASP, הזרקה, XSS',
  'tdd-guide':            'מנחה TDD — כתיבת טסטים קודם, כיסוי 80%+',
  'typescript-reviewer':  'מבקר TypeScript/JS — type safety, async, אבטחה',
  'claude-code-guide':    'מומחה Claude Code — CLI, hooks, MCP, settings',
  'chief-of-staff':       'ראש מטה — ניהול תקשורת רב-ערוצית',
  'notice-manager':       'ניהול הודעות חשובות ב-Chadshani עם תאריכי פג',
  'project-status':       'דיווח סטטוס פרויקטים — סריקת git, בדיקת התקדמות',
};

// Extended details per agent — shown on expand
const HE_AGENTS_DETAIL = {
  'architect':            'מתכנן את המבנה הכולל של הקוד — מגדיר שכבות, תלויות ומבנה נתונים לפני כתיבת שורת קוד אחת. חיוני לפרויקטים גדולים שמצריכים חשיבה מקדמית.',
  'build-error-resolver': 'מתמקד אך ורק בתיקון שגיאות בנייה בזמן קצר ובמינימום שינויים — חוסך זמן עצום כשה-CI/CD נשבר.',
  'code-reviewer':        'בודק כל קוד שנכתב לפני commit — מונע באגים, בעיות אבטחה וקוד בלתי ניתן לתחזוקה לפני שמגיעים ל-production.',
  'security-reviewer':    'סורק קוד לפגיעויות OWASP, הזרקת SQL, XSS וסודות חשופים — שכבת הגנה אחרונה לפני כל commit.',
  'tdd-guide':            'מוודא שנכתבים טסטים קודם לקוד — מדיניות TDD שמבטיחה כיסוי מינימלי של 80% ומורידה דרמטית את שיעור הבאגים.',
  'planner':              'מפרק כל בקשת פיצ׳ר לתוכנית עבודה מפורטת עם שלבים, סיכונים ותלויות — מונע עבודה כפולה ושינויי כיוון באמצע.',
  'general-purpose':      'הסוכן הרב-תכליתי שמבצע חיפושים, מחקר ומשימות מורכבות כשאין סוכן ספציפי מתאים — הסוכן הכי גמיש במערכת.',
  'python-reviewer':      'מסדר קוד Python לתקן PEP 8, מוסיף type hints ומגלה בעיות ביצועים — שומר על קוד Python נקי ומקצועי.',
  'typescript-reviewer':  'בודק type safety, async correctness ודפוסים לא בטוחים בקוד TypeScript/JS — מניח בסיס יציב לפרויקטי Frontend.',
  'chief-of-staff':       'מנהל את כל ערוצי התקשורת — מיון מיילים, Slack, LINE — ומגדיר עדיפויות כדי שאף הודעה חשובה לא תאבד.',
  'doc-updater':          'מעדכן תיעוד אוטומטית אחרי כל שינוי קוד — מוודא שה-CLAUDE.md, READMEs ומפות הקוד תמיד מסונכרנים עם המציאות.',
  'e2e-runner':           'מריץ בדיקות end-to-end מקצה לקצה על זרימות משתמש קריטיות — מאחר שה-unit tests לא תמיד מגלים בעיות אינטגרציה.',
  'refactor-cleaner':     'מזהה ומסיר קוד מת, כפילויות ויבואות לא בשימוש — מנקה את הקוד בלי לשבור פונקציונליות.',
  'database-reviewer':    'מייעל שאילתות SQL, מגלה missing indexes ובודק אבטחת RLS — שמירה על ביצועי מסד נתונים בסביבת production.',
};

// One-sentence Hebrew descriptions for skills
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
  'commit':                   'יצירת commit עם הודעה מסוגננת',
};

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
    renderGlobalView();
  } else if (view.startsWith('project_')) {
    const id = parseInt(view.replace('project_', ''));
    const proj = snapshotData?.projects?.find(p => p.id === id);
    if (titleEl && proj) titleEl.textContent = proj.name;
    renderProjectView(id);
  }
}

// ── Global View ────────────────────────────────────────────────────────────

function renderGlobalView() {
  if (!snapshotData) return;
  const g = snapshotData.claude_global;
  const area = document.getElementById('contentArea');
  area.innerHTML =
    buildSystemMap(g, snapshotData.projects) +
    buildSection('agents',      'סוכנים',    g.agents,      renderAgentCard) +
    buildSection('skills',      'סקילים',    g.skills,      renderSkillCard) +
    buildSection('mcp_servers', 'MCP שרתים', g.mcp_servers, renderMcpCard) +
    buildSection('modes',       'מצבים',     g.modes,       renderModeCard) +
    buildSection('hooks',       'Hooks',     g.hooks,       renderHookCard) +
    buildSection('memory',      'זיכרון',    g.memory,      renderMemoryCard) +
    buildRulesSection(g.rules) +
    buildCommandsSection(g.commands) +
    buildProjectsSection(snapshotData.projects);
}

// ── System Map (Visual Tree) ───────────────────────────────────────────────

function buildSystemMap(g, projects) {
  const categories = [
    { id: 'agents',      he: 'סוכנים',    count: (g.agents || []).length,      icon: '🤖' },
    { id: 'skills',      he: 'סקילים',    count: (g.skills || []).length,      icon: '✨' },
    { id: 'mcp_servers', he: 'MCP',        count: (g.mcp_servers || []).length, icon: '🔌' },
    { id: 'modes',       he: 'מצבים',     count: (g.modes || []).length,       icon: '🎭' },
    { id: 'hooks',       he: 'Hooks',     count: (g.hooks || []).length,       icon: '🪝' },
    { id: 'rules',       he: 'כללים',     count: (g.rules?.total || 0),        icon: '📋' },
    { id: 'memory',      he: 'זיכרון',    count: (g.memory || []).length,      icon: '💾' },
    { id: 'commands',    he: 'פקודות',    count: (g.commands || []).length,    icon: '⚡' },
    { id: 'projects',    he: 'פרויקטים',  count: (projects || []).length,      icon: '📁' },
  ];

  const total = categories.reduce((s, c) => s + c.count, 0);

  const nodes = categories.map(c => {
    const col = COLORS.getCategory(c.id);
    return `
    <div class="map-branch">
      <div class="map-connector-top"></div>
      <div class="map-node" style="border-color:${col.border};background:${col.border}15"
           onclick="document.querySelector('.section-block[data-cat=\\'${c.id}\\']')?.scrollIntoView({behavior:'smooth',block:'start'})">
        <div class="map-node-icon">${c.icon}</div>
        <div class="map-node-name" style="color:${col.border}">${c.he}</div>
        <div class="map-node-count" style="background:${col.border};color:#fff">${c.count}</div>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="system-map">
    <div class="map-root-node">
      <div class="map-root-icon">🧠</div>
      <div class="map-root-label">מערכת Claude Code</div>
      <div class="map-root-total">${total} רכיבים</div>
    </div>
    <div class="map-connector-bar"></div>
    <div class="map-branches-row">
      ${nodes}
    </div>
  </div>`;
}

// ── Section Builder ────────────────────────────────────────────────────────

function buildSection(cat, title, items, cardFn) {
  if (!items || items.length === 0) return '';
  const c = COLORS.getCategory(cat);
  const icon = CAT_ICONS[cat] || '•';
  return `
  <div class="section-block" data-cat="${cat}">
    <div class="section-header">
      <span class="section-icon" style="background:${c.border}18;color:${c.border}">${icon}</span>
      <span class="section-title">${title}</span>
      <span class="section-badge" style="background:${c.border};color:#fff">${items.length}</span>
    </div>
    <div class="cards-grid">
      ${items.map((item, i) => cardFn(item, i, c)).join('')}
    </div>
  </div>`;
}

// ── Card Renderers ─────────────────────────────────────────────────────────

// Toggle card expand/collapse
function toggleCard(el) {
  el.classList.toggle('card-expanded');
}

function renderAgentCard(a) {
  const he = HE_AGENTS[a.name] || a.purpose?.substring(0, 70) || '';
  const detail = HE_AGENTS_DETAIL[a.name] || a.purpose || '';
  const hasDetail = !!detail && detail !== he;
  return `<div class="node-card cat-agents expandable" onclick="toggleCard(this)">
    <div class="card-name-en" dir="ltr">${esc(a.name)}</div>
    ${he ? `<div class="card-he">${esc(he)}</div>` : ''}
    ${hasDetail ? `<div class="card-expand-content"><div class="card-expand-label">תרומה למערכת:</div><div class="card-expand-text">${esc(detail)}</div></div>` : ''}
    ${hasDetail ? '<div class="card-expand-hint">לחץ להרחבה ↓</div>' : ''}
  </div>`;
}

function renderSkillCard(s) {
  const he = HE_SKILLS[s.name] || s.purpose?.substring(0, 70) || '';
  const detail = s.purpose || '';
  const status = s.status && s.status !== 'active' ? s.status : '';
  const hasDetail = !!detail && detail.length > 60;
  return `<div class="node-card cat-skills expandable" onclick="toggleCard(this)">
    <div class="card-name-en" dir="ltr">${esc(s.name)}</div>
    ${he ? `<div class="card-he">${esc(he)}</div>` : ''}
    ${status ? `<span class="card-tag">${esc(status)}</span>` : ''}
    ${hasDetail ? `<div class="card-expand-content"><div class="card-expand-label">תפקיד:</div><div class="card-expand-text" dir="ltr">${esc(detail)}</div></div>` : ''}
    ${hasDetail ? '<div class="card-expand-hint">לחץ להרחבה ↓</div>' : ''}
  </div>`;
}

function renderMcpCard(m) {
  const tier = m.tier ? m.tier.replace('TIER ', '') : '';
  const hasDetail = !!m.purpose && m.purpose.length > 40;
  return `<div class="node-card cat-mcp_servers${hasDetail ? ' expandable' : ''}"${hasDetail ? ' onclick="toggleCard(this)"' : ''}>
    <div class="card-name-en" dir="ltr">${esc(m.name)}</div>
    ${m.purpose ? `<div class="card-he">${esc(m.purpose.substring(0, 70))}</div>` : ''}
    ${tier ? `<span class="card-tag">Tier ${esc(tier)}</span>` : ''}
    ${hasDetail ? `<div class="card-expand-content"><div class="card-expand-label">פרטים:</div><div class="card-expand-text" dir="ltr">${esc(m.purpose)}</div></div>` : ''}
    ${hasDetail ? '<div class="card-expand-hint">לחץ להרחבה ↓</div>' : ''}
  </div>`;
}

function renderModeCard(m) {
  const rawName = (m.name || '').replace('_mode', '');
  return `<div class="node-card cat-modes">
    <div class="card-name-en" dir="ltr">${esc(rawName)}</div>
    ${m.trigger ? `<div class="card-he">${esc(m.trigger.substring(0, 80))}</div>` : ''}
    ${m.version ? `<span class="card-tag">v${esc(m.version)}</span>` : ''}
  </div>`;
}

function renderHookCard(h) {
  return `<div class="node-card cat-hooks">
    <div class="card-name-en" dir="ltr">${esc(h.type || 'Hook')}</div>
    ${h.trigger ? `<div class="card-he">${esc(h.trigger.substring(0, 80))}</div>` : ''}
    ${h.script ? `<span class="card-tag" dir="ltr">${esc(h.script.split('/').pop())}</span>` : ''}
  </div>`;
}

function renderMemoryCard(m) {
  return `<div class="node-card cat-memory">
    <div class="card-name-en" dir="ltr">${esc(m.file || m.name)}</div>
    ${m.name && m.name !== m.file ? `<div class="card-he">${esc(m.name)}</div>` : ''}
    ${m.type ? `<span class="card-tag">${esc(m.type)}</span>` : ''}
  </div>`;
}

function buildRulesSection(rules) {
  if (!rules) return '';
  const c = COLORS.getCategory('rules');
  const langs = rules.languages || [];
  const items = [
    `<div class="node-card cat-rules">
      <div class="card-name">Common</div>
      <div class="card-he">${rules.common_count || 0} קבצי כללים משותפים לכל שפה</div>
    </div>`,
    ...langs.map(l => `<div class="node-card cat-rules">
      <div class="card-name">${esc(l)}</div>
      <div class="card-he">כללים ספציפיים לשפת ${esc(l)}</div>
    </div>`)
  ];
  return `
  <div class="section-block" data-cat="rules">
    <div class="section-header">
      <span class="section-icon" style="background:${c.border}18;color:${c.border}">${CAT_ICONS['rules']}</span>
      <span class="section-title">כללים</span>
      <span class="section-badge" style="background:${c.border};color:#fff">${rules.total || items.length}</span>
    </div>
    <div class="cards-grid">${items.join('')}</div>
  </div>`;
}

function buildCommandsSection(commands) {
  if (!commands || commands.length === 0) return '';
  const c = COLORS.getCategory('commands');
  const preview = commands.slice(0, 30);
  const more = commands.length - preview.length;
  return `
  <div class="section-block" data-cat="commands">
    <div class="section-header">
      <span class="section-icon" style="background:${c.border}18;color:${c.border}">${CAT_ICONS['commands']}</span>
      <span class="section-title">פקודות</span>
      <span class="section-badge" style="background:${c.border};color:#fff">${commands.length}</span>
    </div>
    <div class="cards-grid">
      ${preview.map(cmd => `<div class="node-card cat-commands card-compact">
        <div class="card-name">/${esc(cmd.name)}</div>
        ${cmd.category && cmd.category !== 'general' ? `<span class="card-tag">${esc(cmd.category)}</span>` : ''}
      </div>`).join('')}
      ${more > 0 ? `<div class="node-card cat-commands card-compact card-more">+${more} פקודות נוספות</div>` : ''}
    </div>
  </div>`;
}

function buildProjectsSection(projects) {
  if (!projects || projects.length === 0) return '';
  const c = COLORS.getCategory('projects');
  return `
  <div class="section-block" data-cat="projects">
    <div class="section-header">
      <span class="section-icon" style="background:${c.border}18;color:${c.border}">${CAT_ICONS['projects']}</span>
      <span class="section-title">פרויקטים</span>
      <span class="section-badge" style="background:${c.border};color:#fff">${projects.length}</span>
    </div>
    <div class="cards-grid">
      ${projects.map(p => {
        const color = COLORS.projectColors[p.id % COLORS.projectColors.length];
        const updated = p.last_modified
          ? new Date(p.last_modified).toLocaleDateString('he-IL')
          : '';
        return `<div class="node-card project-clickable" style="border-top:4px solid ${color}" onclick="setView('project_${p.id}')">
          <div class="card-proj-header">
            <span class="card-proj-num" style="color:${color}">${p.id}</span>
            <span class="card-name" style="flex:1">${esc(p.name)}</span>
          </div>
          ${p.description ? `<div class="card-he">${esc(p.description)}</div>` : ''}
          <div class="card-footer">
            ${p.tech_stack && p.tech_stack.length ? p.tech_stack.map(t => `<span class="card-tag">${esc(t)}</span>`).join('') : ''}
            ${p.status ? `<span class="card-tag" style="background:${color}22;color:${color}">${esc(p.status)}</span>` : ''}
            ${updated ? `<span class="card-tag">${updated}</span>` : ''}
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

// ── Project Detail View ────────────────────────────────────────────────────

function renderProjectView(projId) {
  if (!snapshotData) return;
  const proj = snapshotData.projects.find(p => p.id === projId);
  if (!proj) return;
  const color = COLORS.projectColors[proj.id % COLORS.projectColors.length];
  const area = document.getElementById('contentArea');
  const updated = proj.last_modified
    ? new Date(proj.last_modified).toLocaleDateString('he-IL', {day:'2-digit',month:'2-digit',year:'numeric'})
    : '—';

  const techCards = (proj.tech_stack || []).map(t =>
    `<div class="node-card cat-projects card-compact">
      <div class="card-name">${esc(t)}</div>
    </div>`).join('');

  area.innerHTML = `
    <div class="project-hero" style="border-right:6px solid ${color}">
      <div class="project-hero-id" style="color:${color}">${proj.id}</div>
      <div class="project-hero-name">${esc(proj.name)}</div>
      <div class="project-hero-folder" dir="ltr">${esc(proj.folder || '')}</div>
      ${proj.description ? `<div class="project-hero-desc">${esc(proj.description)}</div>` : ''}
      <div class="project-hero-meta">
        ${proj.status ? `<span class="card-tag" style="background:${color}22;color:${color};font-weight:700">${esc(proj.status)}</span>` : ''}
        ${proj.files_count ? `<span class="card-tag">${proj.files_count} קבצים</span>` : ''}
        <span class="card-tag">עודכן: ${updated}</span>
      </div>
    </div>

    ${proj.tech_stack && proj.tech_stack.length > 0 ? `
    <div class="section-block">
      <div class="section-header">
        <span class="section-icon" style="background:#4F6EF718;color:#4F6EF7">⚙️</span>
        <span class="section-title">Tech Stack</span>
        <span class="section-badge" style="background:#4F6EF7;color:#fff">${proj.tech_stack.length}</span>
      </div>
      <div class="cards-grid">${techCards}</div>
    </div>` : ''}

    <div class="section-block">
      <button class="btn-back" onclick="setView('global')">← חזרה למפה הגלובלית</button>
    </div>
  `;
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
