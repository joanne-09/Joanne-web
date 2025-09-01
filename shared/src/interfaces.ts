export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface Project {
  id: string;
  ghLink: string;
  imgSrc: string;
  imgAlt: string;
  imgStyle?: React.CSSProperties;
  title: string;
  type: string;
  description: string;
  role: string;
  tech: string[];
}