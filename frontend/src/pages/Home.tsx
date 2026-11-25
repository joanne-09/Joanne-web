import React, { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Project } from '@joanne-web/shared';

import { Navbar, Footer } from '../components/Essentials';
import { MailIcon, MapPinIcon, PhoneIcon } from '../components/Icons';
import SkillMap from '../components/SkillMap';
import {
  Button,
  Card,
  Container,
  Img,
  Reveal,
  SectionHeader,
  SplitText,
  Tag,
} from '../components/ui';
import { useData } from '../contexts/useData';
import { useScrollParallax } from '../lib/motion';
import { scrollToId, useViewNavigate } from '../lib/navigation';

interface EducationItem {
  year: string;
  institution: string;
  degree: string;
  focus: string;
  note: string;
}

interface ActivityItem {
  title: string;
  period: string;
  role: string;
  description: string;
}

interface HomeProject {
  id: string | number;
  ghlink: string;
  imgsrc: string;
  imgalt: string;
  title: string;
  type: string;
  description: string;
  role?: string;
  tech?: unknown;
}

const contactItems = [
  { Icon: MailIcon, label: 'Email', value: 'joanne.zh2015@gmail.com', href: 'mailto:joanne.zh2015@gmail.com' },
  { Icon: PhoneIcon, label: 'Phone', value: '+886 905-937-165', href: 'tel:+886905937165' },
  { Icon: MapPinIcon, label: 'Location', value: 'Hsinchu, Taiwan' },
];

const routeLinks = [
  {
    label: 'Projects',
    path: '/projects',
    description: 'AI tools, web systems, games, and interface experiments.',
  },
  {
    label: 'Article',
    path: '/article',
    description: 'Notes from learning, debugging, and translating technical ideas.',
  },
  {
    label: 'Travel',
    path: '/travel',
    description: 'A visual archive of places, textures, food, and small memories.',
  },
];

const fallbackProjects: HomeProject[] = [
  {
    id: 'lexiaid',
    ghlink: 'https://github.com/joanne-09',
    imgsrc: 'images/lexiaid.png',
    imgalt: 'LexiAid project preview',
    title: 'LexiAid',
    type: 'AI / Accessibility',
    description: 'A reading support tool shaped around recognition, language learning, and accessible interaction patterns.',
    role: 'Frontend, model integration, UI design',
    tech: ['React', 'TypeScript', 'AI'],
  },
  {
    id: 'chatroom',
    ghlink: 'https://github.com/joanne-09',
    imgsrc: 'images/chatroom_project.png',
    imgalt: 'Realtime chatroom interface',
    title: 'Realtime Chatroom',
    type: 'Full-stack',
    description: 'A socket-based chat experience focused on clear conversation flow and resilient message state.',
    role: 'Backend APIs, client UX, deployment',
    tech: ['Node', 'React', 'WebSocket'],
  },
  {
    id: 'beat-game',
    ghlink: 'https://github.com/joanne-09',
    imgsrc: 'images/beat_game.png',
    imgalt: 'Beat game project',
    title: 'Beat Game',
    type: 'Game / Interaction',
    description: 'A rhythm-based browser game exploring timing feedback, gesture clarity, and playful interface motion.',
    role: 'Gameplay logic, interaction design',
    tech: ['JavaScript', 'Canvas', 'Game Design'],
  },
];

const educationData: EducationItem[] = [
  {
    year: '2023 — Present',
    institution: 'National Tsing Hua University',
    degree: 'B.S. in Computer Science',
    focus: 'Computer Science / AI / Systems',
    note: 'Current academic base for machine learning, computer vision, and software development work.',
  },
  {
    year: '2020 — 2023',
    institution: 'National Experimental High School, Hsinchu',
    degree: 'Normal Program',
    focus: 'Science Foundation / Independent Learning',
    note: 'Built the study habits and technical curiosity that later shaped project-based work.',
  },
];

interface ResearchItem {
  key: string;
  period: string;
  kind: string;
  title: string;
  subtitle: string;
  venue?: string;
  link?: { href: string; label: string };
  points: string[];
}

