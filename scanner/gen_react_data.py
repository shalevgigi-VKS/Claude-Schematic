"""
gen_react_data.py — Converts data/snapshot.json → react-app/src/data/mindMapData.ts
Runs after scan_system.py as part of the weekly auto-update pipeline.
"""
import json, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

SNAPSHOT    = Path(__file__).parent.parent / 'data' / 'snapshot.json'
OUT_TS      = Path(__file__).parent.parent / 'react-app' / 'src' / 'data' / 'mindMapData.ts'
OUT_OVERVIEW= Path(__file__).parent.parent / 'react-app' / 'src' / 'data' / 'systemOverview.ts'

# ── helpers ────────────────────────────────────────────────────────────────

def node(id, name, type_, color, desc=None, children=None):
    n = {"id": id, "name": name, "type": type_, "color": color}
    if desc:      n["description"] = desc
    if children:  n["children"] = children
    return n

def to_ts(obj, indent=0):
    pad  = "  " * indent
    pad2 = "  " * (indent + 1)
    parts = [f"id: '{obj['id']}'", f"name: '{obj['name']}'", f"type: '{obj['type']}'"]
    if "color"       in obj: parts.append(f"color: '{obj['color']}'")
    if "description" in obj: parts.append(f"description: '{obj['description']}'")
    if "children"    in obj:
        kids = ",\n".join(f"{pad2}  {to_ts(c, indent+2)}" for c in obj["children"])
        parts.append(f"children: [\n{kids},\n{pad2}]")
    inner = f",\n{pad2}".join(parts)
    return "{ " + inner + f"\n{pad}}}"

# ── load snapshot ──────────────────────────────────────────────────────────

snap = json.loads(SNAPSHOT.read_text(encoding='utf-8'))
cg   = snap.get('claude_global', {})
projs = snap.get('projects', [])

# ── color maps ─────────────────────────────────────────────────────────────

STATUS_COLOR = {
    'complete':    '#10B981',
    'maintenance': '#F59E0B',
    'active':      '#3B82F6',
    'frozen':      '#94A3B8',
    'development': '#8B5CF6',
}

# ── build tree ─────────────────────────────────────────────────────────────

def build_agents(agents):
    groups = {
        'agents-arch':    ('ארכיטקטורה ותכנון', '#EF4444', []),
        'agents-review':  ('ביקורת קוד',         '#F87171', []),
        'agents-build':   ('פתרון Build',         '#DC2626', []),
        'agents-ops':     ('תפעול',               '#B91C1C', []),
        'agents-special': ('ייחודיים',            '#991B1B', []),
    }
    arch_names  = {'architect','planner','plan','tdd-guide'}
    review_suf  = {'-reviewer'}
    build_suf   = {'-build-resolver','-build-resolver'}
    build_names = {'build-error-resolver','go-build-resolver','rust-build-resolver',
                   'cpp-build-resolver','java-build-resolver','kotlin-build-resolver',
                   'pytorch-build-resolver'}
    ops_names   = {'backup-agent','bug-learner','loop-operator','refactor-cleaner',
                   'harness-optimizer','doc-updater','e2e-runner'}

    # Descriptions per agent name (human-readable purpose)
    agent_desc = {
        'architect':             'תכנון ארכיטקטורת מערכת',
        'planner':               'תכנון שלבי מימוש',
        'plan':                  'בניית תוכנית עבודה',
        'tdd-guide':             'פיתוח מונחה בדיקות',
        'code-reviewer':         'ביקורת קוד — איכות ואבטחה',
        'typescript-reviewer':   'ביקורת TypeScript/JavaScript',
        'python-reviewer':       'ביקורת Python ו-PEP 8',
        'rust-reviewer':         'ביקורת Rust — בעלות ו-lifetimes',
        'go-reviewer':           'ביקורת Go — idiomatic patterns',
        'cpp-reviewer':          'ביקורת C++ — זיכרון ובטיחות',
        'java-reviewer':         'ביקורת Java ו-Spring Boot',
        'kotlin-reviewer':       'ביקורת Kotlin ו-Android',
        'flutter-reviewer':      'ביקורת Flutter/Dart',
        'security-reviewer':     'ניתוח פגיעויות אבטחה',
        'database-reviewer':     'אופטימיזציית SQL ו-DB',
        'build-error-resolver':  'תיקון שגיאות Build',
        'go-build-resolver':     'תיקון Build ל-Go',
        'rust-build-resolver':   'תיקון Build ל-Rust',
        'cpp-build-resolver':    'תיקון Build ל-C++',
        'java-build-resolver':   'תיקון Build ל-Java',
        'kotlin-build-resolver': 'תיקון Build ל-Kotlin',
        'pytorch-build-resolver':'תיקון שגיאות PyTorch/CUDA',
        'backup-agent':          'גיבוי חודשי של המערכת',
        'bug-learner':           'למידה ומניעת באגים חוזרים',
        'loop-operator':         'ניטור לולאות סוכן אוטונומיות',
        'refactor-cleaner':      'ניקוי קוד מת ו-dead imports',
        'harness-optimizer':     'אופטימיזציית תצורת הסוכן',
        'doc-updater':           'עדכון תיעוד ו-codemaps',
        'e2e-runner':            'בדיקות End-to-End עם Playwright',
        'general-purpose':       'סוכן כלל-תכליתי',
        'Explore':               'חקירת codebase מהירה',
    }

    for a in agents:
        name = a if isinstance(a, str) else a.get('name','?')
        id_  = f"ag-{name.replace('-','_').replace('/','_')}"
        desc = agent_desc.get(name, f'סוכן מתמחה — {name}')
        n    = node(id_, name, 'agent', '#EF4444', desc)
        if name in arch_names:
            n['color'] = '#EF4444'; groups['agents-arch'][2].append(n)
        elif any(name.endswith(s) for s in ['-reviewer']):
            n['color'] = '#F87171'; groups['agents-review'][2].append(n)
        elif name in build_names:
            n['color'] = '#DC2626'; groups['agents-build'][2].append(n)
        elif name in ops_names:
            n['color'] = '#B91C1C'; groups['agents-ops'][2].append(n)
        else:
            n['color'] = '#991B1B'; groups['agents-special'][2].append(n)

    children = []
    for gid, (gname, gcolor, kids) in groups.items():
        if kids:
            for k in kids: k['color'] = gcolor
            children.append(node(gid, gname, 'folder', gcolor, None, kids))
    return children

