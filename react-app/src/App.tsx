import { useState, useCallback, useRef } from 'react';
import MindMapNode from './components/MindMapNode';
import { mindMapData, MindMapNodeData } from './data/mindMapData';
import './styles/mind-map.css';

interface BreadcrumbItem {
  id: string;
  name: string;
}

function App() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [currentRoot, setCurrentRoot] = useState<string>('root');
  const [navigationHistory, setNavigationHistory] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'אבולוציה סכמטית' }
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const lastTouchDist = useRef<number>(0);
  const lastTouchCenter = useRef({ x: 0, y: 0 });

  const findNodeById = useCallback((nodes: MindMapNodeData[], id: string): MindMapNodeData | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const currentNode = findNodeById([mindMapData], currentRoot);

  const navigateToNode = (node: MindMapNodeData) => {
    if (node.id === 'root') {
      setCurrentRoot('root');
      setNavigationHistory([{ id: 'root', name: 'אבולוציה סכמטית' }]);
      setExpandedNodes(new Set(['root']));
    } else {
      setCurrentRoot(node.id);
      setNavigationHistory(prev => [...prev, { id: node.id, name: node.name }]);
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.add(node.id);
        return newSet;
      });
    }
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      const previousNode = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentRoot(previousNode.id);
    }
  };

  const resetView = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  };

  const expandAll = () => {
    const allNodeIds = new Set<string>();
    const collectIds = (nodes: MindMapNodeData[]) => {
      nodes.forEach(node => {
        allNodeIds.add(node.id);
        if (node.children) collectIds(node.children);
      });
    };
    if (currentNode) {
      allNodeIds.add(currentNode.id);
      if (currentNode.children) collectIds(currentNode.children);
    }
    setExpandedNodes(allNodeIds);
    resetView();
  };

  const collapseAll = () => {
    setExpandedNodes(new Set([currentRoot]));
    resetView();
  };

  const isFullyExpanded = currentNode && currentNode.children &&
    expandedNodes.size >= (countNodes(currentNode) + 1);

  const toggleExpandCollapse = () => {
    if (isFullyExpanded) {
      collapseAll();
    } else {
      expandAll();
    }
  };

  // Auto-center view after node expansion
  const centerView = () => {
    if (containerRef.current) {
      const viewport = containerRef.current;
      const scrollWidth = viewport.scrollWidth;
      const scrollHeight = viewport.scrollHeight;
      const clientWidth = viewport.clientWidth;
      const clientHeight = viewport.clientHeight;

      // Center the content
      viewport.scrollTo({
        left: (scrollWidth - clientWidth) / 2,
        top: (scrollHeight - clientHeight) / 3, // Slightly above center for tree view
        behavior: 'smooth'
      });
    }
  };

  const handleNodeToggle = (id: string) => {
    const wasExpanded = expandedNodes.has(id);

    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (wasExpanded) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    // Auto-center after expanding (not collapsing)
    if (!wasExpanded) {
      setTimeout(centerView, 150);
    }
  };

  function countNodes(node: MindMapNodeData): number {
    let count = 0;
    if (node.children) {
      count += node.children.length;
      node.children.forEach(child => {
        count += countNodes(child);
      });
    }
    return count;
  }

  const getAllNodes = (nodes: MindMapNodeData[], level = 0): { node: MindMapNodeData; level: number }[] => {
    const result: { node: MindMapNodeData; level: number }[] = [];
    nodes.forEach(node => {
      if (node.id !== 'root') {
        result.push({ node, level });
      }
      if (node.children) {
        result.push(...getAllNodes(node.children, level + 1));
      }
    });
    return result;
  };

  const allNodes = getAllNodes([mindMapData]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.3));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse drag (pan)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPosition({
      x: panStart.current.posX + dx,
      y: panStart.current.posY + dy
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.3, Math.min(3, prev + delta)));
  };

  // Touch handlers for mobile pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      panStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        posX: position.x,
        posY: position.y
      };
    } else if (e.touches.length === 2) {
      setIsPanning(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
      lastTouchCenter.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isPanning) {
      const dx = e.touches[0].clientX - panStart.current.x;
      const dy = e.touches[0].clientY - panStart.current.y;
      setPosition({
        x: panStart.current.posX + dx,
        y: panStart.current.posY + dy
      });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (lastTouchDist.current > 0) {
        const scaleChange = dist / lastTouchDist.current;
        setScale(prev => Math.max(0.3, Math.min(3, prev * scaleChange)));
      }

      lastTouchDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    lastTouchDist.current = 0;
  };

  return (
    <div className="mind-map-container light-theme">
      {/* Top Navigation */}
      <div className="top-navigation">
        <div className="breadcrumb">
          {navigationHistory.map((item, index) => (
            <span key={item.id}>
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              <button
                className={`breadcrumb-item ${index === navigationHistory.length - 1 ? 'active' : ''}`}
                onClick={() => {
                  const newHistory = navigationHistory.slice(0, index + 1);
                  setNavigationHistory(newHistory);
                  setCurrentRoot(item.id);
                }}
              >
                {item.name}
              </button>
            </span>
          ))}
        </div>

        <button className="nav-btn expand-btn" onClick={expandAll}>הרחב הכל</button>
        <button className="nav-btn collapse-btn" onClick={collapseAll}>כווץ הכל</button>

        <button
          className="nav-btn back-btn"
          onClick={goBack}
          disabled={navigationHistory.length <= 1}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          חזרה
        </button>

        <button
          className="nav-btn menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
          </svg>
          פרויקטים
        </button>
      </div>

      {/* Projects Menu */}
      {isMenuOpen && (
        <div className="projects-menu">
          <div className="projects-menu-header">
            <h3>בחר פרויקט</h3>
            <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="projects-list">
            <button
              className={`project-item ${currentRoot === 'root' ? 'active' : ''}`}
              onClick={() => { navigateToNode(mindMapData); setIsMenuOpen(false); }}
            >
              <span className="project-icon">🏠</span>
              <span>אבולוציה סכמטית</span>
            </button>
            {allNodes.filter(n => n.node.type !== 'file' && n.node.type !== 'reference').map(({ node, level }) => (
              <button
                key={node.id}
                className={`project-item level-${Math.min(level, 3)} ${currentRoot === node.id ? 'active' : ''}`}
                onClick={() => { navigateToNode(node); setIsMenuOpen(false); }}
                style={{ paddingRight: `${level * 20 + 16}px` }}
              >
                <span className="project-icon">
                  {node.type === 'skill' && '⚡'}
                  {node.type === 'plugin' && '🔌'}
                  {node.type === 'folder' && '📁'}
                  {node.type === 'agent' && '🤖'}
                  {node.type === 'tool' && '🔧'}
                </span>
                <span>{node.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}


      {/* Mind Map Content - Scrollable */}
      <div
        className="mind-map-viewport"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="mind-map-content-wrapper"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center top'
          }}
        >
          {currentNode && (
            <MindMapNode
              node={currentNode}
              expandedNodes={expandedNodes}
              onToggle={handleNodeToggle}
              onNavigate={navigateToNode}
              level={0}
              isRoot={true}
            />
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="legend-bar">
        <div className="legend-item">
          <span className="legend-icon">⚡</span>
          <span>סקילים</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🔌</span>
          <span>פלאגאינים</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">📁</span>
          <span>תיקיות</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🔧</span>
          <span>כלים</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">📄</span>
          <span>קבצים</span>
        </div>
      </div>
    </div>
  );
}

export default App;
