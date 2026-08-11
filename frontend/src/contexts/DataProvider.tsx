import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Post, Project } from '@joanne-web/shared';
import { localPreviewPosts, localPreviewProjects, shouldUseLocalPreview } from '../data/localPreview';
import { DataContext } from './dataContextCore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:3001';

const shouldFallbackToPreviewData = () => {
  if (import.meta.env.DEV) return true;
  if (typeof window === 'undefined') return false;

  return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) ||
    window.location.hostname.endsWith('github.io');
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    if (shouldUseLocalPreview(BACKEND_URL)) {
      setProjects(localPreviewProjects);
      setArticles(localPreviewPosts);
      setLoading(false);
      return;
    }

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
    } catch (err: unknown) {
      if (shouldFallbackToPreviewData()) {
        setProjects(localPreviewProjects);
        setArticles(localPreviewPosts);
        setError(null);
        return;
      }

      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
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