const researchData: ResearchItem[] = [
  {
    key: 'multi-agent-kv-cache',
    period: 'Jan 2027',
    kind: 'Publication · ASP-DAC 2027',
    title: 'Multi-Agent LLM Serving with SSD-Based KV-Cache Offloading',
    subtitle: 'Yu-Chen Lee, Chih Yen Chen, Ming-Yi Kuo, Yun-Chih Chen',
    venue: 'Asia and South Pacific Design Automation Conference, Tokyo · Accepted, regular paper (acceptance rate 29.5%)',
    link: { href: 'https://doi.org/10.1145/3840404.3848362', label: 'DOI: 10.1145/3840404.3848362' },
    points: [
      'Sourced and analyzed a month of Claude Code and Codex traces (1,820 sessions, 189K requests), finding that 99% of KV-cache blocks offloaded to SSD were later invalidated by conversation compaction or session termination.',
      'Built the trace-replay ZNS SSD simulation and evaluation framework, validated within 0.33% of FEMU and 3% of a real vLLM + LMCache deployment, and ran ablations against five prior-work baselines.',
      'Designed the session-based placement and eviction policy and co-designed deterministic write suppression, cutting system write amplification by 29.2% versus LMCache with no lost reads, and mean avoidable recomputation from 375 to 220 tokens/turn.',
    ],
  },
  {
    key: 'engaging-creative-writing',
    period: 'Feb 2025 — Oct 2026',
    kind: 'Undergraduate research · NTHU',
    title: 'Improving Engagement with LLM-Generated Creative Writing through Machine Learning',
    subtitle: 'Undergraduate Researcher, advised by Prof. Shan-Hung Wu',
    points: [
      'Applied SDPO to story writing for the first time (OLMo-3-7B, LoRA) with own/other/no-critique controls, showing stories shrank to 72.1% of base length and the model could not separate praise from criticism.',
      'Proposed Anchored Polarity Contrast, which contrasts a frozen base model reading the same quote labeled as a flaw versus a strength, and anchors the training target to the base model.',
      'Preserved story length at 95.9% and lowered the probability of criticized passages in 73% of stories (vs. 48% for SDPO); 95% confidence intervals ruled out regression on GSM8K and HumanEval/MBPP beyond pre-set margins.',
    ],
  },
];

interface ExperienceItem {
  key: string;
  period: string;
  title: string;
  role: string;
  location: string;
  points: string[];
}

const experienceData: ExperienceItem[] = [
  {
    key: 'itri',
    period: 'Jul 2026 — Present',
    title: 'Industrial Technology Research Institute (ITRI)',
    role: 'RD Intern, Information and Communications Research Laboratories',
    location: 'Hsinchu, Taiwan',
    points: [
      'Co-developed agent-teams, a Claude Code plugin in which requirements, architecture, development, QA, and manager AI agents collaborate on one GitHub Projects board under minimal human gating.',
      "Wrote every agent's role instructions and added a QA browser agent that tests the running app, not the code.",
      'Co-designed board status and role fields as the sole agent handoff interface and remote branches as a card-claim lock, enforcing merge and QA permissions in code rather than prompts.',
      'Rebuilt the requester and executor flows from a blank branch, turned a 2-hour setup into a one-command install script for non-engineer project managers, and tested the full workflow on a dashboard project with 768 test cases.',
    ],
  },
  {
    key: 'meichu',
    period: 'Nov 2025 — Oct 2026',
    title: '14th Meichu Hackathon',
    role: 'Head of Development',
    location: 'Hsinchu, Taiwan',
    points: [
      'Led a 6-person team that shipped 3 services for the 2026 event (an event app used by about 400 participants, staff, and visitors; registration site; blog), turning cross-department requirements into plans and milestones.',
      'Replaced the LINE-bot participant experience with a React/TypeScript PWA on FastAPI and PostgreSQL, deployed on AWS with Docker, Nginx, and CI/CD, and kept all services running through the event.',
    ],
  },
];

const activitiesData: ActivityItem[] = [
  {
    title: 'NTHU Blockchain Club x NTHU GDSC',
    period: '2024.9 — 2026.1',
    role: 'Activities Department',
    description: 'Organized 2 technical workshops and industry networking events, coordinating speakers, curricula, and teams for club activities focused on blockchain technology and software development.',
  },
  {
    title: 'NYCU Google Developer Student Club',
    period: '2025.2 — 2025.9',
    role: 'Public Relations and Activities',
    description: 'Build relationships with industry professionals and potential speakers for technical workshops. Collaborate with lecturers on curriculum and improve club visibility through strategic content.',
  },
];

const imageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

const toProject = (project: Project | HomeProject): HomeProject => ({
  id: project.id,
  ghlink: project.ghlink,
  imgsrc: project.imgsrc,
  imgalt: project.imgalt,
  title: project.title,
  type: project.type,
  description: project.description,
  role: project.role,
  tech: project.tech,
});

