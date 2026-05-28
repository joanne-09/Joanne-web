import React, { useEffect, useRef, useState } from 'react';
import * as d3Force from 'd3-force';
import * as d3Drag from 'd3-drag';
import * as d3Selection from 'd3-selection';

interface SkillGroup {
  name: string;
  confidence: number;
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

const decorations = Array.from({ length: 25 }).map((_, i) => ({
  id: `dec-${i}`,
  radius: Math.random() * 30 + 10,
}));

interface Node extends d3Force.SimulationNodeDatum {
  id: string;
  radius: number;
  originalRadius: number;
  isSkill: boolean;
  group?: SkillGroup;
}

const SkillMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const nodesRef = useRef<Node[]>([]);
  const simulationRef = useRef<d3Force.Simulation<Node, undefined> | null>(null);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = Math.max(containerRef.current.clientHeight, 500);
    const initialScaleFactor = Math.min(1, Math.max(0.5, width / 1000));

    const skillNodes: Node[] = skillData.map((group, index) => {
      const baseRadius = group.confidence * 1.5;
      return {
        id: `skill-${index}`,
        radius: baseRadius * initialScaleFactor,
        originalRadius: baseRadius,
        isSkill: true,
        group,
        x: Math.random() * width,
        y: Math.random() * height,
      };
    });

    const decNodes: Node[] = decorations.map((dec) => ({
      id: dec.id,
      radius: dec.radius * initialScaleFactor,
      originalRadius: dec.radius,
      isSkill: false,
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    const allNodes = [...skillNodes, ...decNodes];
    setNodes(allNodes);

    const simulation = d3Force.forceSimulation<Node>(allNodes)
      .force('collide', d3Force.forceCollide<Node>().radius(d => d.radius + 2).iterations(3))
      .force('y', d3Force.forceY(height).strength(0.05))
      .force('x', d3Force.forceX(width / 2).strength(0.01))
      .force('charge', d3Force.forceManyBody().strength(d => (d as Node).isSkill ? -30 : -10))
      .on('tick', () => {
        const currentNodes = simulation.nodes();
        const currentWidth = containerRef.current ? containerRef.current.clientWidth : width;
        const currentHeight = containerRef.current ? Math.max(containerRef.current.clientHeight, 500) : height;
        
        currentNodes.forEach(node => {
          if (node.x !== undefined && node.y !== undefined && node.vx !== undefined && node.vy !== undefined) {
            if (node.x < node.radius) { node.x = node.radius; node.vx *= -0.5; }
            if (node.x > currentWidth - node.radius) { node.x = currentWidth - node.radius; node.vx *= -0.5; }
            if (node.y < node.radius) { node.y = node.radius; node.vy *= -0.5; }
            if (node.y > currentHeight - node.radius) { node.y = currentHeight - node.radius; node.vy *= -0.5; }
          }
        });
        setNodes([...currentNodes]);
      });

    simulationRef.current = simulation;

    const handleResize = () => {
      if (!containerRef.current || !simulationRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = Math.max(containerRef.current.clientHeight, 500);
      const scaleFactor = Math.min(1, Math.max(0.5, newWidth / 1000));

      const currentNodes = simulationRef.current.nodes();
      currentNodes.forEach(node => {
        node.radius = node.originalRadius * scaleFactor;
      });

      simulationRef.current.force('collide', d3Force.forceCollide<Node>().radius(d => d.radius + 2).iterations(3));
      simulationRef.current.force('y', d3Force.forceY(newHeight).strength(0.05));
      simulationRef.current.force('x', d3Force.forceX(newWidth / 2).strength(0.01));
      simulationRef.current.alpha(0.3).restart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !simulationRef.current || nodes.length === 0) return;

    const simulation = simulationRef.current;
    const circles = d3Selection
      .select(containerRef.current)
      .selectAll<Element, Node>('.physics-circle')
      .data(nodesRef.current);

    const drag = d3Drag.drag<Element, Node>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
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
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
      });

    circles.call(drag);
  }, [nodes.length]);

  return (
    <section id="skills" className="w-full bg-[var(--background)] py-20">
      <div className="mx-auto w-full max-w-[1200px] px-5">
        <div className="mb-[60px] text-center">
          <h2 className="mb-[15px] font-serif text-4xl font-semibold text-[var(--primary)]">Skills</h2>
          <div className="mx-auto h-[3px] w-20 bg-[var(--accent)]"></div>
        </div>
        
        <div 
          className="relative min-h-[500px] w-full cursor-grab overflow-hidden active:cursor-grabbing" 
          ref={containerRef}
        >
          {nodes.map((node) => {
            if (node.isSkill && node.group) {
              const minRadius = 45;
              const maxRadius = 150;
              const minFontSize = 0.95;
              const maxFontSize = 1.5;
              
              let fontSize = minFontSize;
              if (node.originalRadius > minRadius) {
                const ratio = Math.min(1, (node.originalRadius - minRadius) / (maxRadius - minRadius));
                fontSize = minFontSize + ratio * (maxFontSize - minFontSize);
              }
              
              const scaleFactor = node.radius / node.originalRadius;
              fontSize = fontSize * scaleFactor;

              return (
                <div 
                  key={node.id}
                  id={node.id}
                  className="physics-circle group absolute z-10 flex select-none items-center justify-center overflow-hidden rounded-full bg-[var(--primary)] text-[var(--background)] transition hover:z-20 hover:bg-[var(--accent)]"
                  style={{ 
                    width: `${node.radius * 2}px`, 
                    height: `${node.radius * 2}px`,
                    left: `${(node.x || 0) - node.radius}px`,
                    top: `${(node.y || 0) - node.radius}px`,
                  }}
                >
                  <div className="pointer-events-none flex h-full w-full items-center justify-center p-4 text-center">
                    <h3 
                      className="absolute left-1/2 top-1/2 m-0 w-full -translate-x-1/2 -translate-y-1/2 font-bold transition group-hover:invisible group-hover:opacity-0"
                      style={{ fontSize: `${1.4 * scaleFactor}rem` }}
                    >
                      {node.group.name}
                    </h3>
                    <div className="invisible absolute left-1/2 top-1/2 flex w-4/5 -translate-x-1/2 -translate-y-1/2 flex-col gap-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                      {node.group.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="truncate whitespace-nowrap font-medium"
                          style={{ fontSize: `${fontSize}rem` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={node.id}
                id={node.id}
                className="physics-circle absolute z-[5] rounded-full bg-[var(--thirdary)] opacity-50"
                style={{
                  width: `${node.radius * 2}px`,
                  height: `${node.radius * 2}px`,
                  left: `${(node.x || 0) - node.radius}px`,
                  top: `${(node.y || 0) - node.radius}px`,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillMap;
