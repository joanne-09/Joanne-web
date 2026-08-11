import type { Post, Project } from '@joanne-web/shared';

const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

export const shouldUseLocalPreview = (backendUrl: string) => {
  return Boolean(
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    localHosts.has(window.location.hostname) &&
    backendUrl.includes('joanne-web.vercel.app')
  );
};

export const localPreviewProjects: Project[] = [
  {
    id: 'lexiaid',
    ghlink: 'https://github.com/joanne-09',
    imgsrc: 'images/lexiaid.png',
    imgalt: 'LexiAid project preview',
    title: 'LexiAid',
    type: 'AI / Accessibility',
    description: 'A reading support tool shaped around language learning, recognition, and accessible interaction patterns.',
    role: 'Frontend, model integration, UI design',
    tech: ['React', 'TypeScript', 'AI'] as unknown as JSON,
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
    tech: ['Node', 'React', 'WebSocket'] as unknown as JSON,
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
    tech: ['JavaScript', 'Canvas', 'Game Design'] as unknown as JSON,
  },
];

export const localPreviewPosts: Post[] = [
  {
    id: 1,
    title: 'Building Interfaces With Rhythm',
    content: 'Notes on turning technical projects into interfaces that feel clear, legible, and quietly alive. The portfolio should reveal how I think through code, motion, and storytelling without making the reader work too hard.',
    created_at: '2026-05-28T12:00:00.000Z',
    tags: ['design', 'frontend'],
  },
  {
    id: 2,
    title: 'Computer Vision Project Notes',
    content: 'A compact writeup about model iteration, data quality, and small decisions that made the system more reliable.',
    created_at: '2026-04-18T12:00:00.000Z',
    tags: ['ai', 'research'],
  },
];
