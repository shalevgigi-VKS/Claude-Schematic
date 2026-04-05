import { useEffect, useState } from 'react';
import { generatedAt, systemStats } from '../data/systemOverview';
import MindMapNode from './MindMapNode';
import type { MindMapNodeData } from '../data/mindMapData';

interface Props {
  onClose: () => void;
}

const systemMap: MindMapNodeData = {
  id: 'sys-root', name: 'Claude SG', type: 'root', color: '#6366F1',
  children: [
    {
      id: 'sys-agents', name: 'agents', description: 'סוכנים — 35', type: 'agent', color: '#EF4444',
      children: [
        { id: 'sys-a1', name: 'planner',          description: 'תכנון יישום',        type: 'agent', color: '#EF4444' },
        { id: 'sys-a2', name: 'architect',         description: 'עיצוב ארכיטקטורה',  type: 'agent', color: '#EF4444' },
        { id: 'sys-a3', name: 'code-reviewer',     description: 'ביקורת קוד',         type: 'agent', color: '#EF4444' },
        { id: 'sys-a4', name: 'tdd-guide',         description: 'פיתוח מונחה-בדיקות', type: 'agent', color: '#EF4444' },
        { id: 'sys-a5', name: 'security-reviewer', description: 'אבטחה',              type: 'agent', color: '#EF4444' },
        { id: 'sys-a6', name: 'build-error-resolver', description: 'תיקון שגיאות build', type: 'agent', color: '#EF4444' },
        { id: 'sys-a7', name: 'project-documenter', description: 'תיעוד פרויקטים',   type: 'agent', color: '#EF4444' },
        { id: 'sys-a8', name: 'gap-analyzer',      description: 'ניתוח פערים',        type: 'agent', color: '#EF4444' },
        { id: 'sys-a9', name: 'system-optimizer',  description: 'אופטימיזציה שבועית', type: 'agent', color: '#EF4444' },
      ],
    },
    {
      id: 'sys-skills', name: 'skills', description: 'סקילים — 18', type: 'skill', color: '#3B82F6',
      children: [
        { id: 'sys-s1', name: 'commit',            description: 'commit חכם',          type: 'skill', color: '#3B82F6' },
        { id: 'sys-s2', name: 'review-pr',         description: 'סקירת Pull Request',  type: 'skill', color: '#3B82F6' },
        { id: 'sys-s3', name: 'update-codemaps',   description: 'עדכון מפות קוד',      type: 'skill', color: '#3B82F6' },
        { id: 'sys-s4', name: 'update-docs',       description: 'עדכון תיעוד',         type: 'skill', color: '#3B82F6' },
        { id: 'sys-s5', name: 'evolution-update',  description: 'עדכון סכמטי',         type: 'skill', color: '#3B82F6' },
        { id: 'sys-s6', name: 'pdf',               description: 'יצוא PDF',            type: 'skill', color: '#3B82F6' },
      ],
    },
    {
      id: 'sys-mcp', name: 'MCP servers', description: 'שרתי MCP — 15', type: 'plugin', color: '#10B981',
      children: [
        { id: 'sys-m1', name: 'filesystem',        description: 'גישה לקבצים',         type: 'plugin', color: '#10B981' },
        { id: 'sys-m2', name: 'git',               description: 'ניהול גרסאות',        type: 'plugin', color: '#10B981' },
        { id: 'sys-m3', name: 'Gmail',             description: 'ניהול דואר',          type: 'plugin', color: '#10B981' },
        { id: 'sys-m4', name: 'Google Calendar',   description: 'ניהול לוח זמנים',     type: 'plugin', color: '#10B981' },
        { id: 'sys-m5', name: 'Context7',          description: 'תיעוד ספריות',        type: 'plugin', color: '#10B981' },
        { id: 'sys-m6', name: 'Figma',             description: 'עיצוב UI',            type: 'plugin', color: '#10B981' },
      ],
    },
    {
      id: 'sys-hooks', name: 'hooks', description: 'Hooks — 4', type: 'tool', color: '#EC4899',
      children: [
        { id: 'sys-h1', name: 'session-start',     description: 'Shadow scan אוטו',    type: 'tool', color: '#EC4899' },
        { id: 'sys-h2', name: 'pre-tool-use',      description: 'ולידציה לפני כלי',    type: 'tool', color: '#EC4899' },
        { id: 'sys-h3', name: 'post-tool-use',     description: 'בדיקה אחרי כלי',      type: 'tool', color: '#EC4899' },
        { id: 'sys-h4', name: 'pre-compact',       description: 'שמירת הקשר',          type: 'tool', color: '#EC4899' },
      ],
    },
    {
      id: 'sys-modes', name: 'modes', description: 'מצבי עבודה — 14', type: 'folder', color: '#8B5CF6',
      children: [
        { id: 'sys-mo1', name: 'architect',        description: 'ברירת מחדל',          type: 'folder', color: '#8B5CF6' },
        { id: 'sys-mo2', name: 'shadow (auto)',    description: 'סריקה בכל session',   type: 'folder', color: '#8B5CF6' },
        { id: 'sys-mo3', name: 'build',            description: 'ביצוע מבוקר',         type: 'folder', color: '#8B5CF6' },
        { id: 'sys-mo4', name: 'audit',            description: 'ניתוח בלבד',          type: 'folder', color: '#8B5CF6' },
        { id: 'sys-mo5', name: 'knowledge',        description: 'שילוב ידע חדש',       type: 'folder', color: '#8B5CF6' },
        { id: 'sys-mo6', name: 'consolidation',    description: 'גיבוש זיכרון',         type: 'folder', color: '#8B5CF6' },
      ],
    },
    {
      id: 'sys-projects', name: 'projects', description: 'פרויקטים — 8', type: 'folder', color: '#F59E0B',
      children: [
        { id: 'sys-p1', name: 'Chadshani',         description: 'מידע פיננסי יומי',    type: 'folder', color: '#F59E0B' },
        { id: 'sys-p2', name: 'Evolution Schematic', description: 'מפת המערכת הזו',   type: 'folder', color: '#F59E0B' },
        { id: 'sys-p3', name: 'LinkToText',        description: 'חילוץ טקסט מURL',    type: 'folder', color: '#F59E0B' },
        { id: 'sys-p4', name: 'TmunoteAI',         description: 'יצירת תמונות',        type: 'folder', color: '#F59E0B' },
        { id: 'sys-p5', name: 'LCL TCS',           description: 'אפליקציית לוגיסטיקה', type: 'folder', color: '#F59E0B' },
        { id: 'sys-p6', name: 'גלגל הרגשות',       description: 'קריאטיב + AI',        type: 'folder', color: '#F59E0B' },
      ],
    },
  ],
};

// All nodes expanded by default (3 levels)
const ALL_IDS = new Set<string>();
const collectIds = (node: MindMapNodeData) => {
  ALL_IDS.add(node.id);
  node.children?.forEach(collectIds);
};
collectIds(systemMap);

export function SystemOverview({ onClose }: Props) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(ALL_IDS));

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleToggle = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="overview-backdrop" onClick={handleBackdrop}>
      <div className="overview-modal">
        <div className="overview-header">
          <div className="overview-title">
            <span>🧠</span>
            <span>אבולוציה עכשוית</span>
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

        <div className="overview-content overview-mindmap-content">
          <MindMapNode
            node={systemMap}
            expandedNodes={expandedNodes}
            onToggle={handleToggle}
            onNavigate={() => {}}
            level={0}
            isRoot={true}
          />
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
