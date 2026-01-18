import React, { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import '../styles/Home.css';

import { Navbar, Footer } from '../components/Essentials';

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
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default Home;