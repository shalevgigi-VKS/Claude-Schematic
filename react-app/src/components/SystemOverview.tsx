import { useEffect, useRef, useState } from 'react';
import { generatedAt, systemStats, systemOverviewMermaid } from '../data/systemOverview';

interface Props {
  onClose: () => void;
}

// Pastel theme injected via init directive — no :::className needed
const PASTEL_PREFIX = `%%{init: {
  "theme": "base",
  "themeVariables": {
    "background":        "#F8FAFC",
    "primaryColor":      "#EEF2FF",
    "primaryTextColor":  "#3730A3",
    "primaryBorderColor":"#C7D2FE",
    "secondaryColor":    "#F0FDF4",
    "tertiaryColor":     "#FFF7ED",
    "lineColor":         "#818CF8",
    "edgeLabelBackground":"#EEF2FF",
    "fontFamily":        "Heebo, Segoe UI, sans-serif"
  }
}}%%\n`;

export function SystemOverview({ onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });

        const diagram = PASTEL_PREFIX + systemOverviewMermaid;
        const id = `mm-overview-${Date.now()}`;
        const { svg } = await mermaid.render(id, diagram);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          // Make SVG responsive
          const svgEl = containerRef.current.querySelector('svg');
          if (svgEl) {
            svgEl.style.width = '100%';
            svgEl.style.height = 'auto';
            svgEl.style.maxHeight = '65vh';
          }
          setStatus('done');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, []);

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
          {status === 'loading' && (
            <div className="overview-loading">
              <div className="overview-spinner"/>
              <span>טוען דיאגרמה…</span>
            </div>
          )}
          {status === 'error' && (
            <div className="overview-error">שגיאה בטעינת הדיאגרמה</div>
          )}
          <div
            ref={containerRef}
            style={{ width: '100%', display: status === 'done' ? 'block' : 'none' }}
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
