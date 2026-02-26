import React from 'react';
// import { useNavigate } from 'react-router-dom';
import '../styles/Projects.css';
import { useData } from '../contexts/DataContext';
import LoadingPage from './LoadingPage';

import { Navbar, Footer } from '../components/Essentials';

const Projects: React.FC = () => {
    // const navigate = useNavigate();
    const { projects, error, loading } = useData();

    if (loading) {
      return <LoadingPage />;
    }

    // const handleProjectClick = (postId: string) => {
    //   navigate(`/projects/${postId}`);
    // }; 

    const getImageUrl = (path: string) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      return `${import.meta.env.BASE_URL}${cleanPath}`;
    };

    return (
      <div className="Projects">
        <Navbar />
          <main>
            <div className="container">
              <h1 className="page-title">Projects</h1>

              <div className="projects-container">
                {error && <p className="error">{error}</p>}
                {!error && projects.length === 0 && <p>No projects found.</p>}
                {!error && projects.length > 0 && (
                  <div className="project-grid">
                    {projects.map((project) => (
                      <a href={project.ghLink} target="_blank" rel="noopener noreferrer" key={project.id}>
                        <div className="project-card">
                          <div className="project-image">
                            <img 
                              src={getImageUrl(project.imgsrc)} 
                              alt={project.imgalt} 
                              style={project.imgstyle} 
                              onError={(e) => {
                                console.error('Image failed to load:', getImageUrl(project.imgsrc));
                                e.currentTarget.style.display = 'none';
                              }}
                              onLoad={() => console.log('Image loaded successfully:', getImageUrl(project.imgsrc))}
                            />
                          </div>
                          <div className="project-content">
                            <h3 className="project-title">{project.title}</h3>
                            <span className="project-type">{project.type}</span>
                            <p className="project-description">{project.description}</p>
                            <p className="project-role"><strong>Role:</strong> {project.role}</p>
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
          </main>
        <Footer />
      </div>
    );
};

export default Projects;