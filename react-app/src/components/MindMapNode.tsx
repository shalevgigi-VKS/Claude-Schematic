import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { MindMapNodeData } from '../data/mindMapData';

interface MindMapNodeProps {
  node: MindMapNodeData;
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  onNavigate: (node: MindMapNodeData) => void;
  level: number;
  isRoot?: boolean;
  cardRef?: React.RefObject<HTMLDivElement>;
  animIndex?: number;
}

/* ─── Node icons ─── */
const getNodeIcon = (type: string) => {
  switch (type) {
    case 'root': return (
      <svg viewBox="0 0 64 64" className="node-illustration">
        <defs><linearGradient id="rG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1"/><stop offset="100%" stopColor="#8B5CF6"/>
        </linearGradient></defs>
        <circle cx="32" cy="32" r="28" fill="url(#rG)"/>
        <path d="M32 16L38 26H26L32 16Z" fill="white"/>
        <rect x="24" y="28" width="16" height="12" rx="2" fill="white"/>
        <circle cx="28" cy="34" r="2" fill="#6366F1"/>
        <circle cx="36" cy="34" r="2" fill="#6366F1"/>
      </svg>);
    case 'skill': return (
      <svg viewBox="0 0 64 64" className="node-illustration">
        <defs><linearGradient id="skG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#60A5FA"/>
        </linearGradient></defs>
        <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" fill="url(#skG)"/>
        <polygon points="32,12 50,22 50,42 32,52 14,42 14,22" fill="white" opacity="0.3"/>
        <path d="M26 28L32 22L38 28L32 34L26 28Z" fill="white"/>
        <path d="M26 36L32 30L38 36L32 42L26 36Z" fill="white" opacity="0.7"/>
      </svg>);
    case 'plugin': return (
      <svg viewBox="0 0 64 64" className="node-illustration">
        <defs><linearGradient id="plG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981"/><stop offset="100%" stopColor="#34D399"/>
        </linearGradient></defs>
        <rect x="12" y="20" width="40" height="28" rx="4" fill="url(#plG)"/>
        <rect x="8" y="28" width="8" height="12" rx="2" fill="#10B981"/>
        <rect x="48" y="28" width="8" height="12" rx="2" fill="#10B981"/>
        <circle cx="24" cy="34" r="4" fill="white"/>
        <rect x="32" y="30" width="12" height="8" rx="2" fill="white"/>
      </svg>);
    case 'folder': return (
      <svg viewBox="0 0 64 64" className="node-illustration">
        <defs><linearGradient id="foG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6"/><stop offset="100%" stopColor="#A78BFA"/>
        </linearGradient></defs>
        <path d="M8 16H24L28 24H56V52H8V16Z" fill="url(#foG)"/>
        <path d="M8 16H24L28 24H56V32H8V16Z" fill="#7C3AED"/>
        <rect x="16" y="36" width="32" height="4" rx="2" fill="white" opacity="0.5"/>
        <rect x="16" y="44" width="24" height="4" rx="2" fill="white" opacity="0.3"/>
      </svg>);
    case 'file': case 'reference': return (
      <svg viewBox="0 0 64 64" className="node-illustration">
        <defs><linearGradient id="fiG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#FBBF24"/>
        </linearGradient></defs>
        <path d="M12 8H40L52 20V56H12V8Z" fill="url(#fiG)"/>
        <path d="M40 8L52 20H44V28H12V8H40Z" fill="#D97706"/>
        <rect x="20" y="32" width="24" height="3" rx="1" fill="white"/>
        <rect x="20" y="40" width="20" height="3" rx="1" fill="white" opacity="0.7"/>
        <rect x="20" y="48" width="16" height="3" rx="1" fill="white" opacity="0.5"/>
      </svg>);
    case 'agent': return (
      <svg viewBox="0 0 64 64" className="node-illustration">
        <defs><linearGradient id="agG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444"/><stop offset="100%" stopColor="#F87171"/>
        </linearGradient></defs>
        <circle cx="32" cy="24" r="12" fill="url(#agG)"/>
        <ellipse cx="32" cy="56" rx="20" ry="8" fill="url(#agG)"/>
        <circle cx="28" cy="22" r="3" fill="white"/>
        <circle cx="36" cy="22" r="3" fill="white"/>
        <path d="M26 30Q32 36 38 30" stroke="white" strokeWidth="2" fill="none"/>
        <rect x="24" y="36" width="16" height="12" rx="4" fill="white"/>
      </svg>);
    case 'tool': return (
      <svg viewBox="0 0 64 64" className="node-illustration">
        <defs><linearGradient id="toG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4"/><stop offset="100%" stopColor="#22D3EE"/>
        </linearGradient></defs>
        <path d="M20 8L44 32L40 36L16 12L20 8Z" fill="url(#toG)"/>
        <path d="M8 44L20 32L28 40L16 52L8 44Z" fill="#0891B2"/>
        <rect x="36" y="44" width="20" height="8" rx="4" fill="url(#toG)"/>
        <circle cx="24" cy="20" r="4" fill="white"/>
      </svg>);
    default: return (
      <svg viewBox="0 0 64 64" className="node-illustration">
        <rect x="12" y="12" width="40" height="40" rx="8" fill="#9CA3AF"/>
        <rect x="24" y="24" width="16" height="16" rx="4" fill="white"/>
      </svg>);
  }
};

const getNodeClass = (type: string) => {
  const map: Record<string, string> = {
    root: 'node-root', skill: 'node-skill', plugin: 'node-plugin',
    folder: 'node-folder', file: 'node-file', reference: 'node-reference',
    agent: 'node-agent', tool: 'node-tool',
  };
  return map[type] ?? 'node-default';
};

/* ─── SVG bezier connectors ─────────────────────────────────────────────────
   Lives inside mind-map-node-wrapper (position:relative).
   Draws from parentRef (THIS node's card) to each childRef (child cards).
   Because all are inside the same wrapper, all y-coords are positive.
──────────────────────────────────────────────────────────────────────────── */
function NodeConnectors({ wrapperRef, parentRef, childRefs, color, isClosing }: {
  wrapperRef: React.RefObject<HTMLDivElement>;
  parentRef: React.RefObject<HTMLDivElement>;
  childRefs: React.RefObject<HTMLDivElement>[];
  color: string;
  isClosing: boolean;
}) {
  const [paths, setPaths] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const calc = useCallback(() => {
    if (!wrapperRef.current || !parentRef.current || !svgRef.current) return;

    const getOffset = (el: HTMLElement, ancestor: HTMLElement) => {
      let x = 0, y = 0;
      let cur: HTMLElement | null = el;
      while (cur && cur !== ancestor) {
        x += cur.offsetLeft;
        y += cur.offsetTop;
        cur = cur.offsetParent as HTMLElement | null;
      }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };

    const p = getOffset(parentRef.current, wrapperRef.current);
    const fromX = p.x + p.w / 2;
    const fromY = p.y + p.h;

    const newPaths = childRefs.map(ref => {
      if (!ref.current) return '';
      const c = getOffset(ref.current, wrapperRef.current);
      const toX = c.x + c.w / 2;
      const toY = c.y;
      // Smooth cubic bezier: S-curve from parent bottom to child top
      const cy = fromY + (toY - fromY) * 0.5;
      return `M ${fromX} ${fromY} C ${fromX} ${cy} ${toX} ${cy} ${toX} ${toY}`;
    }).filter(Boolean);

    setPaths(newPaths);
  }, [wrapperRef, parentRef, childRefs]);

  useLayoutEffect(() => {
    // Immediate pass + ResizeObserver so every animation frame recalcs
    calc();
    const ro = new ResizeObserver(() => calc());
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    // Final pass after longest possible stagger+animation (220ms + 400ms)
    const t = setTimeout(calc, 700);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [calc]);

  const cid = color.replace('#', '');

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', overflow: 'visible', zIndex: 0,
      }}
    >
      <defs>
        <linearGradient id={`cg-${cid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.2"/>
        </linearGradient>
        <marker id={`arr-${cid}`} markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill={color} opacity="0.7"/>
        </marker>
      </defs>
      {paths.map((d, i) => (
        <path key={i} d={d} pathLength="1"
          stroke={`url(#cg-${cid})`}
          strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
          markerEnd={`url(#arr-${cid})`}
          style={{
            animation: isClosing
              ? 'connectorFade 0.28s ease-in both'
              : 'connectorDraw 0.45s ease-out both',
          }}
        />
      ))}
    </svg>
  );
}

