import { useEffect } from 'react';
import { generatedAt, systemStats } from '../data/systemOverview';

interface Props {
  onClose: () => void;
}

const layers = [
  {
    id: 'entry',
    label: 'LAYER 1 — כניסה',
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.35)',
    nodes: [
      { icon: '👤', title: 'User Message', sub: 'בקשה טקסטואלית' },
      { icon: '⏰', title: 'Scheduler (cron)', sub: 'GitHub Actions · Windows Task' },
    ],
  },
  {
    id: 'orchestration',
    label: 'LAYER 2 — תיאום ובקרה',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.35)',
    nodes: [
      { icon: '🧠', title: 'Claude Code', sub: 'Orchestrator · CLAUDE.md rules · model routing' },
      { icon: '👁️', title: 'Shadow Agent', sub: 'auto-scan · CRITICAL/WARNING · context_hint.md' },
      { icon: '⚙️', title: `Modes (${systemStats.modes})`, sub: 'architect · build · audit · shadow · knowledge…' },
    ],
  },
  {
    id: 'execution',
    label: 'LAYER 3 — ביצוע',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.35)',
    nodes: [
      { icon: '🤖', title: `Agents (${systemStats.agents})`, sub: 'planner · architect · code-reviewer · tdd-guide · security…' },
      { icon: '⚡', title: `Skills (${systemStats.skills})`, sub: 'commit · review-pr · update-docs · evolution-update…' },
    ],
  },
  {
    id: 'tools',
    label: 'LAYER 4 — כלים וחיבורים',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.35)',
    nodes: [
      { icon: '🔌', title: `MCP Servers (${systemStats.mcp})`, sub: 'filesystem · git · Gmail · Calendar · Context7 · Figma…' },
      { icon: '🔗', title: `Hooks (${systemStats.hooks})`, sub: 'session-start · pre-tool-use · post-tool-use · pre-compact' },
    ],
  },
  {
    id: 'output',
    label: 'LAYER 5 — תוצר וזיכרון',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.35)',
    nodes: [
      { icon: '📁', title: `Projects (${systemStats.projects})`, sub: 'Chadshani · Evolution · LinkToText · TmunoteAI · LCL TCS…' },
      { icon: '📝', title: 'Memory Files', sub: 'events.jsonl · MEMORY.md · shalev-patterns.md · skills_registry' },
      { icon: '📊', title: 'Reports', sub: 'gap-report · shadow-log · scout-report · failures.jsonl' },
    ],
  },
];

const connections = [
  { from: 'entry',         to: 'orchestration', label: 'בקשה / טריגר' },
  { from: 'orchestration', to: 'execution',     label: 'ניתוב לפי סוג' },
  { from: 'execution',     to: 'tools',         label: 'שימוש בכלים' },
  { from: 'tools',         to: 'output',        label: 'שמירה ופרסום' },
  { from: 'output',        to: 'orchestration', label: 'עדכון זיכרון ↑', dashed: true },
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

        <div className="overview-header">
          <div className="overview-title">
            <span>🧠</span>
            <span>אבולוציה עכשוית — ארכיטקטורת שכבות</span>
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

        <div className="overview-content">
          <div className="arch-wrap">
            {layers.map((layer, li) => (
              <div key={layer.id} className="arch-section">

                {/* Layer */}
                <div
                  className="arch-layer"
                  style={{ background: layer.bg, border: `1.5px solid ${layer.border}` }}
                >
                  <div className="arch-layer-label" style={{ color: layer.color }}>
                    {layer.label}
                  </div>
                  <div className="arch-layer-nodes">
                    {layer.nodes.map(node => (
                      <div key={node.title} className="arch-node" style={{ borderColor: layer.border }}>
                        <span className="arch-node-icon">{node.icon}</span>
                        <div>
                          <div className="arch-node-title" style={{ color: layer.color }}>{node.title}</div>
                          <div className="arch-node-sub">{node.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow to next layer */}
                {li < layers.length - 1 && (() => {
                  const conn = connections[li];
                  return (
                    <div className="arch-arrow">
                      <div className="arch-arrow-line" style={{ borderColor: conn.dashed ? '#4B5563' : layers[li + 1].color, borderStyle: conn.dashed ? 'dashed' : 'solid' }} />
                      <div className="arch-arrow-label" style={{ color: conn.dashed ? '#6B7280' : layers[li + 1].color }}>
                        {conn.label}
                      </div>
                      <div className="arch-arrow-tip" style={{ color: conn.dashed ? '#4B5563' : layers[li + 1].color }}>▼</div>
                    </div>
                  );
                })()}
              </div>
            ))}

            {/* Feedback loop note */}
            <div className="arch-feedback-note">
              ↑ זיכרון מתעדכן בזמן אמת: events.jsonl ← כל פעולה ← shalev-patterns.md
            </div>
          </div>
        </div>

        <div className="overview-footer">
          <span>עודכן לאחרונה: {generatedAt}</span>
          <span>·</span>
          <span>Claude System Architecture — SG</span>
        </div>
      </div>
    </div>
  );
}
