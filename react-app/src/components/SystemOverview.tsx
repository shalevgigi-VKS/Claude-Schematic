import { useEffect } from 'react';
import { generatedAt, systemStats } from '../data/systemOverview';

interface Props {
  onClose: () => void;
}

const categories = [
  {
    icon: '🤖', title: 'סוכנים', count: 35, color: '#EF4444', bg: 'rgba(239,68,68,0.12)',
    description: 'מומחים אוטונומיים לכל תחום',
    items: ['planner', 'architect', 'code-reviewer', 'tdd-guide', 'security-reviewer', 'build-error-resolver'],
  },
  {
    icon: '⚡', title: 'סקילים', count: 18, color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',
    description: 'פקודות מותאמות אישית',
    items: ['commit', 'review-pr', 'pdf', 'update-codemaps', 'update-docs', 'evolution-update'],
  },
  {
    icon: '🔌', title: 'שרתי MCP', count: 15, color: '#10B981', bg: 'rgba(16,185,129,0.12)',
    description: 'חיבורים לכלים חיצוניים',
    items: ['filesystem', 'git', 'Gmail', 'Google Calendar', 'Context7', 'Figma'],
  },
  {
    icon: '🔗', title: 'Hooks', count: 4, color: '#EC4899', bg: 'rgba(236,72,153,0.12)',
    description: 'אוטומציה בכל אירוע',
    items: ['session-start', 'pre-tool-use', 'post-tool-use', 'pre-compact'],
  },
  {
    icon: '⚙️', title: 'מצבי עבודה', count: 14, color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)',
    description: 'הקשרי עבודה דינמיים',
    items: ['architect (ברירת מחדל)', 'build', 'audit', 'shadow (אוטו)', 'knowledge', 'consolidation'],
  },
  {
    icon: '📁', title: 'פרויקטים', count: 8, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',
    description: 'יישומים ואתרים פעילים',
    items: ['Chadshani (מידע פיננסי)', 'Evolution Schematic', 'LinkToText', 'TmunoteAI', 'LCL TCS', 'גלגל הרגשות'],
  },
];

const flowSteps = [
  { label: 'בקשת משתמש', icon: '👤' },
  { label: 'Shadow Agent', icon: '👁️', sub: 'סריקת session' },
  { label: 'Orchestrator', icon: '🧠', sub: 'ניתוב לפי סוג משימה' },
  { label: 'Agent / Skill', icon: '🤖', sub: 'ביצוע ממוקד' },
  { label: 'MCP Tool', icon: '🔌', sub: 'גישה לכלים חיצוניים' },
  { label: 'תוצר + תיעוד', icon: '✅', sub: 'events.jsonl + memory' },
];

export function SystemOverview({ onClose }: Props) {
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="overview-backdrop" onClick={handleBackdrop}>
      <div className="overview-modal">
        {/* Header */}
        <div className="overview-header">
          <div className="overview-title">
            <span>🧠</span>
            <span>אבולוציה עכשוית — Claude SG</span>
          </div>
          <div className="overview-stats">
            <span>{systemStats.agents} סוכנים</span>
            <span>·</span>
            <span>{systemStats.skills} סקילים</span>
            <span>·</span>
            <span>{systemStats.mcp} MCP</span>
            <span>·</span>
            <span>{systemStats.projects} פרויקטים</span>
          </div>
          <button className="overview-close-btn" onClick={onClose} aria-label="סגור">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Diagram */}
        <div className="overview-content">
          <div className="sysdiag">

            {/* Hub */}
            <div className="sysdiag-hub">
              <div className="sysdiag-hub-icon">🧠</div>
              <div className="sysdiag-hub-name">Claude Code Orchestrator</div>
              <div className="sysdiag-hub-sub">Principal Architect · Global Memory Manager · Skill Router</div>
            </div>

            <div className="sysdiag-arrow-down">↓ ניתוב לפי סוג משימה</div>

            {/* 6 categories */}
            <div className="sysdiag-grid">
              {categories.map(cat => (
                <div
                  key={cat.title}
                  className="sysdiag-card"
                  style={{ '--cat-color': cat.color, '--cat-bg': cat.bg } as React.CSSProperties}
                >
                  <div className="sysdiag-card-head">
                    <span className="sysdiag-card-icon">{cat.icon}</span>
                    <span className="sysdiag-card-title">{cat.title}</span>
                    <span className="sysdiag-card-count">{cat.count}</span>
                  </div>
                  <div className="sysdiag-card-desc">{cat.description}</div>
                  <ul className="sysdiag-card-list">
                    {cat.items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Flow pipeline */}
            <div className="sysdiag-flow-title">זרימת בקשה מקצה לקצה</div>
            <div className="sysdiag-flow">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="sysdiag-flow-group">
                  <div className="sysdiag-flow-step">
                    <span className="sysdiag-flow-icon">{step.icon}</span>
                    <span className="sysdiag-flow-label">{step.label}</span>
                    {step.sub && <span className="sysdiag-flow-sub">{step.sub}</span>}
                  </div>
                  {i < flowSteps.length - 1 && <span className="sysdiag-flow-arrow">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overview-footer">
          <span>עודכן לאחרונה: {generatedAt}</span>
          <span>·</span>
          <span>Claude System Map — SG</span>
        </div>
      </div>
    </div>
  );
}
