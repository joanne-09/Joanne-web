export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  tags: string[];
}

export interface Project {
  id: string;
  ghlink: string;
  imgsrc: string;
  imgalt: string;
  imgstyle?: { [key: string]: any };
  title: string;
  type: string;
  description: string;
  role: string;
  tech: JSON;
}