const projectTags = (tech: unknown) => {
  if (Array.isArray(tech)) return tech.map(String).slice(0, 4);
  if (typeof tech === 'string') {
    try {
      const parsed = JSON.parse(tech);
      return Array.isArray(parsed) ? parsed.map(String).slice(0, 4) : [];
    } catch {
      return tech.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 4);
    }
  }
  return [];
};

const CV_URL = imageUrl('cv.pdf');

// Tighter rhythm on phones — the desktop spacing stacked up to a needlessly
// long scroll once every section was in one column.
const section = 'py-14 md:py-28';

const Hero: React.FC = () => {
  const navigate = useViewNavigate();
  // --scroll-p is set on the section and inherited by .hero-parallax inside it.
  const ref = useRef<HTMLElement>(null);
  useScrollParallax(ref);

  return (
    <section ref={ref} className="flex min-h-[86svh] items-center pt-[var(--nav-h)]">
      <Container className="hero-parallax">
        <SplitText
          as="h1"
          text={'Joanne Chen .'}
          emphasis="Chen"
          delay={160}
          className="mt-7 block max-w-[16ch] text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink"
        />

        <Reveal as="p" delay={260} className="mt-6 text-lg text-subtle">
          {'陳芷妍'}
        </Reveal>

        <Reveal as="p" delay={320} className="mt-6 max-w-[54ch] text-base leading-relaxed text-muted">
          A computer science student who enjoys exploring new knowledge and creating interesting stuff.
        </Reveal>

        <Reveal delay={400} className="mt-10 flex flex-wrap items-center gap-3">
          <Button onClick={() => navigate('/projects')}>View selected work</Button>
          <Button variant="ghost" href={CV_URL} external>
            View CV <span aria-hidden="true">↗</span>
          </Button>
          <Button variant="ghost" onClick={() => scrollToId('contact')}>
            Say hello
          </Button>
        </Reveal>
      </Container>
    </section>
  );
};

const About: React.FC = () => (
  <section id="about" className={section}>
    <Container>
      <div className="grid gap-10 md:grid-cols-[1fr_1.35fr] md:gap-16">
        {/*
          On a phone the copy leads and the portrait follows. Stacked, a
          full-width 4:5 portrait ate an entire screen before the section had
          said anything.
        */}
        <Reveal className="order-2 md:order-1">
          <div className="clip-reveal overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-soft">
            <Img
              src={imageUrl('images/profile.jpg')}
              alt="Joanne Chen"
              className="aspect-[4/3] w-full object-cover sm:aspect-[4/5]"
            />
          </div>
        </Reveal>

        <div className="order-1 flex flex-col gap-5 md:order-2">
          <Reveal as="p" className="label">
            About me
          </Reveal>
          <Reveal
            as="p"
            delay={80}
            className="text-[clamp(1.25rem,2.2vw,1.6rem)] font-medium leading-snug tracking-[-0.02em] text-ink"
          >
            Hi, I'm <span className="serif-accent">Joanne</span>.
          </Reveal>
          <Reveal as="p" delay={140} className="max-w-[58ch] text-base leading-relaxed text-muted">
            I'm a Computer Science student at National Tsing Hua University, with
            interests in AI and computer vision. In the future, I want to explore full-stack
            development and finance, broaden what I know, and see where those interests lead me.
          </Reveal>
          <Reveal as="p" delay={200} className="max-w-[58ch] text-base leading-relaxed text-muted">
            Outside of class, I enjoy music, photography, travel, and anime. I'm also looking
            forward to spending more time outdoors and trying new activities.
          </Reveal>
          <Reveal delay={260} className="mt-2 flex flex-wrap gap-2">
            <Tag>Computer Science</Tag>
            <Tag>Photography</Tag>
            <Tag>Music</Tag>
          </Reveal>
        </div>
      </div>
    </Container>
  </section>
);

