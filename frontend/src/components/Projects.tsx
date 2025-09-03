import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import '../styles/Projects.css';
import type { Project } from '@joanne-web/shared';

import { Navbar, Footer } from './Essentials';
import Loading from './Loading';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const Projects: React.FC = () => {
    // const navigate = useNavigate();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/projects`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setProjects(data);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setError('Failed to fetch projects');
        } finally {
          setLoading(false);
        }
      };

      fetchProjects();
    }, []);

    // const handleProjectClick = (postId: string) => {
    //   navigate(`/projects/${postId}`);
    // };

    return (
      <div className="Projects">
        <Navbar />
          <main>
            <section id="projects">
              <div className="container">
                <div className="section-title">
                  <h2>Projects</h2>
                  <div className="line"></div>
                </div>

                <div className="projects-container">
                  {loading && <Loading />}
                  {error && <p className="error">{error}</p>}
                  {!loading && !error && projects.length === 0 && <p>No projects found.</p>}
                  {!loading && !error && projects.length > 0 && (
                    <div className="project-grid">
                      {projects.map((project) => (
                        <a href={project.ghLink} target="_blank" rel="noopener noreferrer" key={project.id}>
                          <div className="project-card">
                            <div className="project-image">
                              <img 
                                src={project.imgsrc} 
                                alt={project.imgalt} 
                                style={project.imgstyle} 
                                onError={(e) => {
                                  console.error('Image failed to load:', project.imgsrc);
                                  e.currentTarget.style.display = 'none';
                                }}
                                onLoad={() => console.log('Image loaded successfully:', project.imgsrc)}
                              />
                            </div>
                            <div className="project-content">
                              <h3 className="project-title">{project.title}</h3>
                              <span className="project-type">{project.type}</span>
                              <p className="project-description">{project.description}</p>
                              <p><strong>Role:</strong> {project.role}</p>
                              <div className="project-tech">
                                {(Array.isArray(project.tech) ? project.tech : []).map((tag) => (
                                  <span className="tech-tag" key={tag}>{tag}</span>
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
            </section>
          </main>
        <Footer />
      </div>
    );
};

export default Projects;