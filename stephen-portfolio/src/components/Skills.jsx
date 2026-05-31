import React, { useState, useEffect, useRef } from "react";
import "./Skills.css";
import useIsMobile from '../hooks/useIsMobile';
import antigravityIcon from "../assets/antigravity_small.png";
import { 
  FaVideo, FaGamepad, FaUtensils, FaChartLine, FaPalette,
  FaCogs, FaDatabase, FaNetworkWired, FaCheckCircle
} from 'react-icons/fa';

// Nodes definition with exact applied context status
const initialNodes = [
  // Project Nodes
  { id: "monica", label: "MoNiCa.Ai", isProject: true, x: 220, y: 160, color: "#a7d273", status: "Flagship AI", icon: "FaVideo" },
  { id: "zork", label: "Zork v2", isProject: true, x: 500, y: 120, color: "#ffb300", status: "Cockpit HUD", icon: "FaGamepad" },
  { id: "fridgejam", label: "FridgeJam", isProject: true, x: 780, y: 180, color: "#f97316", status: "GDG Jam Win", icon: "FaUtensils" },
  // { id: "fintracker", label: "FinTracker", isProject: true, x: 320, y: 380, color: "#38bdf8", status: "CLI & Web", icon: "FaChartLine" },
  { id: "portfolio", label: "Portfolio", isProject: true, x: 620, y: 390, color: "#c084fc", status: "AI Assistant", icon: "FaPalette" },

  // Skill Nodes
  { id: "java", label: "Java", isProject: false, x: 600, y: 220, color: "#ffb300", status: "Applied Zork", iconClass: "devicon-java-plain colored" },
  { id: "python", label: "Python", isProject: false, x: 280, y: 270, color: "#0284c7", status: "Proficient", iconClass: "devicon-python-plain colored" },
  { id: "webrtc", label: "WebRTC", isProject: false, x: 80, y: 120, color: "#a7d273", status: "MoNiCa LiveKit", iconClass: "devicon-javascript-plain colored" },
  { id: "fastapi", label: "FastAPI", isProject: false, x: 240, y: 80, color: "#009688", status: "Applied API", iconClass: "devicon-python-plain colored" },
  { id: "react", label: "React", isProject: false, x: 450, y: 240, color: "#0899e7", status: "Core Stack", iconClass: "devicon-react-original colored" },
  { id: "springboot", label: "Spring Boot", isProject: false, x: 620, y: 60, color: "#4caf50", status: "Zork Backend", iconClass: "devicon-spring-plain colored" },
  { id: "gemini", label: "Gemini AI", isProject: false, x: 920, y: 120, color: "#f97316", status: "GDG Scanner", iconClass: "devicon-google-plain colored" },
  { id: "docker", label: "Docker", isProject: false, x: 150, y: 220, color: "#039be5", status: "Familiar", iconClass: "devicon-docker-plain colored" },
  { id: "kubernetes", label: "Kubernetes", isProject: false, x: 120, y: 330, color: "#326ce5", status: "Exploring", iconClass: "devicon-kubernetes-plain colored" },
  { id: "supabase", label: "Supabase", isProject: false, x: 450, y: 350, color: "#3ecf8e", status: "Database Log", iconClass: "devicon-postgresql-plain colored" },
  { id: "git", label: "Git", isProject: false, x: 740, y: 310, color: "#f05032", status: "Proficient", iconClass: "devicon-git-plain colored" },
  { id: "c++", label: "C++", isProject: false, x: 820, y: 360, color: "#00599c", status: "Foundation", iconClass: "devicon-cplusplus-plain colored" }
];

// Edges (links) connecting Projects to Skills
const initialLinks = [
  { source: "monica", target: "webrtc" },
  { source: "monica", target: "fastapi" },
  { source: "monica", target: "python" },
  { source: "monica", target: "react" },
  { source: "monica", target: "docker" },
  { source: "monica", target: "kubernetes" },
  { source: "monica", target: "supabase" },
  
  { source: "zork", target: "java" },
  { source: "zork", target: "springboot" },
  { source: "zork", target: "react" },
  
  { source: "fridgejam", target: "gemini" },
  { source: "fridgejam", target: "fastapi" },
  { source: "fridgejam", target: "python" },
  { source: "fridgejam", target: "docker" },
  
  /*
  { source: "fintracker", target: "fastapi" },
  { source: "fintracker", target: "python" },
  { source: "fintracker", target: "react" },
  */
  
  { source: "portfolio", target: "react" },
  { source: "portfolio", target: "git" }
];