def build_skills(skills):
    dev_names     = {'tdd-workflow','e2e-testing','ai-regression-testing',
                     'verification-loop','eval-harness'}
    design_names  = {'frontend-design','update-docs','update-codemaps'}
    learn_names   = {'continuous-learning','continuous-learning-v2','ideation',
                     'strategic-compact','iterative-retrieval'}

    groups = {
        'skills-dev':    ('פיתוח ובדיקות',  '#3B82F6', []),
        'skills-design': ('עיצוב ועדכון',   '#60A5FA', []),
        'skills-learn':  ('למידה ושיפור',   '#93C5FD', []),
        'skills-infra':  ('תשתית',          '#BFDBFE', []),
    }
    skill_desc_map = {
        'tdd-workflow':            'פיתוח מונחה בדיקות TDD',
        'e2e-testing':             'בדיקות E2E עם Playwright',
        'ai-regression-testing':   'רגרסיה לפיתוח מבוסס AI',
        'verification-loop':       'לולאת אימות תוצרים',
        'eval-harness':            'מסגרת הערכת איכות',
        'frontend-design':         'ממשק משתמש — production grade',
        'update-docs':             'עדכון תיעוד אוטומטי',
        'update-codemaps':         'עדכון מפות קוד',
        'continuous-learning':     'למידה מדפוסים חוזרים',
        'continuous-learning-v2':  'למידה אינסטינקטיבית',
        'ideation':                'עיבוד brain dumps לתוכנית',
        'strategic-compact':       'דחיסת context אסטרטגית',
        'iterative-retrieval':     'שיפור הדרגתי של context',
    }

    for s in skills:
        name   = s if isinstance(s, str) else s.get('name','?')
        id_    = f"sk-{name.replace('-','_').replace('/','_')}"
        status = '' if isinstance(s, str) else s.get('status','')
        desc   = skill_desc_map.get(name, f'סקיל — {name}')
        n      = node(id_, name, 'skill', '#3B82F6', desc)
        if name in dev_names:
            n['color'] = '#3B82F6'; groups['skills-dev'][2].append(n)
        elif name in design_names:
            n['color'] = '#60A5FA'; groups['skills-design'][2].append(n)
        elif name in learn_names:
            n['color'] = '#93C5FD'; groups['skills-learn'][2].append(n)
        else:
            n['color'] = '#BFDBFE'; groups['skills-infra'][2].append(n)

    return [node(gid, gname, 'folder', gcol, None, kids)
            for gid, (gname, gcol, kids) in groups.items() if kids]

