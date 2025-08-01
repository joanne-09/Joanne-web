import React, { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import '../styles/Home.css';

import { Navbar, Footer } from './Essentials';

// Data Interfaces
interface EducationItem {
  year: string;
  institution: string;
  degree: string;
  gpa?: string;
}

interface ActivityItem {
  iconClass: string;
  title: string;
  period: string;
  role: string;
  description: string;
}

interface Skill {
  name: string;
  level: number; // 0-5
}

interface SkillCategory {
  categoryName: string;
  skills: Skill[];
}

interface Project {
  id: string;
  ghLink: string;
  imgSrc: string;
  imgAlt: string;
  imgStyle?: React.CSSProperties;
  title: string;
  type: string;
  description: string;
  role: string;
  tech: string[];
}

// --- Components ---
const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>陳芷妍 Joanne Chen</h1>
          <h3>Computer Science Student</h3>
          <a href="#contact" className="btn">Get In Touch</a>
        </div>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  return (
    <section id="about">
      <div className="container">
        <div className="section-title">
          <h2>About Me</h2>
          <div className="line"></div>
        </div>
        <div className="about-content">
          <div className="about-text">
            <p>I am an undergraduated Computer Science student at National Tsing Hua University.</p>
            <br />
            <p>My technical interests span machine learning, computer vision, and software development. I enjoy building projects that push my boundaries and expand my skill set. Whether working independently or in collaborative teams, I bring creativity, dedication, and a growth mindset to every endeavor.</p>
            <br />
            <p>In my free time, I enjoy listening to music , watching thought-provoking films, and exploring the storytelling art of Japanese animation. I find these creative outlets provide fresh perspectives that often inspire my technical work in unexpected ways.</p>
          </div>
          <div className="about-image">
            <div className="profile-placeholder" style={{ backgroundImage: "url('/images/profile.jpg')" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const educationData: EducationItem[] = [
  {
    year: '2023 - Present',
    institution: 'National Tsing Hua University (NTHU)',
    degree: 'B.S. in Computer Science',
    gpa: 'GPA: 4.08/4.30 (Top 10%)',
  },
  {
    year: '2020 - 2023',
    institution: 'National Experimental High School in Hsinchu (NEHS)',
    degree: 'Normal Program',
  },
];

const Education: React.FC = () => {
  return (
    <section id="education">
      <div className="container">
        <div className="section-title">
          <h2>Education</h2>
          <div className="line"></div>
        </div>
        <div className="timeline">
          {educationData.map((edu, index) => (
            <div className="timeline-item" key={index}>
              <div className="timeline-dot"></div>
              <div className="timeline-date">{edu.year}</div>
              <div className="timeline-content">
                <h3>{edu.institution}</h3>
                {edu.gpa && <p className="timeline-degree">{edu.gpa}</p>}
                <p className="timeline-degree">{edu.degree}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const activitiesData: ActivityItem[] = [
  {
    iconClass: 'fas fa-laptop-code',
    title: 'NTHU Blockchain Club x NTHU GDSC',
    period: '2024 - Present',
    role: 'Activities Department',
    description: 'Lead the planning and execution of technical workshops and networking events with industry professionals. Develop comprehensive timelines and coordinate cross-functional teams to ensure successful delivery of club activities focused on blockchain technology and software development.',
  },
  {
    iconClass: 'fas fa-project-diagram',
    title: 'NYCU Google Developer Student Club',
    period: '2025 - Present',
    role: 'Public Relations and Activities Department',
    description: 'Establish and maintain relationships with industry professionals and potential speakers for technical workshops and seminars. Collaborate with lecturers to develop curriculum that meets various proficiency levels. Enhance club visibility through strategic content creation and engagement on professional networking platforms.',
  },
  {
    iconClass: 'fas fa-trophy',
    title: 'NTHU Pop Dance Club',
    period: '2023 - 2024',
    role: 'Member',
    description: 'Participated in intensive hip-hop dance training, developing strong teamwork skills and performance confidence. Successfully performed in the semester showcase, demonstrating commitment to collaborative artistic projects.',
  },
];

const Activities: React.FC = () => {
  return (
    <section id="activities">
      <div className="container">
        <div className="section-title">
          <h2>Experience & Extracurricular</h2>
          <div className="line"></div>
        </div>
        <div className="activities-container">
          {activitiesData.map((activity, index) => (
            <div className="activity-card" key={index}>
              <div className="activity-icon">
                <i className={activity.iconClass}></i>
              </div>
              <div className="activity-content">
                <h3>{activity.title}</h3>
                <div className="activity-period">{activity.period}</div>
                <div className="activity-role">{activity.role}</div>
                <p className="activity-description">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const skillsData: SkillCategory[] = [
  {
    categoryName: 'Programming Languages',
    skills: [
      { name: 'C/C++', level: 5 },
      { name: 'Python', level: 5 },
      { name: 'Verilog', level: 4 },
      { name: 'TypeScript', level: 4 },
      { name: 'JavaScript', level: 3 },
    ],
  },
  {
    categoryName: 'Web Development',
    skills: [
      { name: 'HTML', level: 4 },
      { name: 'CSS', level: 4 },
    ],
  },
  {
    categoryName: 'Tools & Platforms',
    skills: [
      { name: 'Git', level: 5 },
      { name: 'VS Code', level: 5 },
    ],
  },
];

const Skills: React.FC = () => {
  return (
    <section id="skills">
      <div className="container">
        <div className="section-title">
          <h2>Technical Skills</h2>
          <div className="line"></div>
        </div>
        <div className="skills-container">
          {skillsData.map((category) => (
            <div className="skill-category" key={category.categoryName}>
              <h3>{category.categoryName}</h3>
              {category.skills.map((skill) => (
                <div className="skill-item" key={skill.name}>
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-level">
                    {[...Array(5)].map((_, i) => (
                      <span className={`dot ${i < skill.level ? 'filled' : ''}`} key={i}></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3; // Number of projects per page
  const totalPages = Math.ceil(projectsData.length / projectsPerPage);

  const showPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const currentProjects = projectsData.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  return (
    <section id="projects">
      <div className="container">
        <div className="section-title">
          <h2>Projects</h2>
          <div className="line"></div>
        </div>

        <div className="projects-container">
          {/* The .project-page div will act as the grid container for current projects */}
          <div className={`project-page ${currentProjects.length > 0 ? 'active' : ''}`}>
            {currentProjects.map((project) => (
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

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="pagination-btn prev-btn"
              onClick={() => showPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => showPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pagination-btn next-btn"
              onClick={() => showPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [submitStatus, setSubmitStatus] = useState('Send Message');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // EmailJS Public Key, Service ID, Template ID
  const EMAILJS_PUBLIC_KEY = "s2wBA3kCBZmht7nni";
  const EMAILJS_SERVICE_ID = "service_urorrpv";
  const EMAILJS_TEMPLATE_ID = "template_f4oweup";


  useEffect(() => {
    if (window.emailjs) {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current || !window.emailjs) {
      setSubmitStatus("EmailJS not loaded");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('Sending...');

    const templateParams = {
      name: (form.current.elements.namedItem('contact-name') as HTMLInputElement).value,
      email: (form.current.elements.namedItem('contact-email') as HTMLInputElement).value,
      message: (form.current.elements.namedItem('contact-message') as HTMLTextAreaElement).value,
    };

    window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        setSubmitStatus("Message Sent!");
        form.current?.reset();
        setTimeout(() => {
          setSubmitStatus("Send Message");
          setIsSubmitting(false);
        }, 3000);
      }, (error: any) => {
        console.error('Email failed to send:', error);
        setSubmitStatus("Failed to send");
        setTimeout(() => {
          setSubmitStatus("Send Message");
          setIsSubmitting(false);
        }, 3000);
      });
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="section-title">
          <h2>Get In Touch</h2>
          <div className="line"></div>
        </div>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <div className="contact-text">
                <h4>Email</h4>
                <p><a href="mailto:joanne.zh2015@gmail.com">joanne.zh2015@gmail.com</a></p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <div className="contact-text">
                <h4>Phone</h4>
                <p>+886 905-937-165</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <div className="contact-text">
                <h4>Location</h4>
                <p>Hsinchu, Taiwan</p>
              </div>
            </div>
          </div>
          <form ref={form} id="contact-form" className="contact-form" onSubmit={sendEmail}>
            <input type="text" name="contact-name" id="contact-name" placeholder="Your Name" required />
            <input type="email" name="contact-email" id="contact-email" placeholder="Your Email" required />
            <textarea name="contact-message" id="contact-message" placeholder="Your Message" required></textarea>
            <button type="submit" className="btn" disabled={isSubmitting}>
              {submitStatus}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// --- Main App Component ---
const Home = () => {
  return (
    <div className='Home'>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Education />
        <Activities />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default Home;