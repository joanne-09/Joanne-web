import React from 'react';
// import { useNavigate } from 'react-router-dom';
import '../styles/Projects.css';
import type { Project } from '@joanne-web/shared';

import { Navbar, Footer } from './Essentials';

const projectsData: Project[] = [
  {
    id: 'chatroom',
    ghLink: 'https://github.com/joanne-09/SD_Chatroom',
    imgSrc: '/images/chatroom_project.png',
    imgAlt: 'Chatroom Project',
    title: 'Chatroom Project',
    type: 'Personal Project',
    description: 'Developed a real-time chat application using Firebase and Typescript.',
    role: 'Full Stack Developer - implemented both front-end and back-end functionalities.',
    tech: ['Typescript', 'React', 'HTML, CSS', 'Firebase'],
  },
  {
    id: 'fpga',
    ghLink: 'https://github.com/joanne-09/Slapjack-Project',
    imgSrc: '/images/FPGA_implementation.jpg',
    imgAlt: 'Slapjack FPGA Implementation',
    imgStyle: { objectPosition: '0 90%' },
    title: 'Slapjack FPGA Implementation',
    type: 'Group Project',
    description: 'Implemented a fully functional two-player Slapjack card game on dual FPGA boards with VGA display output, featuring real-time gameplay and interactive controls.',
    role: 'Lead Game Developer - Architected core game logic in Verilog, designed multi-level gameplay mechanics, developed UI elements through VGA, and engineered board-to-board communication protocols for multiplayer functionality.',
    tech: ['Verilog HDL', 'FPGA', 'VGA Interface', 'Digital Logic'],
  },
  {
    id: 'bird',
    ghLink: 'https://github.com/joanne-09/ML_diffusion',
    imgSrc: '/images/bird_sound.jpg',
    imgAlt: 'Bird Vocalization Generation',
    title: 'Bird Vocalization Generation',
    type: 'Group Project',
    description: 'Generate bird vocalizations using a diffusion model to simulate bird calls.',
    role: 'Innovative Idea Contributor - proposed the project idea and collaborated on the implementation.',
    tech: ['Python', 'PyTorch', 'Streamlit', 'Audio Processing'],
  },
  {
    id: 'mahjong',
    ghLink: 'https://github.com/joanne-09/Mahjong-Winner',
    imgSrc: '/images/mahjong_project.jpg',
    imgAlt: 'Mahjong Recognition and Analysis System',
    title: 'Mahjong Recognition and Analysis System',
    type: 'Personal Project',
    description: 'Train a customized YOLO model to recognize and analyze the winning hand of Mahjong tiles in real-time.',
    role: 'Sole Developer - designed, trained, and implemented the entire system.',
    tech: ['Python', 'NumPy', 'YOLO', 'Computer Vision'],
  },
  {
    id: 'greenfoot',
    ghLink: 'https://github.com/joanne-09/greenfootGameProject',
    imgSrc: '/images/greenfoot-project.png',
    imgAlt: 'Greenfoot Action-Adventure Game',
    title: 'Greenfoot Action-Adventure Game',
    type: 'Group Project',
    description: 'Develop an action-adventure game using Greenfoot and allows players to explore and to find out the story behind the game.',
    role: 'Game Developer - designed and implemented game mechanics and crucial story elements.',
    tech: ['Java', 'Greenfoot', 'Game Design', 'Puzzle Design'],
  },
];


const Projects: React.FC = () => {
    // const navigate = useNavigate();

    return (
      <div className="Projects">
        <Navbar theme='dark' />
          <main>
            <section id="projects">
              <div className="container">
                <div className="section-title">
                  <h2 style={{ color: 'var(--light)' }}>Projects</h2>
                  <div className="line"></div>
                </div>

                <div className="projects-container">
                  <div className="project-page active">
                    {projectsData.map((project) => (
                      <a href={project.ghLink} target="_blank" rel="noopener noreferrer" key={project.id}>
                        <div className="project-card">
                          <div className="project-image">
                            <img src={project.imgSrc} alt={project.imgAlt} style={project.imgStyle} />
                          </div>
                          <div className="project-content">
                            <h3 className="project-title">{project.title}</h3>
                            <span className="project-type">{project.type}</span>
                            <p className="project-description">{project.description}</p>
                            <p><strong>Role:</strong> {project.role}</p>
                            <div className="project-tech">
                              {project.tech.map((tag) => (
                                <span className="tech-tag" key={tag}>{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
        <Footer />
      </div>
    );
};

export default Projects;