import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Project, Post } from '@joanne-web/shared';

interface DataContextType {
  projects: Project[];
  articles: Post[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsRes, articlesRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/projects`),
        fetch(`${BACKEND_URL}/api/posts`)
      ]);

      if (!projectsRes.ok) throw new Error(`Projects fetch failed: ${projectsRes.statusText}`);
      if (!articlesRes.ok) throw new Error(`Articles fetch failed: ${articlesRes.statusText}`);

      const projectsData = await projectsRes.json();
      const articlesData = await articlesRes.json();

      setProjects(projectsData);
      setArticles(articlesData);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ projects, articles, loading, error, refreshData: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
