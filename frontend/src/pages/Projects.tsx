import React from 'react';
import { useData } from '../contexts/DataContext';
import LoadingPage from './LoadingPage';
import { Navbar, Footer } from '../components/Essentials';

const Projects: React.FC = () => {
  const { projects, error, loading } = useData();

  if (loading) {
    return <LoadingPage />;
  }

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${import.meta.env.BASE_URL}${cleanPath}`;
  };

  return (
    <div className="relative isolate min-h-screen w-full bg-[var(--footer-background)]">
      <Navbar />
      <main className="relative z-[2] min-h-screen bg-[var(--background)] px-5 pb-20 pt-28 text-[var(--text)] shadow-[var(--page-shadow)] md:pt-36">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mb-14 grid gap-6 md:grid-cols-[0.72fr_1fr] md:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase text-[var(--accent)]">Selected Work</p>
              <h1 className="font-serif text-5xl font-semibold leading-tight text-[var(--primary)] md:text-7xl">Projects</h1>
            </div>
          </div>

          {error && <p className="border border-[var(--tag-border)] bg-[var(--tag-background)] p-4 text-[var(--accent-dark)]">{error}</p>}
          {!error && projects.length === 0 && <p className="text-[var(--text-muted)]">No projects found.</p>}
          {!error && projects.length > 0 && (
            <div className="border-t border-[var(--border-strong)]">
              {projects.map((project, index) => (
                <a
                  className="group grid gap-6 border-b border-[var(--border-strong)] py-8 transition hover:bg-[var(--button-hover-background)] md:grid-cols-[minmax(240px,360px)_1fr_60px] md:px-5"
                  href={project.ghlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={project.id}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[var(--surface-soft)]">
                    <img
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      src={getImageUrl(project.imgsrc)}
                      alt={project.imgalt}
                      style={project.imgstyle}
                      onError={(e) => {
                        console.error('Image failed to load:', getImageUrl(project.imgsrc));
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-6">
                    <div>
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
                        <span className="rounded-full border border-[var(--tag-border)] bg-[var(--tag-background)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">{project.type}</span>
                      </div>
                      <h2 className="text-3xl font-semibold leading-tight text-[var(--primary)] transition group-hover:text-[var(--accent)]">{project.title}</h2>
                      <p className="mt-4 max-w-[720px] leading-7 text-[var(--text)]">{project.description}</p>
                      <p className="mt-4 text-sm text-[var(--text-muted)]"><strong className="text-[var(--primary)]">Role:</strong> {project.role}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(project.tech) ? project.tech : []).map((tag) => (
                        <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs text-[var(--text-muted)]" key={String(tag)}>{String(tag)}</span>
                      ))}
                    </div>
                  </div>

                  <div className="hidden items-start justify-end text-[var(--accent)] md:flex">
                    <span className="text-2xl transition group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true">↗</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
