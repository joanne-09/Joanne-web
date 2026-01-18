import React from 'react';
// import { useNavigate } from 'react-router-dom';
import '../styles/Projects.css';
import { useData } from '../contexts/DataContext';

import { Navbar, Footer } from '../components/Essentials';

const Projects: React.FC = () => {
    // const navigate = useNavigate();
    const { projects, error } = useData();

    // const handleProjectClick = (postId: string) => {
    //   navigate(`/projects/${postId}`);
    // };

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