import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { MindMapNodeData } from '../data/mindMapData';

interface MindMapNodeProps {
  node: MindMapNodeData;
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  onNavigate: (node: MindMapNodeData) => void;
  level: number;
  isRoot?: boolean;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'root':
      return (
        <svg viewBox="0 0 64 64" className="node-illustration">
          <defs>
            <linearGradient id="rootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1"/>
              <stop offset="100%" stopColor="#8B5CF6"/>
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#rootGrad)"/>
          <path d="M32 16L38 26H26L32 16Z" fill="white"/>
          <rect x="24" y="28" width="16" height="12" rx="2" fill="white"/>
          <circle cx="28" cy="34" r="2" fill="#6366F1"/>
          <circle cx="36" cy="34" r="2" fill="#6366F1"/>
        </svg>
      );
    case 'skill':
      return (
        <svg viewBox="0 0 64 64" className="node-illustration">
          <defs>
            <linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6"/>
              <stop offset="100%" stopColor="#60A5FA"/>
            </linearGradient>
          </defs>
          <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" fill="url(#skillGrad)"/>
          <polygon points="32,12 50,22 50,42 32,52 14,42 14,22" fill="white" opacity="0.3"/>
          <path d="M26 28L32 22L38 28L32 34L26 28Z" fill="white"/>
          <path d="M26 36L32 30L38 36L32 42L26 36Z" fill="white" opacity="0.7"/>
        </svg>
      );
    case 'plugin':
      return (
        <svg viewBox="0 0 64 64" className="node-illustration">
          <defs>
            <linearGradient id="pluginGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981"/>
              <stop offset="100%" stopColor="#34D399"/>
            </linearGradient>
          </defs>
          <rect x="12" y="20" width="40" height="28" rx="4" fill="url(#pluginGrad)"/>
          <rect x="8" y="28" width="8" height="12" rx="2" fill="#10B981"/>
          <rect x="48" y="28" width="8" height="12" rx="2" fill="#10B981"/>
          <circle cx="24" cy="34" r="4" fill="white"/>
          <rect x="32" y="30" width="12" height="8" rx="2" fill="white"/>
        </svg>
      );
    case 'folder':
      return (
        <svg viewBox="0 0 64 64" className="node-illustration">
          <defs>
            <linearGradient id="folderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6"/>
              <stop offset="100%" stopColor="#A78BFA"/>
            </linearGradient>
          </defs>
          <path d="M8 16H24L28 24H56V52H8V16Z" fill="url(#folderGrad)"/>
          <path d="M8 16H24L28 24H56V32H8V16Z" fill="#7C3AED"/>
          <rect x="16" y="36" width="32" height="4" rx="2" fill="white" opacity="0.5"/>
          <rect x="16" y="44" width="24" height="4" rx="2" fill="white" opacity="0.3"/>
        </svg>
      );
    case 'file':
    case 'reference':
      return (
        <svg viewBox="0 0 64 64" className="node-illustration">
          <defs>
            <linearGradient id="fileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B"/>
              <stop offset="100%" stopColor="#FBBF24"/>
            </linearGradient>
          </defs>
          <path d="M12 8H40L52 20V56H12V8Z" fill="url(#fileGrad)"/>
          <path d="M40 8L52 20H44V28H12V8H40Z" fill="#D97706"/>
          <rect x="20" y="32" width="24" height="3" rx="1" fill="white"/>
          <rect x="20" y="40" width="20" height="3" rx="1" fill="white" opacity="0.7"/>
          <rect x="20" y="48" width="16" height="3" rx="1" fill="white" opacity="0.5"/>
        </svg>
      );
    case 'agent':
      return (
        <svg viewBox="0 0 64 64" className="node-illustration">
          <defs>
            <linearGradient id="agentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444"/>
              <stop offset="100%" stopColor="#F87171"/>
            </linearGradient>
          </defs>
          <circle cx="32" cy="24" r="12" fill="url(#agentGrad)"/>
          <ellipse cx="32" cy="56" rx="20" ry="8" fill="url(#agentGrad)"/>
          <circle cx="28" cy="22" r="3" fill="white"/>
          <circle cx="36" cy="22" r="3" fill="white"/>
          <path d="M26 30Q32 36 38 30" stroke="white" strokeWidth="2" fill="none"/>
          <rect x="24" y="36" width="16" height="12" rx="4" fill="white"/>
        </svg>
      );
    case 'tool':
      return (
        <svg viewBox="0 0 64 64" className="node-illustration">
          <defs>
            <linearGradient id="toolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4"/>
              <stop offset="100%" stopColor="#22D3EE"/>
            </linearGradient>
          </defs>
          <path d="M20 8L44 32L40 36L16 12L20 8Z" fill="url(#toolGrad)"/>
          <path d="M8 44L20 32L28 40L16 52L8 44Z" fill="#0891B2"/>
          <rect x="36" y="44" width="20" height="8" rx="4" fill="url(#toolGrad)"/>
          <circle cx="24" cy="20" r="4" fill="white"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className="node-illustration">
          <rect x="12" y="12" width="40" height="40" rx="8" fill="#9CA3AF"/>
          <rect x="24" y="24" width="16" height="16" rx="4" fill="white"/>
        </svg>
      );
  }
};

