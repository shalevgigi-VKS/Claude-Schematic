import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { systemOverviewMermaid, generatedAt, systemStats } from '../data/systemOverview';

interface Props {
  onClose: () => void;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  mindmap: { padding: 20 },
  themeVariables: {
    darkMode: false,
    background: '#F8F9FF',
    primaryColor: '#E0E7FF',
    primaryTextColor: '#1e293b',
    primaryBorderColor: '#A5B4FC',
    lineColor: '#94A3B8',
    secondaryColor: '#DBEAFE',
    tertiaryColor: '#D1FAE5',
    mainBkg: '#E0E7FF',
    nodeBorder: '#C7D2FE',
    clusterBkg: '#F0F4FF',
    fontFamily: 'Heebo, Arial, sans-serif',
    fontSize: '14px',
    edgeLabelBackground: '#F8F9FF',
  },
});

export function SystemOverview({ onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const { svg } = await mermaid.render('system-overview-svg', systemOverviewMermaid);
        if (!cancelled) {
          setSvgContent(svg);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(String(e));
          setLoading(false);
        }
      }
    }
    render();
    return () => { cancelled = true; };
  }, []);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
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

        <div className="overview-content" ref={containerRef}>
          {loading && (
            <div className="overview-loading">
              <div className="overview-spinner" />
              <span>בונה תרשים מערכת...</span>
            </div>
          )}
          {error && (
            <div className="overview-error">
              <span>⚠️ שגיאה בטעינת הדיאגרמה</span>
              <pre>{error}</pre>
            </div>
          )}
          {!loading && !error && (
            <div
              className="overview-diagram"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )}
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
