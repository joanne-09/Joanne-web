import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3Drag from 'd3-drag';
import * as d3Force from 'd3-force';
import * as d3Selection from 'd3-selection';

import Container from './ui/Container';
import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';
import Tag from './ui/Tag';
import { useReducedMotion } from '../lib/motion';

/** Tailwind's `sm`. Below it the bubbles are too small to hold a skill list. */
const NARROW = 640;

/**
 * Where the bubbles settle, as a fraction of the field height.
 *
 * 0.72 reads as "fallen to the bottom", which needs a field tall enough to
 * still show empty space above them. A phone field is 380px, so 0.72 left a
 * 121px dead band under the heading and packed every bubble wall-to-wall
 * beneath it. Narrow screens centre the cluster instead.
 */
const settleFactor = (width: number) => (width < NARROW ? 0.5 : 0.72);

interface SkillGroup {
  name: string;
  confidence: number;
  skills: string[];
}

/**
 * Confidence used to be readable only by hue. With a monochrome palette it is
 * re-encoded twice over, so the ranking survives: bubble size (already driven
 * by confidence in the layout below) and fill weight — strongest groups are
 * solid ink, weakest are outline only.
 */
/** Below this the longest group name no longer fits inside the circle. */
const MIN_SKILL_RADIUS = 37;

/** Label size follows the bubble, so it can never outgrow its circle. */
const nameFontRem = (radius: number) => Math.max(0.62, Math.min(1.35, radius / 46));