def build_projects(projs):
    children = []
    for p in projs:
        name   = p.get('name','?')
        status = p.get('status','active').lower()
        color  = STATUS_COLOR.get(status, '#6366F1')
        tech   = ', '.join(p.get('tech_stack', []))
        desc   = f"{status.capitalize()} — {p.get('description','')} | {tech}".rstrip(' |')
        id_    = f"proj-{p.get('id','?')}"
        children.append(node(id_, name, 'reference', color, desc))
    return children

# ── assemble tree ──────────────────────────────────────────────────────────

agents_list = cg.get('agents', [])
skills_list = cg.get('skills', [])
modes_list  = cg.get('modes', [])
mcp_list    = cg.get('mcp_servers', [])
hooks_list  = cg.get('hooks', [])

# agents
agent_children = build_agents(agents_list)
total_agents = sum(len(g.get('children',[])) for g in agent_children)

# skills
skill_children = build_skills(skills_list)
total_skills = len(skills_list)

# modes — split auto/manual
auto_modes   = ['shadow_agent_mode','project_closure_mode','monthly_calibration_mode','project_status_review_mode']
mode_auto, mode_manual = [], []
for m in modes_list:
    name = m if isinstance(m, str) else m.get('name','?')
    desc = '' if isinstance(m, str) else m.get('description','')
    id_  = f"md-{name.replace('_','-')}"
    n    = node(id_, name, 'tool', '#8B5CF6' if name in auto_modes else '#A78BFA', desc[:60] if desc else None)
    (mode_auto if name in auto_modes else mode_manual).append(n)

# mcp servers — keep 4 sub-groups by name pattern
core_mcps, ai_mcps, thunder_mcps, data_mcps = [], [], [], []
for m in mcp_list:
    name = m if isinstance(m, str) else m.get('name','?')
    lname = name.lower()
    id_   = f"mcp-{name.lower().replace(' ','-').replace('/','_')[:20]}"
    desc  = '' if isinstance(m, str) else m.get('purpose','')[:60]
    n     = node(id_, name, 'plugin', '#10B981', desc if desc else None)
    if any(x in lname for x in ['playwright','mcp2cli','builder','market','lobehub']):
        n['color'] = '#10B981'; core_mcps.append(n)
    elif any(x in lname for x in ['stitch','figma','ui-ux','uiux']):
        n['color'] = '#34D399'; ai_mcps.append(n)
    elif any(x in lname for x in ['thunder','claudeusage']):
        n['color'] = '#6EE7B7'; thunder_mcps.append(n)
    else:
        n['color'] = '#A7F3D0'; data_mcps.append(n)

mcp_children = []
if core_mcps:    mcp_children.append(node('mcp-core',    'ליבה ופיתוח',              'folder','#10B981',None,core_mcps))
if ai_mcps:      mcp_children.append(node('mcp-ai',      'AI ועיצוב',                'folder','#34D399',None,ai_mcps))
if thunder_mcps: mcp_children.append(node('mcp-thunder',  'Thunder Suite',            'folder','#6EE7B7',None,thunder_mcps))
if data_mcps:    mcp_children.append(node('mcp-data',    'נתונים וניהול',            'folder','#A7F3D0',None,data_mcps))

# hooks
hook_nodes = []
hook_colors = {'PreToolUse':'#EC4899','PostToolUse':'#F472B6','PreCompact':'#FBCFE8'}
hook_count  = {'PreToolUse':0,'PostToolUse':0,'PreCompact':0}
for h in hooks_list:
    htype = h.get('type','?') if isinstance(h, dict) else '?'
    hook_count[htype] = hook_count.get(htype,0) + 1
    n = node(f"hook-{htype.lower()}-{hook_count.get(htype,1)}",
             htype, 'tool', hook_colors.get(htype,'#EC4899'),
             h.get('description','')[:60] if isinstance(h, dict) else None)
    hook_nodes.append(n)

# rules
rules_data = cg.get('rules', {})
rules_count = rules_data.get('total', 65) if isinstance(rules_data, dict) else 65

# ── final tree ─────────────────────────────────────────────────────────────

