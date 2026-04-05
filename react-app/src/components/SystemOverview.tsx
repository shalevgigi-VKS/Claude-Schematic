import { useEffect } from 'react';
import { generatedAt, systemStats } from '../data/systemOverview';

interface Props {
  onClose: () => void;
}

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

        <div className="overview-content">
          <img
            src="/system-image.jpg"
            alt="מפת מערכת Claude SG"
            className="overview-system-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/brain.svg';
              (e.target as HTMLImageElement).style.padding = '40px';
            }}
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