const WorkPreview: React.FC = () => {
  const { projects } = useData();
  const selectedProjects = (projects.length ? projects.map(toProject) : fallbackProjects).slice(0, 4);

  return (
    <section id="work" className={section}>
      <Container>
        <SectionHeader
          label="Selected work"
          title={
            <>
              Academic and personal <span className="serif-accent">projects</span>.
            </>
          }
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {selectedProjects.map((project, index) => (
            <Reveal key={project.id} delay={index * 70}>
              <Card href={project.ghlink} className="h-full">
                <div className="clip-reveal aspect-[16/10] w-full overflow-hidden border-b border-line bg-surface-soft">
                  <Img
                    src={imageUrl(project.imgsrc)}
                    alt={project.imgalt}
                    className="h-full w-full scale-100 object-cover group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-col gap-3 p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="label">{project.type}</p>
                    <span className="label tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-ink">{project.title}</h3>

                  <p className="text-sm leading-relaxed text-muted">{project.description}</p>

                  {projectTags(project.tech).length ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {projectTags(project.tech).map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};

interface TimelineEntry {
  key: string;
  period: string;
  title: string;
  subtitle: string;
  body: string;
  aside?: string;
}

const Timeline: React.FC<{ entries: TimelineEntry[] }> = ({ entries }) => (
  <ol className="mt-10 border-t border-line">
    {entries.map((entry, index) => (
      <Reveal
        as="li"
        key={entry.key}
        delay={index * 70}
        className="grid gap-3 border-b border-line py-7 md:grid-cols-[11rem_1fr] md:gap-8"
      >
        <p className="label md:pt-1.5">{entry.period}</p>

        <div>
          <h3 className="text-lg font-semibold text-ink">{entry.title}</h3>
          <p className="mt-1 text-sm text-muted">{entry.subtitle}</p>
          <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">{entry.body}</p>
          {entry.aside ? <p className="mt-3 text-xs text-subtle">{entry.aside}</p> : null}
        </div>
      </Reveal>
    ))}
  </ol>
);

const Education: React.FC = () => (
  <section id="education" className={section}>
    <Container>
      <SectionHeader
        label="Education"
        title={
          <>
            Where the <span className="serif-accent">foundation</span> was built.
          </>
        }
      />
      <Timeline
        entries={educationData.map((item) => ({
          key: item.institution,
          period: item.year,
          title: item.institution,
          subtitle: item.degree,
          body: item.note,
          aside: item.focus,
        }))}
      />
    </Container>
  </section>
);

const BulletList: React.FC<{ points: string[] }> = ({ points }) => (
  <ul className="mt-4 flex max-w-[68ch] flex-col gap-2.5">
    {points.map((point) => (
      <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
        <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-line-strong" />
        <span>{point}</span>
      </li>
    ))}
  </ul>
);

const Research: React.FC = () => (
  <section id="research" className={section}>
    <Container>
      <SectionHeader
        label="Research"
        title={
          <>
            Publications and <span className="serif-accent">research</span>.
          </>
        }
      />
      <ol className="mt-10 border-t border-line">
        {researchData.map((item, index) => (
          <Reveal
            as="li"
            key={item.key}
            delay={index * 70}
            className="grid gap-3 border-b border-line py-8 md:grid-cols-[11rem_1fr] md:gap-8"
          >
            <p className="label md:pt-1.5">{item.period}</p>
            <div>
              <p className="label">{item.kind}</p>
              <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.subtitle}</p>
              {item.venue ? <p className="mt-1 text-xs text-subtle">{item.venue}</p> : null}
              {item.link ? (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-subtle underline-offset-4 transition-colors duration-[var(--dur)] hover:text-ink hover:underline"
                >
                  {item.link.label} ↗
                </a>
              ) : null}
              <BulletList points={item.points} />
            </div>
          </Reveal>
        ))}
      </ol>
    </Container>
  </section>
);

const Experience: React.FC = () => (
  <section id="experience" className={section}>
    <Container>
      <SectionHeader
        label="Experience"
        title={
          <>
            Where I've <span className="serif-accent">shipped</span> work.
          </>
        }
      />
      <ol className="mt-10 border-t border-line">
        {experienceData.map((item, index) => (
          <Reveal
            as="li"
            key={item.key}
            delay={index * 70}
            className="grid gap-3 border-b border-line py-8 md:grid-cols-[11rem_1fr] md:gap-8"
          >
            <p className="label md:pt-1.5">{item.period}</p>
            <div>
              <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.role}</p>
              <p className="mt-1 text-xs text-subtle">{item.location}</p>
              <BulletList points={item.points} />
            </div>
          </Reveal>
        ))}
      </ol>
    </Container>
  </section>
);

const Activities: React.FC = () => (
  <section id="activities" className={section}>
    <Container>
      <SectionHeader
          label="Activities"
          title={
            <>
              Student <span className="serif-accent">organizations</span> and activities.
            </>
          }
        />
      <Timeline
        entries={activitiesData.map((item) => ({
          key: item.title,
          period: item.period,
          title: item.title,
          subtitle: item.role,
          body: item.description,
        }))}
      />
    </Container>
  </section>
);

const Explore: React.FC = () => {
  const navigate = useViewNavigate();

  return (
    <section className={section}>
      <Container>
        <SectionHeader label="Elsewhere" title="Other ways through the site." />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {routeLinks.map((route, index) => (
            <Reveal key={route.path} delay={index * 70}>
              <Card onClick={() => navigate(route.path)} className="h-full">
                <div className="flex h-full flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-ink">{route.label}</h3>
                    <span
                      aria-hidden="true"
                      className="text-muted transition-[transform,color] duration-[var(--dur)] ease-[var(--ease-out-quint)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                    >
                      ↗
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{route.description}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};

const fieldClass =
  'w-full rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 text-sm text-ink ' +
  'placeholder:text-subtle transition-colors duration-[var(--dur)] hover:border-line-strong ' +
  'focus:border-line-strong';

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [submitStatus, setSubmitStatus] = useState('Send message');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const EMAILJS_PUBLIC_KEY = 's2wBA3kCBZmht7nni';
  const EMAILJS_SERVICE_ID = 'service_urorrpv';
  const EMAILJS_TEMPLATE_ID = 'template_f4oweup';

  useEffect(() => {
    if (window.emailjs) {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const sendEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.current || !window.emailjs) {
      setSubmitStatus('Email service unavailable');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('Sending');

    const templateParams = {
      name: (form.current.elements.namedItem('contact-name') as HTMLInputElement).value,
      email: (form.current.elements.namedItem('contact-email') as HTMLInputElement).value,
      message: (form.current.elements.namedItem('contact-message') as HTMLTextAreaElement).value,
    };

    window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        setSubmitStatus('Message sent');
        form.current?.reset();
        window.setTimeout(() => {
          setSubmitStatus('Send message');
          setIsSubmitting(false);
        }, 3000);
      }, (error: unknown) => {
        console.error('Email failed to send:', error);
        setSubmitStatus('Failed to send');
        window.setTimeout(() => {
          setSubmitStatus('Send message');
          setIsSubmitting(false);
        }, 3000);
      });
  };

  return (
    <section id="contact" className={section}>
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeader
              label="Contact"
              title={
                <>
                  Start with a{' '}
                  <span className="serif-accent">question</span>.
                </>
              }
            />

            <div className="mt-10 border-t border-line">
              {contactItems.map(({ Icon, label, value, href }, index) => {
                const content = (
                  <>
                    <Icon className="h-4 w-4 shrink-0 text-muted" />
                    <span className="flex flex-col">
                      <span className="label">{label}</span>
                      <span className="mt-1 text-sm text-ink">{value}</span>
                    </span>
                  </>
                );

                const shared = 'flex items-start gap-4 border-b border-line py-5';

                return (
                  <Reveal key={label} delay={index * 60}>
                    {href ? (
                      <a
                        href={href}
                        className={`${shared} transition-colors duration-[var(--dur)] hover:bg-[var(--hover-wash)]`}
                      >
                        {content}
                      </a>
                    ) : (
                      <div className={shared}>{content}</div>
                    )}
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={contactItems.length * 60} className="mt-8">
              <Button variant="ghost" href={CV_URL} external>
                View CV <span aria-hidden="true">↗</span>
              </Button>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <form
              ref={form}
              id="contact-form"
              onSubmit={sendEmail}
              className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-6 md:p-8"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className="label">
                  Name
                </label>
                <input
                  type="text"
                  name="contact-name"
                  id="contact-name"
                  placeholder="Your name"
                  required
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-email" className="label">
                  Email
                </label>
                <input
                  type="email"
                  name="contact-email"
                  id="contact-email"
                  placeholder="you@example.com"
                  required
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="label">
                  Message
                </label>
                <textarea
                  name="contact-message"
                  id="contact-message"
                  rows={5}
                  placeholder="What should we make clearer, smarter, or more alive?"
                  required
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
                {submitStatus}
              </Button>
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};

const Home = () => (
  <div className="min-h-screen bg-bg text-ink">
    <Navbar />
    {/* opaque and above the fixed footer, so it covers it until scrolled past */}
    <main className="relative z-10 bg-bg pb-16">
      <Hero />
      <About />
      <Research />
      <Experience />
      <WorkPreview />
      <Education />
      <Activities />
      <SkillMap />
      <Explore />
      <Contact />
    </main>
    <Footer />
  </div>
);

export default Home;
