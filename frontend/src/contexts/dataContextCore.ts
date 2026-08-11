import { createContext } from 'react';
import type { Post, Project } from '@joanne-web/shared';

export interface DataContextType {
  projects: Project[];
  articles: Post[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);
