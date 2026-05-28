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
    <div className="relative min-h-screen w-full bg-[#1a252f]">
      <Navbar />
      <main className="relative z-[3] min-h-screen bg-[var(--background)] pb-10 pt-20 text-[var(--text)]">
        <div className="mx-auto w-full max-w-[1200px] px-5">
          <h1 className="mb-10 pt-2.5 text-center font-serif text-4xl font-semibold text-[var(--primary)]">Projects</h1>

          <div>
            {error && <p className="rounded bg-[var(--background-dark)] p-4 text-[var(--accent-dark)] shadow-sm">{error}</p>}
            {!error && projects.length === 0 && <p>No projects found.</p>}
            {!error && projects.length > 0 && (
              <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <a href={project.ghlink} target="_blank" rel="noopener noreferrer" key={project.id}>
                    <div className="flex h-full flex-col overflow-hidden rounded-[10px] bg-[var(--background-dark)] shadow-[0_5px_15px_var(--shadow-color)] transition hover:-translate-y-2.5 hover:shadow-[0_15px_30px_var(--shadow-color)]">
                      <div className="h-[200px] shrink-0 bg-[var(--light)] bg-cover bg-center">
                        <img 
                          className="h-full w-full object-cover"
                          src={getImageUrl(project.imgsrc)} 
                          alt={project.imgalt} 
                          style={project.imgstyle} 
                          onError={(e) => {
                            console.error('Image failed to load:', getImageUrl(project.imgsrc));
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="flex grow flex-col p-[25px]">
                        <h3 className="mb-2.5 text-[22px] font-semibold text-[var(--primary)]">{project.title}</h3>
                        <span className="mb-[15px] self-start rounded-[15px] bg-[var(--accent)] px-2.5 py-[3px] text-xs text-white">{project.type}</span>
                        <p className="mb-[15px] grow text-[var(--text)]">{project.description}</p>
                        <p className="mb-2.5 text-sm text-[var(--accent-dark)]"><strong>Role:</strong> {project.role}</p>
                        <div className="mt-[15px] flex flex-wrap gap-2">
                          {(Array.isArray(project.tech) ? project.tech : []).map((tag) => (
                            <span className="rounded-[5px] bg-[var(--light)] px-2.5 py-[5px] text-xs text-[var(--thirdary)]" key={String(tag)}>{String(tag)}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