const getNodeClass = (type: string) => {
  switch (type) {
    case 'root': return 'node-root';
    case 'skill': return 'node-skill';
    case 'plugin': return 'node-plugin';
    case 'folder': return 'node-folder';
    case 'file': return 'node-file';
    case 'reference': return 'node-reference';
    case 'agent': return 'node-agent';
    case 'tool': return 'node-tool';
    default: return 'node-default';
  }
};

// SVG connector: draws lines from parent node bottom-center to each child top-center
function NodeConnectors({ parentRef, childRefs, color }: {
  parentRef: React.RefObject<HTMLDivElement>;
  childRefs: React.RefObject<HTMLDivElement>[];
  color: string;
}) {
  const [paths, setPaths] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const calc = () => {
      if (!parentRef.current || !svgRef.current) return;
      const svgRect = svgRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      const fromX = parentRect.left + parentRect.width / 2 - svgRect.left;
      const fromY = parentRect.bottom - svgRect.top;

      const newPaths = childRefs.map(ref => {
        if (!ref.current) return '';
        const childRect = ref.current.getBoundingClientRect();
        const toX = childRect.left + childRect.width / 2 - svgRect.left;
        const toY = childRect.top - svgRect.top;
        const midY = (fromY + toY) / 2;
        return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
      }).filter(Boolean);

      setPaths(newPaths);
    };

    // slight delay to let DOM settle after expand animation
    const t = setTimeout(calc, 50);
    return () => clearTimeout(t);
  });

  return (
    <svg
      ref={svgRef}
      className="node-svg-connectors"
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', overflow: 'visible', zIndex: 0,
      }}
    >
      <defs>
        <linearGradient id={`cg-${color.replace('#','')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
        <marker id={`arrow-${color.replace('#','')}`} markerWidth="6" markerHeight="6"
          refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill={color} opacity="0.6" />
        </marker>
      </defs>
      {paths.map((d, i) => (
        <path key={i} d={d}
          stroke={`url(#cg-${color.replace('#','')})`}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          markerEnd={`url(#arrow-${color.replace('#','')})`}
          style={{ animation: 'connectorDraw 0.35s ease-out both' }}
        />
      ))}
    </svg>
  );
}

function MindMapNode({ node, expandedNodes, onToggle, onNavigate, level, isRoot, cardRef }: MindMapNodeProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const nodeCardRef = useRef<HTMLDivElement>(null);
  const childCardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const shouldShowChildren = isExpanded && hasChildren;

  // Check if this is a leaf level (children have no further children)
  const isLeafLevel = hasChildren && node.children!.every(child => !child.children || child.children.length === 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, level * 80);
    return () => clearTimeout(timer);
  }, [level]);

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanding(true);
      setIsAnimating(true);
      onToggle(node.id);
      setTimeout(() => {
        setIsAnimating(false);
        setIsExpanding(false);
      }, 400);
    }
  };

  const handleDoubleClick = () => {
    if (hasChildren && node.id !== 'root') {
      onNavigate(node);
    }
  };

  return (
    <div className={`mind-map-node-wrapper level-${level} ${isVisible ? 'visible' : ''}`}>
      {/* The node card */}
      <div
        ref={cardRef || nodeCardRef}
        className={`mind-map-node ${getNodeClass(node.type)} ${hasChildren ? 'expandable' : ''} ${isExpanded ? 'expanded' : ''} ${isAnimating ? 'animating' : ''} ${isExpanding ? 'expanding' : ''}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{
          '--node-color': node.color || '#6366F1',
        } as React.CSSProperties}
      >
        <div className="node-illustration-wrapper">
          {getNodeIcon(node.type)}
        </div>
        <div className="node-content">
          <div className="node-text">
            <span className="node-name">{node.name}</span>
            {node.description && (
              <span className="node-description">{node.description}</span>
            )}
          </div>
          {hasChildren && (
            <div className={`node-chevron ${isExpanded ? 'rotated' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </div>
          )}
        </div>
        {hasChildren && (
          <div className="expand-hint">
            לחץ לפתיחה
          </div>
        )}
      </div>

      {/* Children — with SVG bezier connectors from parent to each child */}
      {shouldShowChildren && (() => {
        // ensure ref array is sized correctly
        while (childCardRefs.current.length < node.children!.length) {
          childCardRefs.current.push({ current: null } as React.RefObject<HTMLDivElement>);
        }
        return (
          <div
            className={`mind-map-children-row ${isLeafLevel ? 'leaf-level' : ''}`}
            style={{ position: 'relative' }}
          >
            {/* SVG overlay — bezier curves from parent card to each child card */}
            <NodeConnectors
              parentRef={nodeCardRef as React.RefObject<HTMLDivElement>}
              childRefs={childCardRefs.current.slice(0, node.children!.length) as React.RefObject<HTMLDivElement>[]}
              color={node.color || '#6366F1'}
            />

            <div className={`children-row ${isLeafLevel ? 'leaf-column' : ''}`}>
              {node.children!.map((child, index) => (
                <div key={child.id} className="child-branch">
                  <MindMapNode
                    node={child}
                    expandedNodes={expandedNodes}
                    onToggle={onToggle}
                    onNavigate={onNavigate}
                    level={level + 1}
                    cardRef={childCardRefs.current[index] as React.RefObject<HTMLDivElement>}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default MindMapNode;
