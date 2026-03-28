/**
 * Schematic Evolution — App Logic v2.0 (Card Layout)
 */
let snapshotData = null, currentView = 'global';

const DATA_URL = (() => {
  const loc = window.location.pathname;
  const base = loc.endsWith('/') ? loc : loc.substring(0, loc.lastIndexOf('/') + 1);
  return base + 'data/snapshot.json?t=' + Date.now();
})();

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
      <span class="sidebar-label">${p.name}</span>`;
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

  area.innerHTML = buildHeroStats(g, snapshotData.projects) +
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

function buildHeroStats(g, projects) {
  const items = [
    { label: 'סוכנים',    val: (g.agents      || []).length, cat: 'agents'      },
    { label: 'סקילים',    val: (g.skills      || []).length, cat: 'skills'      },
    { label: 'MCP',        val: (g.mcp_servers || []).length, cat: 'mcp_servers' },
    { label: 'Hooks',      val: (g.hooks       || []).length, cat: 'hooks'       },
    { label: 'מצבים',     val: (g.modes       || []).length, cat: 'modes'       },
    { label: 'פרויקטים',  val: (projects      || []).length, cat: 'projects'    },
    { label: 'פקודות',    val: (g.commands    || []).length, cat: 'commands'    },
    { label: 'זיכרון',    val: (g.memory      || []).length, cat: 'memory'      },
  ];
  return `<div class="hero-stats">${items.map(i => {
    const c = COLORS.getCategory(i.cat);
    return `<div class="hero-stat-item">
      <div class="hero-stat-num" style="color:${c.border}">${i.val}</div>
      <div class="hero-stat-label">${i.label}</div>
    </div>`;
  }).join('')}</div>`;
}

function buildSection(cat, title, items, cardFn) {
  if (!items || items.length === 0) return '';
  const c = COLORS.getCategory(cat);
  const icon = CAT_ICONS[cat] || '•';
  return `
  <div class="section-block">
    <div class="section-header">
      <span class="section-icon" style="color:${c.border}">${icon}</span>
      <span class="section-title">${title}</span>
      <span class="section-badge" style="background:${c.border}22;color:${c.border};border:1px solid ${c.border}44">${items.length}</span>
    </div>
    <div class="cards-grid">
      ${items.map((item, i) => cardFn(item, i, c)).join('')}
    </div>
  </div>`;
}

function renderAgentCard(a) {
  const c = COLORS.getCategory('agents');
  return `<div class="node-card cat-agents" title="${esc(a.purpose || '')}">
    <div class="card-name">${esc(a.name)}</div>
    ${a.purpose ? `<div class="card-desc">${esc(a.purpose)}</div>` : ''}
  </div>`;
}

function renderSkillCard(s) {
  const status = s.status && s.status !== 'active' ? s.status : '';
  return `<div class="node-card cat-skills" title="${esc(s.purpose || '')}">
    <div class="card-name">${esc(s.name)}</div>
    ${s.purpose ? `<div class="card-desc">${esc(s.purpose)}</div>` : ''}
    ${status ? `<span class="card-tag">${esc(status)}</span>` : ''}
  </div>`;
}

function renderMcpCard(m) {
  return `<div class="node-card cat-mcp_servers" title="${esc(m.purpose || '')}">
    <div class="card-name">${esc(m.name)}</div>
    ${m.purpose ? `<div class="card-desc">${esc(m.purpose)}</div>` : ''}
    ${m.tier ? `<span class="card-tag">Tier ${esc(String(m.tier))}</span>` : ''}
  </div>`;
}

function renderModeCard(m) {
  const name = m.name ? m.name.replace('_mode', '') : '';
  return `<div class="node-card cat-modes" title="${esc(m.trigger || '')}">
    <div class="card-name">${esc(name)}</div>
    ${m.trigger ? `<div class="card-desc">${esc(m.trigger)}</div>` : ''}
    ${m.version ? `<span class="card-tag">v${esc(m.version)}</span>` : ''}
  </div>`;
}

function renderHookCard(h, i) {
  return `<div class="node-card cat-hooks">
    <div class="card-name">${esc(h.type || 'Hook')}</div>
    ${h.trigger ? `<div class="card-desc">${esc(h.trigger)}</div>` : ''}
    ${h.script ? `<span class="card-tag">${esc(h.script.split('/').pop())}</span>` : ''}
  </div>`;
}

function renderMemoryCard(m) {
  return `<div class="node-card cat-memory">
    <div class="card-name">${esc(m.name || m.file)}</div>
    ${m.type ? `<span class="card-tag">${esc(m.type)}</span>` : ''}
  </div>`;
}

function buildRulesSection(rules) {
  if (!rules) return '';
  const c = COLORS.getCategory('rules');
  const langs = rules.languages || [];
  const items = [
    `<div class="node-card cat-rules"><div class="card-name">Common</div><div class="card-desc">${rules.common_count || 0} קבצי כללים</div></div>`,
    ...langs.map(l => `<div class="node-card cat-rules"><div class="card-name">${esc(l)}</div><div class="card-desc">כללים ל-${esc(l)}</div></div>`)
  ];
  return `
  <div class="section-block">
    <div class="section-header">
      <span class="section-icon" style="color:${c.border}">${CAT_ICONS['rules']}</span>
      <span class="section-title">כללים</span>
      <span class="section-badge" style="background:${c.border}22;color:${c.border};border:1px solid ${c.border}44">${rules.total || items.length}</span>
    </div>
    <div class="cards-grid">${items.join('')}</div>
  </div>`;
}

function buildCommandsSection(commands) {
  if (!commands || commands.length === 0) return '';
  const c = COLORS.getCategory('commands');
  // Show count summary + first 12 inline
  const preview = commands.slice(0, 24);
  const more = commands.length - preview.length;
  return `
  <div class="section-block">
    <div class="section-header">
      <span class="section-icon" style="color:${c.border}">${CAT_ICONS['commands']}</span>
      <span class="section-title">פקודות</span>
      <span class="section-badge" style="background:${c.border}22;color:${c.border};border:1px solid ${c.border}44">${commands.length}</span>
    </div>
    <div class="cards-grid">
      ${preview.map(cmd => `<div class="node-card cat-commands card-compact">
        <div class="card-name">/${esc(cmd.name)}</div>
        ${cmd.category ? `<span class="card-tag">${esc(cmd.category)}</span>` : ''}
      </div>`).join('')}
      ${more > 0 ? `<div class="node-card cat-commands card-compact card-more">+${more} נוספות</div>` : ''}
    </div>
  </div>`;
}

function buildProjectsSection(projects) {
  if (!projects || projects.length === 0) return '';
  const c = COLORS.getCategory('projects');
  return `
  <div class="section-block">
    <div class="section-header">
      <span class="section-icon" style="color:${c.border}">${CAT_ICONS['projects']}</span>
      <span class="section-title">פרויקטים</span>
      <span class="section-badge" style="background:${c.border}22;color:${c.border};border:1px solid ${c.border}44">${projects.length}</span>
    </div>
    <div class="cards-grid">
      ${projects.map(p => {
        const color = COLORS.projectColors[p.id % COLORS.projectColors.length];
        return `<div class="node-card" style="border-top:3px solid ${color}" onclick="setView('project_${p.id}')" title="${esc(p.description || '')}">
          <div class="card-name">
            <span style="color:${color};font-weight:700;margin-left:6px">${p.id}</span>
            ${esc(p.name)}
          </div>
          ${p.description ? `<div class="card-desc">${esc(p.description)}</div>` : ''}
          <div class="card-footer">
            ${p.status ? `<span class="card-tag" style="background:${color}22;color:${color}">${esc(p.status)}</span>` : ''}
            ${p.files_count ? `<span class="card-tag">${p.files_count} קבצים</span>` : ''}
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

// ── Project View ───────────────────────────────────────────────────────────

function renderProjectView(projId) {
  if (!snapshotData) return;
  const proj = snapshotData.projects.find(p => p.id === projId);
  if (!proj) return;
  const color = COLORS.projectColors[proj.id % COLORS.projectColors.length];
  const area = document.getElementById('contentArea');

  const techCards = (proj.tech_stack || []).map(t =>
    `<div class="node-card cat-projects card-compact">
      <div class="card-name">${esc(t)}</div>
    </div>`
  ).join('');

  const updated = proj.last_modified
    ? new Date(proj.last_modified).toLocaleDateString('he-IL')
    : '—';

  area.innerHTML = `
    <div class="project-hero" style="border-right:5px solid ${color}">
      <div class="project-hero-id" style="color:${color}">${proj.id}</div>
      <div class="project-hero-name">${esc(proj.name)}</div>
      <div class="project-hero-folder">${esc(proj.folder || '')}</div>
      ${proj.description ? `<div class="project-hero-desc">${esc(proj.description)}</div>` : ''}
      <div class="project-hero-meta">
        ${proj.status ? `<span class="card-tag" style="background:${color}22;color:${color}">${esc(proj.status)}</span>` : ''}
        ${proj.files_count ? `<span class="card-tag">${proj.files_count} קבצים</span>` : ''}
        <span class="card-tag">עודכן: ${updated}</span>
      </div>
    </div>

    ${proj.tech_stack && proj.tech_stack.length > 0 ? `
    <div class="section-block">
      <div class="section-header">
        <span class="section-icon">⚙️</span>
        <span class="section-title">Tech Stack</span>
        <span class="section-badge">${proj.tech_stack.length}</span>
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
  agents:     '🤖',
  skills:     '✨',
  mcp_servers:'🔌',
  hooks:      '🪝',
  modes:      '🎭',
  rules:      '📋',
  memory:     '💾',
  commands:   '⚡',
  projects:   '📁',
};

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function refreshData() {
  const btn = document.getElementById('btnRefresh');
  if (btn) btn.classList.add('updating');
  showLoading(true);
  document.getElementById('contentArea').innerHTML = '';
  // Re-fetch without cache
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
    const errEl = document.getElementById('errorMsg');
    errEl.style.display = 'block';
    errEl.textContent = 'שגיאה בטעינת הנתונים.';
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
