import React, { useEffect, useRef, useState } from 'react';
import * as d3Force from 'd3-force';
import * as d3Drag from 'd3-drag';
import * as d3Selection from 'd3-selection';
import '../styles/SkillMap.css';

interface SkillGroup {
  name: string;
  confidence: number; // 1 to 100
  skills: string[];
}

const skillData: SkillGroup[] = [
  {
    name: 'AI',
    confidence: 80,
    skills: ['PyTorch', 'TensorFlow', 'Deep Learning', 'Numpy', 'Pandas'],
  },
  {
    name: 'Frontend',
    confidence: 70,
    skills: ['React', 'TypeScript', 'HTML/CSS', 'Tailwind'],
  },
  {
    name: 'Backend',
    confidence: 50,
    skills: ['Node.js', 'Express', 'Python', 'FastAPI'],
  },
  {
    name: 'Mobile',
    confidence: 60,
    skills: ['Flutter', 'Dart'],
  },
  {
    name: 'Database',
    confidence: 40,
    skills: ['PostgreSQL', 'MySQL'],
  },
  {
    name: 'Tools',
    confidence: 90,
    skills: ['Git', 'Docker', 'VS Code', 'Firebase'],
  },
  {
    name: 'Languages',
    confidence: 95,
    skills: ['English', 'Chinese (Native)'],
  },
  {
    name: 'Hardware',
    confidence: 40,
    skills: ['CUDA', 'Verilog'],
  },
  {
    name: 'Game Dev',
    confidence: 40,
    skills: ['Unity', 'C#', 'Cocos Creator'],
  }
];

// some random sized circles
const decorationCount = 25;
const decorations = Array.from({ length: decorationCount }).map((_, i) => ({
  id: `dec-${i}`,
  radius: Math.random() * 30 + 10, // 10 to 40
}));

// node type for d3-force
interface Node extends d3Force.SimulationNodeDatum {
  id: string;
  radius: number;
  isSkill: boolean;
  group?: SkillGroup;
}

const SkillMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const simulationRef = useRef<d3Force.Simulation<Node, undefined> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = Math.max(containerRef.current.clientHeight, 500);

    // init nodes
    const skillNodes: Node[] = skillData.map((group, index) => ({
      id: `skill-${index}`,
      radius: group.confidence * 1.5,
      isSkill: true,
      group,
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    const decNodes: Node[] = decorations.map((dec) => ({
      id: dec.id,
      radius: dec.radius,
      isSkill: false,
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    const allNodes = [...skillNodes, ...decNodes];
    setNodes(allNodes);

    // setup d3-force simulation
    const simulation = d3Force.forceSimulation<Node>(allNodes)
      .force('collide', d3Force.forceCollide<Node>().radius(d => d.radius + 2).iterations(3))
      .force('y', d3Force.forceY(height).strength(0.05))
      .force('x', d3Force.forceX(width / 2).strength(0.01))
      .force('charge', d3Force.forceManyBody().strength(d => (d as Node).isSkill ? -30 : -10))
      .on('tick', () => {
        const currentNodes = simulation.nodes();
        currentNodes.forEach(node => {
          if (node.x !== undefined && node.y !== undefined && node.vx !== undefined && node.vy !== undefined) {
            if (node.x < node.radius) { node.x = node.radius; node.vx *= -0.5; }
            if (node.x > width - node.radius) { node.x = width - node.radius; node.vx *= -0.5; }
            if (node.y < node.radius) { node.y = node.radius; node.vy *= -0.5; }
            if (node.y > height - node.radius) { node.y = height - node.radius; node.vy *= -0.5; }
          }
        });
        // update state to re-render
        setNodes([...currentNodes]);
      });

    simulationRef.current = simulation;

    // resize
    const handleResize = () => {
      if (!containerRef.current || !simulationRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = Math.max(containerRef.current.clientHeight, 500);
      
      simulationRef.current.force('y', d3Force.forceY(newHeight).strength(0.05));
      simulationRef.current.force('x', d3Force.forceX(newWidth / 2).strength(0.01));
      simulationRef.current.alpha(0.3).restart(); // Re-heat simulation slightly on resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };
  }, []);

  // drag behavior using d3-drag
  useEffect(() => {
    if (!containerRef.current || !simulationRef.current || nodes.length === 0) return;

    const simulation = simulationRef.current;
    
    // select all circle
    const circles = d3Selection.select(containerRef.current).selectAll('.physics-circle');

    const drag = d3Drag.drag<Element, Node>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        // add grabbing class to container
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        // remove grabbing class
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
      });

    // apply drag to circles
    circles.data(nodes).call(drag as any);

  }, [nodes.length]);

  return (
    <section id="skills">
      <div className="container">
        <div className="section-title">
          <h2>Skills</h2>
          <div className="line"></div>
        </div>
        
        <div 
          className="skill-physics-container" 
          ref={containerRef}
          style={{ 
            height: '100vh', 
            minHeight: '500px',
            position: 'relative', 
            overflow: 'hidden', 
            width: '100%', 
          }}
        >
          {nodes.map((node) => {
            if (node.isSkill && node.group) {
              const minRadius = 45;
              const maxRadius = 150;
              const minFontSize = 0.95;
              const maxFontSize = 1.5;
              
              let fontSize = minFontSize;
              if (node.radius > minRadius) {
                const ratio = Math.min(1, (node.radius - minRadius) / (maxRadius - minRadius));
                fontSize = minFontSize + ratio * (maxFontSize - minFontSize);
              }

              return (
                <div 
                  key={node.id}
                  id={node.id}
                  className="physics-circle skill-circle-interactive"
                  style={{ 
                    width: `${node.radius * 2}px`, 
                    height: `${node.radius * 2}px`,
                    position: 'absolute',
                    left: `${(node.x || 0) - node.radius}px`,
                    top: `${(node.y || 0) - node.radius}px`,
                    zIndex: 10
                  }}
                >
                  <div className="skill-circle-content">
                    <h3 className="skill-group-name">{node.group.name}</h3>
                    <div className="skill-list">
                      {node.group.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="skill-item"
                          style={{ fontSize: `${fontSize}rem` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={node.id}
                  id={node.id}
                  className="physics-circle dec-circle"
                  style={{
                    width: `${node.radius * 2}px`,
                    height: `${node.radius * 2}px`,
                    position: 'absolute',
                    left: `${(node.x || 0) - node.radius}px`,
                    top: `${(node.y || 0) - node.radius}px`,
                    zIndex: 5
                  }}
                />
              );
            }
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillMap;
