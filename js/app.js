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
      makeCategoryNode('mcp_servers','MCP שרתים', g.mcp_servers,
        m => makeItemNode(m.name, m.purpose, null, m.tier || null)),
      makeCategoryNode('modes',      'מצבים',     g.modes,
        m => makeItemNode(m.name.replace('_mode',''), m.trigger, null, m.version ? `v${m.version}` : null)),
      makeCategoryNode('hooks',      'Hooks',     g.hooks,
        (h,i) => makeItemNode(h.type || `Hook ${i+1}`, h.trigger, null, h.script ? h.script.split('/').pop() : null)),
      makeCategoryNode('rules',      'כללים',     buildRulesItems(g.rules),
        r => makeItemNode(r.name, r.he, null, r.tag)),
      makeCategoryNode('memory',     'זיכרון',    g.memory,
        m => makeItemNode(m.file, m.name !== m.file ? m.name : null, null, m.type)),
      makeCategoryNode('commands',   'פקודות',    g.commands,
        c => makeItemNode(`/${c.name}`, null, null, c.category !== 'general' ? c.category : null)),
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
  const items = [{ name: 'Common', he: `${rules.common_count || 0} כללים משותפים`, tag: '' }];
  (rules.languages || []).forEach(l => items.push({ name: l, he: `כללים ל-${l}`, tag: '' }));
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

    // Name — English names get LTR
    const nameEl = document.createElement('span');
    const isEnName = node.name && /^[a-z0-9\-\/\._]+$/i.test(node.name);
    if (isEnName || node.isEn) {
      nameEl.className = 'tree-leaf-name tree-en';
      nameEl.dir = 'ltr';
    } else {
      nameEl.className = 'tree-leaf-name';
    }
    nameEl.textContent = node.name || '';
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