const Skills = () => {
  const isMobile = useIsMobile();
  const [nodes, setNodes] = useState(initialNodes);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Dragging states
  const [draggedNode, setDraggedNode] = useState(null);
  const boardRef = useRef(null);
  const sectionRef = useRef(null);

  // Pause physics when section is off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 1. Force-Directed Physics Engine (requestAnimationFrame)
  useEffect(() => {
    if (isMobile || !isVisible) return; // Disable physics on mobile or when off-screen

    let animationFrameId;

    const runPhysics = () => {
      setNodes(prevNodes => {
        // Create a deep copy to mutate velocity & position
        const nextNodes = prevNodes.map(node => ({
          ...node,
          vx: node.vx || 0,
          vy: node.vy || 0
        }));

        const boardWidth = boardRef.current ? boardRef.current.clientWidth : 1000;
        const boardHeight = boardRef.current ? boardRef.current.clientHeight : 500;
        const centerX = boardWidth / 2;
        const centerY = boardHeight / 2;

        // A. Repulsion between all nodes (prevent overlapping)
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const nodeA = nextNodes[i];
            const nodeB = nextNodes[j];

            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            // Ideal distance depends if they are projects or skills
            const idealDist = (nodeA.isProject || nodeB.isProject) ? 140 : 100;

            if (dist < idealDist) {
              const force = (idealDist - dist) * 0.08;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              // Don't push dragged node
              if (draggedNode !== nodeA.id) {
                nodeA.vx -= fx;
                nodeA.vy -= fy;
              }
              if (draggedNode !== nodeB.id) {
                nodeB.vx += fx;
                nodeB.vy += fy;
              }
            }
          }
        }

        // B. Gravity / Attraction to center (prevent drifting out of canvas)
        nextNodes.forEach(node => {
          if (draggedNode === node.id) return;
          const dx = centerX - node.x;
          const dy = centerY - node.y;
          node.vx += dx * 0.003;
          node.vy += dy * 0.003;
        });

        // C. Link Tension (attract connected projects and skills)
        initialLinks.forEach(link => {
          const sourceNode = nextNodes.find(n => n.id === link.source);
          const targetNode = nextNodes.find(n => n.id === link.target);

          if (sourceNode && targetNode) {
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const targetDist = 110; // Optimal spring length

            const force = (dist - targetDist) * 0.015;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (draggedNode !== sourceNode.id) {
              sourceNode.vx += fx;
              sourceNode.vy += fy;
            }
            if (draggedNode !== targetNode.id) {
              targetNode.vx -= fx;
              targetNode.vy -= fy;
            }
          }
        });

        // D. Apply Velocity Damping and update positions
        nextNodes.forEach(node => {
          if (draggedNode === node.id) return;

          // Damping/friction (tighter settling)
          node.vx *= 0.78;
          node.vy *= 0.78;

          // Update position
          node.x += node.vx;
          node.y += node.vy;

          // Contain within bounds
          const margin = node.isProject ? 50 : 40;
          node.x = Math.max(margin, Math.min(boardWidth - margin, node.x));
          node.y = Math.max(margin, Math.min(boardHeight - margin, node.y));
        });

        return nextNodes;
      });

      animationFrameId = requestAnimationFrame(runPhysics);
    };

    runPhysics();

    return () => cancelAnimationFrame(animationFrameId);
  }, [draggedNode, isMobile, isVisible]);

  // 2. Drag Handlers
  const handleMouseMove = (e) => {
    if (!draggedNode || isMobile) return;
    const board = boardRef.current;
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev => prev.map(n => n.id === draggedNode ? { ...n, x, y, vx: 0, vy: 0 } : n));
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // Determine if links/nodes are highlighted based on active hovers
  const isNodeConnected = (nodeId) => {
    if (!hoveredNode) return false;
    if (hoveredNode === nodeId) return true;
    return initialLinks.some(l => 
      (l.source === hoveredNode && l.target === nodeId) ||
      (l.target === hoveredNode && l.source === nodeId)
    );
  };

  const renderProjectIcon = (iconName) => {
    switch (iconName) {
      case 'FaVideo': return <FaVideo />;
      case 'FaGamepad': return <FaGamepad />;
      case 'FaUtensils': return <FaUtensils />;
      case 'FaChartLine': return <FaChartLine />;
      case 'FaPalette': return <FaPalette />;
      default: return <FaCogs />;
    }
  };

  return (
    <section ref={sectionRef} id="skills" className="skills" style={{ padding: isMobile ? "80px 16px" : "100px 20px", zIndex: 2, position: "relative" }}>
      <div className="section-telemetry">[ SEC_03 // MATRIX_NET ]</div>
      <h2 className="skills-title section-title-neon" style={{ fontSize: isMobile ? "2rem" : "3rem", marginBottom: isMobile ? "20px" : "10px" }}>
        Skills
      </h2>
      <p style={{ margin: 0, fontSize: isMobile ? "0.9rem" : "1.05rem", color: "var(--text-color)", maxWidth: "600px", fontFamily: "'Inter', sans-serif" }}>
        Stephen's interactive skill network showing exactly how technical tools were applied across each core project.
      </p>

      {isMobile ? (
        /* ============================================================
           A. Mobile Fallback Deck (Clean lists, no physics)
           ============================================================ */
        <div className="skills-mobile-deck">
          {/* Languages */}
          <div className="skills-mobile-category">
            <h3>Languages</h3>
            <div className="skills-mobile-grid">
              {initialNodes.filter(n => !n.isProject && n.iconClass.includes('java') || n.iconClass.includes('python') || n.iconClass.includes('javascript') || n.iconClass.includes('cplusplus')).map(n => (
                <div key={n.id} className="skills-mobile-card">
                  <i className={`${n.iconClass} skills-mobile-card-icon`} />
                  <div>
                    <span className="skills-mobile-card-label">{n.label}</span>
                    <span className="skills-mobile-card-status">{n.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frameworks & APIs */}
          <div className="skills-mobile-category">
            <h3>Frameworks & AI</h3>
            <div className="skills-mobile-grid">
              {initialNodes.filter(n => !n.isProject && n.iconClass.includes('react') || n.iconClass.includes('spring') || n.iconClass.includes('google') || n.id === 'webrtc' || n.id === 'fastapi').map(n => (
                <div key={n.id} className="skills-mobile-card">
                  <i className={`${n.iconClass} skills-mobile-card-icon`} />
                  <div>
                    <span className="skills-mobile-card-label">{n.label}</span>
                    <span className="skills-mobile-card-status">{n.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database & DevOps */}
          <div className="skills-mobile-category">
            <h3>DevOps & DB</h3>
            <div className="skills-mobile-grid">
              {initialNodes.filter(n => !n.isProject && n.iconClass.includes('docker') || n.iconClass.includes('kubernetes') || n.iconClass.includes('postgresql') || n.iconClass.includes('git')).map(n => (
                <div key={n.id} className="skills-mobile-card">
                  <i className={`${n.iconClass} skills-mobile-card-icon`} />
                  <div>
                    <span className="skills-mobile-card-label">{n.label}</span>
                    <span className="skills-mobile-card-status">{n.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================
           B. World-Class Interactive Force-Directed Graph (Desktop)
           ============================================================ */
        <div 
          ref={boardRef}
          className="graph-board-container"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="graph-instructions-card">
            🎯 Hover any project/skill to trace connection edges // Drag to organize nodes.
          </div>

          {/* SVG Connector Lines */}
          <svg className="graph-svg-overlay">
            {initialLinks.map((link, idx) => {
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              
              if (!sourceNode || !targetNode) return null;

              const isActive = hoveredNode === link.source || hoveredNode === link.target;
              const isAnyHovered = hoveredNode !== null;

              return (
                <line
                  key={idx}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  className={`graph-link-line ${isActive ? 'active' : ''} ${isAnyHovered && !isActive ? 'dimmed' : ''}`}
                  style={{ '--link-color': sourceNode.color }}
                />
              );
            })}
          </svg>

          {/* Interactive Floating Nodes */}
          {nodes.map(node => {
            const isActive = isNodeConnected(node.id) || hoveredNode === node.id;
            const isAnyHovered = hoveredNode !== null;
            const nodeColor = node.color || '#ffb300';

            return (
              <div
                key={node.id}
                className={`graph-node ${node.isProject ? 'project-node' : ''} ${isActive ? 'active' : ''} ${isAnyHovered && !isActive ? 'dimmed' : ''}`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  '--node-color': nodeColor
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setDraggedNode(node.id);
                }}
              >
                {node.isProject ? (
                  <>
                    <div className="graph-node-icon" style={{ color: nodeColor }}>
                      {renderProjectIcon(node.icon)}
                    </div>
                    <div className="graph-node-label">{node.label}</div>
                  </>
                ) : (
                  <>
                    <i className={`${node.iconClass} graph-node-icon`} />
                    <div className="graph-node-label">{node.label}</div>
                  </>
                )}

                {/* Glowing context tags on active node hovers */}
                {isActive && (
                  <span className="graph-status-tag" style={{ '--node-color': nodeColor }}>
                    {node.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Skills;