tree = node('root','אבולוציה סכמטית SG','root','#6366F1',
    'מפת מערכת Claude — סוכנים, סקילים, מצבים, MCP ופרויקטים',
    [
        node('agents',   'סוכנים',          'folder','#EF4444', f'{total_agents} סוכנים מתמחים', agent_children),
        node('skills',   'סקילים',          'folder','#3B82F6', f'{total_skills} סקילים פעילים', skill_children),
        node('modes',    'מצבי עבודה',      'folder','#8B5CF6', f'{len(modes_list)} מצבים — shadow_agent תמיד פעיל',
             ([node('modes-auto',  'אוטומטיים','folder','#8B5CF6',None,mode_auto)]   if mode_auto   else []) +
             ([node('modes-manual','ידניים',   'folder','#A78BFA',None,mode_manual)] if mode_manual else [])),
        node('mcp',      'שרתי MCP',        'folder','#10B981', f'{len(mcp_list)} שרתים פעילים', mcp_children),
        node('projects', 'פרויקטים',        'folder','#F59E0B', f'{len(projs)} פרויקטים', build_projects(projs)),
        node('hooks',    'Hooks',            'folder','#EC4899', f'{len(hooks_list)} hooks', hook_nodes),
        node('rules',    'כללים',           'folder','#06B6D4', f'{rules_count} כללים', [
            node('rules-common','Common',  'folder','#06B6D4',None,[
                node(f'rule-{r}',r,'file','#06B6D4') for r in
                ['coding-style','git-workflow','testing','performance','security','agents','patterns','hooks','development-workflow']
            ]),
            node('rules-langs','שפות','folder','#22D3EE',None,[
                node(f'rule-{r}',r,'file','#22D3EE') for r in
                ['TypeScript','Python','Go','Rust','C++','Java','Kotlin','PHP']
            ]),
        ]),
    ]
)

# ── mermaid system overview ────────────────────────────────────────────────

def gen_mermaid_overview():
    from datetime import datetime
    lines = ['mindmap', '  root((**מערכת Claude SG**))']

    # Agents
    lines.append('    **סוכנים**')
    for g in agent_children:
        gname = g['name']
        lines.append(f'      **{gname}**')
        for kid in g.get('children', [])[:6]:
            lines.append(f'        {kid["name"]}')
        extra = len(g.get('children',[])) - 6
        if extra > 0:
            lines.append(f'        ועוד {extra} סוכנים')

    # Skills
    lines.append('    **סקילים**')
    for g in skill_children:
        gname = g['name']
        count = len(g.get('children', []))
        lines.append(f'      **{gname}** ({count})')

    # Modes
    lines.append('    **מצבי עבודה**')
    if mode_auto:
        lines.append(f'      אוטומטיים ({len(mode_auto)})')
    if mode_manual:
        lines.append(f'      ידניים ({len(mode_manual)})')

    # MCP
    lines.append('    **שרתי MCP**')
    for g in mcp_children:
        count = len(g.get('children', []))
        lines.append(f'      **{g["name"]}** ({count})')

    # Hooks
    lines.append(f'    **Hooks** ({len(hooks_list)})')
    for htype in ['PreToolUse', 'PostToolUse', 'PreCompact']:
        c = hook_count.get(htype, 0)
        if c:
            lines.append(f'      {htype} ({c})')

    # Projects
    lines.append('    **פרויקטים**')
    for p in projs:
        status = p.get('status','active').lower()
        icon = {'complete':'✅','maintenance':'🔧','active':'🔵','frozen':'❄️','development':'🟣'}.get(status,'📁')
        lines.append(f'      {icon} {p.get("name","?")}')

    # Rules
    lines.append(f'    **כללים** ({rules_count})')
    lines.append('      Common (9 קבצים)')
    lines.append('      שפות (8)')

    return '\n'.join(lines)

# ── write TS ───────────────────────────────────────────────────────────────

ts = f"""export interface MindMapNodeData {{
  id: string;
  name: string;
  type: 'root' | 'folder' | 'skill' | 'plugin' | 'file' | 'agent' | 'tool' | 'reference';
  color?: string;
  description?: string;
  children?: MindMapNodeData[];
}}

export const mindMapData: MindMapNodeData = {to_ts(tree)};
"""

OUT_TS.parent.mkdir(parents=True, exist_ok=True)
OUT_TS.write_text(ts, encoding='utf-8')
print(f"Generated {OUT_TS} — {len(ts)} chars")

from datetime import datetime
mermaid_str = gen_mermaid_overview()
overview_ts = f"""// Auto-generated by gen_react_data.py — do not edit manually
export const systemOverviewMermaid = {json.dumps(mermaid_str)};
export const generatedAt = '{datetime.now().strftime('%Y-%m-%d')}';
export const systemStats = {{
  agents: {total_agents},
  skills: {total_skills},
  mcp: {len(mcp_list)},
  hooks: {len(hooks_list)},
  projects: {len(projs)},
  modes: {len(modes_list)},
}};
"""
OUT_OVERVIEW.write_text(overview_ts, encoding='utf-8')
print(f"Generated {OUT_OVERVIEW} — Mermaid overview ready")