const confidenceTier = (confidence: number) => {
  // The top tier is the only place on the page where a large area of accent
  // appears, which is exactly what makes the strongest skills read first.
  if (confidence >= 85) return 'bg-brand text-brand-contrast border-transparent';
  if (confidence >= 70) return 'bg-surface-strong text-ink border-line-strong';
  if (confidence >= 50) return 'bg-surface text-ink border-line-strong';
  return 'bg-transparent text-muted border-line';
};

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
  },
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
  const reducedMotion = useReducedMotion();
  const [nodes, setNodes] = useState<Node[]>([]);
  /*
   * Which group the visitor has tapped. Touch has no hover, so without this the
   * skill lists inside the bubbles are simply unreachable on a phone — and the
   * bubbles there are only ~74px across, far too small to hold "Chinese
   * (Native)" legibly even if they could be opened. Below `sm` the selected
   * group is spelled out under the field instead; from `sm` up the hover
   * behaviour is untouched.
   */
  const [selectedGroup, setSelectedGroup] = useState<SkillGroup | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const simulationRef = useRef<d3Force.Simulation<Node, undefined> | null>(null);
  // Fewer filler circles on small screens, where they crowd the real bubbles
  // rather than giving them a field to sit in.
  const decorationCount = typeof window !== 'undefined' && window.innerWidth < 640 ? 9 : 20;
  const decorations = useMemo(() => Array.from({ length: decorationCount }).map((_, index) => ({
    id: `dec-${index}`,
    radius: 8 + ((index * 17) % 28),
  })), [decorationCount]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    // The container's own min-height is set in CSS and differs by breakpoint,
    // so the bounds follow the real box rather than a hardcoded desktop value.
    const height = containerRef.current.clientHeight;
    const initialScaleFactor = Math.min(1, Math.max(0.42, width / 1040));

    const skillNodes: Node[] = skillData.map((group, index) => {
      const baseRadius = 42 + group.confidence * 0.76;

      return {
        id: `skill-${index}`,
        // Floored so the longest label ("Hardware", "Database") still fits
        // inside the circle at the smallest breakpoint instead of being
        // clipped by the bubble's overflow.
        radius: Math.max(MIN_SKILL_RADIUS, baseRadius * initialScaleFactor),
        originalRadius: baseRadius,
        isSkill: true,
        group,
        x: width * (0.18 + ((index * 29) % 64) / 100),
        y: height * (0.18 + ((index * 23) % 62) / 100),
      };
    });

    const decNodes: Node[] = decorations.map((decoration, index) => ({
      id: decoration.id,
      radius: decoration.radius * initialScaleFactor,
      originalRadius: decoration.radius,
      isSkill: false,
      x: width * (0.08 + ((index * 37) % 84) / 100),
      y: height * (0.08 + ((index * 31) % 84) / 100),
    }));

    const allNodes = [...skillNodes, ...decNodes];
    setNodes(allNodes);

    // Keeps bubbles inside the frame, bouncing them off the edges. Shared so
    // the reduced-motion path below produces the same layout the animated one
    // settles into.
    const clampToBounds = (list: Node[]) => {
      const currentWidth = containerRef.current ? containerRef.current.clientWidth : width;
      const currentHeight = containerRef.current ? containerRef.current.clientHeight : height;

      list.forEach((node) => {
        if (node.x === undefined || node.y === undefined || node.vx === undefined || node.vy === undefined) {
          return;
        }

        if (node.x < node.radius) {
          node.x = node.radius;
          node.vx *= -0.45;
        }

        if (node.x > currentWidth - node.radius) {
          node.x = currentWidth - node.radius;
          node.vx *= -0.45;
        }

        if (node.y < node.radius) {
          node.y = node.radius;
          node.vy *= -0.45;
        }

        if (node.y > currentHeight - node.radius) {
          node.y = currentHeight - node.radius;
          node.vy *= -0.45;
        }
      });
    };

    const simulation = d3Force.forceSimulation<Node>(allNodes)
      .force('collide', d3Force.forceCollide<Node>().radius((node) => node.radius + 6).iterations(4))
      .force('y', d3Force.forceY(height * settleFactor(width)).strength(0.052))
      .force('x', d3Force.forceX(width / 2).strength(0.012))
      .force('charge', d3Force.forceManyBody().strength((node) => (node as Node).isSkill ? -48 : -14))
      .on('tick', () => {
        const currentNodes = simulation.nodes();
        clampToBounds(currentNodes);
        setNodes([...currentNodes]);
      });

    simulationRef.current = simulation;

    // With reduced motion the layout is solved synchronously and painted once,
    // so the bubbles are simply *there* instead of visibly settling. This also
    // avoids a React render on every animation frame.
    if (reducedMotion) {
      simulation.stop();

      for (let step = 0; step < 320; step += 1) {
        simulation.tick();
        clampToBounds(simulation.nodes());
      }

      setNodes([...simulation.nodes()]);
    }

    const handleResize = () => {
      if (!containerRef.current || !simulationRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      const scaleFactor = Math.min(1, Math.max(0.42, newWidth / 1040));
      const currentNodes = simulationRef.current.nodes();

      currentNodes.forEach((node) => {
        node.radius = node.isSkill
          ? Math.max(MIN_SKILL_RADIUS, node.originalRadius * scaleFactor)
          : node.originalRadius * scaleFactor;
      });

      simulationRef.current.force('collide', d3Force.forceCollide<Node>().radius((node) => node.radius + 6).iterations(4));
      simulationRef.current.force('y', d3Force.forceY(newHeight * settleFactor(newWidth)).strength(0.052));
      simulationRef.current.force('x', d3Force.forceX(newWidth / 2).strength(0.012));

      if (reducedMotion) {
        for (let step = 0; step < 160; step += 1) {
          simulationRef.current.tick();
          clampToBounds(simulationRef.current.nodes());
        }

        setNodes([...simulationRef.current.nodes()]);
        return;
      }

      simulationRef.current.alpha(0.34).restart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };
  }, [decorations, reducedMotion]);

  useEffect(() => {
    if (!containerRef.current || !simulationRef.current || nodes.length === 0) return;

    const simulation = simulationRef.current;
    const circles = d3Selection
      .select(containerRef.current)
      .selectAll<Element, Node>('.physics-circle')
      .data(nodesRef.current);

    const drag = d3Drag.drag<Element, Node>()
      .on('start', (event, node) => {
        if (!event.active) simulation.alphaTarget(0.24).restart();
        node.fx = node.x;
        node.fy = node.y;
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
      })
      .on('drag', (event, node) => {
        node.fx = event.x;
        node.fy = event.y;
      })
      .on('end', (event, node) => {
        if (!event.active) simulation.alphaTarget(0);
        node.fx = null;
        node.fy = null;
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
      });

    circles.call(drag);
  }, [nodes.length]);

  return (
    <section id="skills" className="w-full py-14 md:py-28">
      <Container>
        <SectionHeader
          label="Skills"
          title={
            <>
              Technical <span className="serif-accent">skills</span>, tools, and languages.
            </>
          }
          lead="Bigger and more solid means more practised. Drag a bubble to move it, or tap one to see what is inside."
        />

        {/* No frame: the bubbles sit directly on the page background. */}
        <Reveal
          delay={160}
          className="relative mt-10 min-h-[440px] w-full cursor-grab active:cursor-grabbing md:mt-12 md:min-h-[560px]"
        >
          <div className="absolute inset-0" ref={containerRef}>
          {nodes.map((node) => {
            if (node.isSkill && node.group) {
              const scaleFactor = node.radius / node.originalRadius;
              const listFontSize = Math.max(0.58, Math.min(0.92, 0.86 * scaleFactor));

              const isSelected = selectedGroup?.name === node.group.name;

              return (
                <div
                  key={node.id}
                  id={node.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${node.group.name}: ${node.group.skills.join(', ')}`}
                  onClick={() => setSelectedGroup(isSelected ? null : node.group ?? null)}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    setSelectedGroup(isSelected ? null : node.group ?? null);
                  }}
                  className={`physics-circle group absolute z-10 flex cursor-pointer select-none items-center justify-center overflow-hidden rounded-full border transition-[background-color,border-color,color,box-shadow] duration-[var(--dur)] ease-[var(--ease-out-quint)] hover:z-20 hover:border-transparent hover:bg-ink hover:text-invert hover:shadow-[var(--shadow-lift)] ${
                    isSelected
                      ? 'z-20 border-transparent bg-ink text-invert shadow-[var(--shadow-lift)]'
                      : confidenceTier(node.group.confidence)
                  }`}
                  style={{
                    width: `${node.radius * 2}px`,
                    height: `${node.radius * 2}px`,
                    left: `${(node.x || 0) - node.radius}px`,
                    top: `${(node.y || 0) - node.radius}px`,
                  }}
                >
                  <div className="pointer-events-none flex h-full w-full items-center justify-center p-2 text-center md:p-4">
                    {/*
                      The name/list swap is gated at `sm` and up. Below that a
                      bubble is ~74px across, so the list would render as a
                      column of truncated stubs — the group name is the more
                      useful thing to keep, and the tapped group is spelled out
                      under the field instead.
                    */}
                    <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transition sm:group-hover:invisible sm:group-hover:opacity-0">
                      <h3
                        className="px-0.5 font-medium leading-tight tracking-[-0.02em] hyphens-auto"
                        style={{ fontSize: `${nameFontRem(node.radius)}rem` }}
                      >
                        {node.group.name}
                      </h3>
                    </div>
                    <div className="invisible absolute left-1/2 top-1/2 flex w-4/5 -translate-x-1/2 -translate-y-1/2 flex-col gap-1 opacity-0 transition sm:group-hover:visible sm:group-hover:opacity-100">
                      {node.group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="truncate whitespace-nowrap font-medium"
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
                className="physics-circle absolute z-[5] rounded-full border border-line opacity-60"
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
        </Reveal>

        {/*
          Readout for the selected bubble, at every width.

          Below `sm` it is the only way to read a group's skills, since the
          bubbles are ~74px across and the in-bubble list is gated at `sm`.
          It stays on above `sm` because hover is not a width: a 700px-wide
          touch tablet clears the breakpoint but still cannot hover, and
          hiding this there left it with no route to the content at all. It
          also gives the keyboard path somewhere to land.

          aria-live announces the change; the reserved min-height stops the
          section reflowing as groups are selected.
        */}
        <div className="mt-6 min-h-[4.5rem]" aria-live="polite">
          {selectedGroup ? (
            <>
              <p className="label">{selectedGroup.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedGroup.skills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-subtle sm:hidden">Tap a bubble to see the skills inside it.</p>
          )}
        </div>
      </Container>
    </section>
  );
};

export default SkillMap;
