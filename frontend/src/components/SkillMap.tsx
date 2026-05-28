import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const decorations = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: `dec-${i}`,
    radius: 8 + ((i * 17) % 28),
  })), []);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = Math.max(containerRef.current.clientHeight, 560);
    const initialScaleFactor = Math.min(1, Math.max(0.52, width / 1040));

    const skillNodes: Node[] = skillData.map((group, index) => {
      const baseRadius = 42 + group.confidence * 0.76;
      return {
        id: `skill-${index}`,
        radius: baseRadius * initialScaleFactor,
        originalRadius: baseRadius,
        isSkill: true,
        group,
        x: width * (0.18 + ((index * 29) % 64) / 100),
        y: height * (0.18 + ((index * 23) % 62) / 100),
      };
    });

    const decNodes: Node[] = decorations.map((dec, index) => ({
      id: dec.id,
      radius: dec.radius * initialScaleFactor,
      originalRadius: dec.radius,
      isSkill: false,
      x: width * (0.08 + ((index * 37) % 84) / 100),
      y: height * (0.08 + ((index * 31) % 84) / 100),
    }));

    const allNodes = [...skillNodes, ...decNodes];
    setNodes(allNodes);

    const simulation = d3Force.forceSimulation<Node>(allNodes)
      .force('collide', d3Force.forceCollide<Node>().radius(d => d.radius + 6).iterations(4))
      .force('y', d3Force.forceY(height * 0.88).strength(0.052))
      .force('x', d3Force.forceX(width / 2).strength(0.012))
      .force('charge', d3Force.forceManyBody().strength(d => (d as Node).isSkill ? -48 : -14))
      .on('tick', () => {
        const currentNodes = simulation.nodes();
        const currentWidth = containerRef.current ? containerRef.current.clientWidth : width;
        const currentHeight = containerRef.current ? Math.max(containerRef.current.clientHeight, 560) : height;

        currentNodes.forEach(node => {
          if (node.x !== undefined && node.y !== undefined && node.vx !== undefined && node.vy !== undefined) {
            if (node.x < node.radius) { node.x = node.radius; node.vx *= -0.45; }
            if (node.x > currentWidth - node.radius) { node.x = currentWidth - node.radius; node.vx *= -0.45; }
            if (node.y < node.radius) { node.y = node.radius; node.vy *= -0.45; }
            if (node.y > currentHeight - node.radius) { node.y = currentHeight - node.radius; node.vy *= -0.45; }
          }
        });
        setNodes([...currentNodes]);
      });

    simulationRef.current = simulation;

    const handleResize = () => {
      if (!containerRef.current || !simulationRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = Math.max(containerRef.current.clientHeight, 560);
      const scaleFactor = Math.min(1, Math.max(0.52, newWidth / 1040));

      const currentNodes = simulationRef.current.nodes();
      currentNodes.forEach(node => {
        node.radius = node.originalRadius * scaleFactor;
      });

      simulationRef.current.force('collide', d3Force.forceCollide<Node>().radius(d => d.radius + 6).iterations(4));
      simulationRef.current.force('y', d3Force.forceY(newHeight * 0.88).strength(0.052));
      simulationRef.current.force('x', d3Force.forceX(newWidth / 2).strength(0.012));
      simulationRef.current.alpha(0.34).restart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };
  }, [decorations]);

  useEffect(() => {
    if (!containerRef.current || !simulationRef.current || nodes.length === 0) return;

    const simulation = simulationRef.current;
    const circles = d3Selection
      .select(containerRef.current)
      .selectAll<Element, Node>('.physics-circle')
      .data(nodesRef.current);

    const drag = d3Drag.drag<Element, Node>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.24).restart();
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
    <section id="skills" className="w-full bg-[var(--surface-soft)] py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1180px] px-5">
        <div className="mb-10 grid gap-5 md:grid-cols-[260px_1fr] md:items-start">
          <div>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-[var(--section-heading)] md:text-5xl">Skills</h2>
            <div className="mt-5 flex w-36 items-center gap-2">
              <span className="h-[6px] w-12 rounded-full bg-[var(--section-rule)]"></span>
              <span className="h-px flex-1 bg-[var(--section-rule-soft)]"></span>
            </div>
          </div>
        </div>

        <div
          className="relative min-h-[560px] w-full cursor-grab overflow-hidden border-y border-[var(--border-strong)] active:cursor-grabbing"
          ref={containerRef}
        >
          {nodes.map((node) => {
            if (node.isSkill && node.group) {
              const scaleFactor = node.radius / node.originalRadius;
              const listFontSize = Math.max(0.72, Math.min(0.92, 0.86 * scaleFactor));

              return (
                <div
                  key={node.id}
                  id={node.id}
                  className="physics-circle group absolute z-10 flex select-none items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-soft)] transition duration-300 hover:z-20 hover:border-[var(--accent)] hover:bg-[var(--primary)] hover:text-[var(--text-light)] hover:shadow-[var(--shadow-lift)]"
                  style={{
                    width: `${node.radius * 2}px`,
                    height: `${node.radius * 2}px`,
                    left: `${(node.x || 0) - node.radius}px`,
                    top: `${(node.y || 0) - node.radius}px`,
                  }}
                >
                  <div className="pointer-events-none flex h-full w-full items-center justify-center p-4 text-center">
                    <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transition group-hover:invisible group-hover:opacity-0">
                      <h3 className="font-serif font-semibold leading-none" style={{ fontSize: `${Math.max(1.05, 1.38 * scaleFactor)}rem` }}>
                        {node.group.name}
                      </h3>
                    </div>
                    <div className="invisible absolute left-1/2 top-1/2 flex w-4/5 -translate-x-1/2 -translate-y-1/2 flex-col gap-1 opacity-0 transition group-hover:visible group-hover:opacity-100">
                      {node.group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="truncate whitespace-nowrap font-semibold"
                          style={{ fontSize: `${listFontSize}rem` }}
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
                className="physics-circle absolute z-[5] rounded-full border border-[var(--border)] bg-[var(--surface-strong)] opacity-70"
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