/* ─── MindMapNode ─────────────────────────────────────────────────────────── */
function MindMapNode({
  node, expandedNodes, onToggle, onNavigate, level, cardRef, animIndex = 0
}: MindMapNodeProps) {
  const [isAnimating, setIsAnimating]   = useState(false);
  const [isExpanding, setIsExpanding]   = useState(false);
  const [isClosing,   setIsClosing]     = useState(false);

  // wrapperRef: the outer div that contains BOTH the card and all children
  // nodeCardRef: THIS node's card (used as connector source for children)
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const nodeCardRef = useRef<HTMLDivElement>(null);
  const childCardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  const hasChildren = !!(node.children?.length);
  const isExpanded  = expandedNodes.has(node.id);
  const shouldRenderChildren = (isExpanded || isClosing) && hasChildren;
  // Column layout only for the "last layer" — nodes whose children are all leaves (no grandchildren)
  const childrenAreLeaves = !node.children?.some(c => c.children && c.children.length > 0);
  const useColumnLayout = childrenAreLeaves;

  // Callback ref: writes to BOTH internal nodeCardRef AND external cardRef
  const setCardRef = useCallback((el: HTMLDivElement | null) => {
    (nodeCardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (cardRef) (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  }, [cardRef]);

  const handleClick = () => {
    if (!hasChildren) return;
    if (isExpanded && !isClosing) {
      setIsClosing(true);
      setIsAnimating(true);
      setTimeout(() => { setIsClosing(false); setIsAnimating(false); onToggle(node.id); }, 310);
    } else if (!isExpanded && !isClosing) {
      setIsExpanding(true);
      setIsAnimating(true);
      onToggle(node.id);
      setTimeout(() => {
        setIsAnimating(false);
        setIsExpanding(false);
        nodeCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }, 450);
    }
  };

  const handleDoubleClick = () => {
    if (hasChildren && node.id !== 'root') onNavigate(node);
  };

  const staggerDelay = Math.min(animIndex * 45, 220);

  // Ensure childCardRefs array is large enough
  if (node.children) {
    while (childCardRefs.current.length < node.children.length) {
      childCardRefs.current.push({ current: null } as React.RefObject<HTMLDivElement>);
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={`mind-map-node-wrapper level-${level}`}
      style={{ '--anim-delay': `${staggerDelay}ms`, position: 'relative' } as React.CSSProperties}
    >
      {/* SVG connector — spans entire wrapper so coords are always positive */}
      {shouldRenderChildren && (
        <NodeConnectors
          wrapperRef={wrapperRef}
          parentRef={nodeCardRef}
          childRefs={(childCardRefs.current.slice(0, node.children!.length)) as React.RefObject<HTMLDivElement>[]}
          color={node.color || '#6366F1'}
          isClosing={isClosing}
        />
      )}

      {/* Node card — ref written to both internal nodeCardRef and external cardRef */}
      <div
        ref={setCardRef}
        className={`mind-map-node ${getNodeClass(node.type)} ${hasChildren ? 'expandable' : ''} ${isExpanded ? 'expanded' : ''} ${isAnimating ? 'animating' : ''} ${isExpanding ? 'expanding' : ''}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{ '--node-color': node.color || '#6366F1', position: 'relative', zIndex: 1 } as React.CSSProperties}
      >
        <div className="node-illustration-wrapper">{getNodeIcon(node.type)}</div>
        <div className="node-content">
          <div className="node-text">
            {node.description
              ? <>
                  <span className="node-description">{node.description}</span>
                  <span className="node-name node-name-secondary">{node.name}</span>
                </>
              : <span className="node-name">{node.name}</span>
            }
          </div>
          {hasChildren && (
            <div className={`node-chevron ${isExpanded ? 'rotated' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </div>
          )}
        </div>
        {hasChildren && (
          <div className="expand-hint">{isExpanded ? 'לחץ לסגירה' : 'לחץ לפתיחה'}</div>
        )}
      </div>

      {/* Children */}
      {shouldRenderChildren && (
        <div className={`mind-map-children-row ${isClosing ? 'closing' : ''}`}>
          <div className={`children-row ${useColumnLayout ? 'column-layout' : ''}`}>
            {node.children!.map((child, index) => (
              <div key={child.id} className="child-branch" data-node-id={child.id}>
                <MindMapNode
                  node={child}
                  expandedNodes={expandedNodes}
                  onToggle={onToggle}
                  onNavigate={onNavigate}
                  level={level + 1}
                  cardRef={childCardRefs.current[index] as React.RefObject<HTMLDivElement>}
                  animIndex={index}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MindMapNode;
