import React, { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { Navbar, Footer } from '../components/Essentials';
import SkillMap from '../components/SkillMap';

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

const containerClass = 'mx-auto w-full max-w-[1200px] px-5';
const buttonClass = 'inline-block rounded-[5px] border-0 bg-[var(--accent)] px-[30px] py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-[var(--accent-dark)] hover:text-white hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]';

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="mb-[60px] text-center">
    <h2 className="mb-[15px] font-serif text-4xl font-semibold text-[var(--primary)]">{title}</h2>
    <div className="mx-auto h-[3px] w-20 bg-[var(--accent)]"></div>
  </div>
);

const Hero: React.FC = () => {
  return (
    <section className="flex h-screen w-full items-center justify-center bg-[var(--background)] pt-[60px] text-center">
      <div className={containerClass}>
        <div className="max-w-full">
          <h1 className="mb-5 font-serif text-4xl font-semibold text-[var(--primary)] sm:text-5xl">&#x9673;&#x82B7;&#x598D; Joanne Chen</h1>
          <h3 className="mb-[30px] text-xl font-light text-[var(--text)] sm:text-2xl">Computer Science Student</h3>
          <a href="#contact" className={buttonClass}>Get In Touch</a>
        </div>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  return (
    <section id="about" className="w-full bg-[var(--background-dark)] py-20">
      <div className={containerClass}>
        <SectionTitle title="About Me" />
        <div className="flex flex-col-reverse items-center justify-between gap-[50px] md:flex-row">
          <div className="flex-1 text-[var(--text)]">
            <p>I am an undergraduated Computer Science student at National Tsing Hua University.</p>
            <br />
            <p>My technical interests span machine learning, computer vision, and software development. I enjoy building projects that push my boundaries and expand my skill set. Whether working independently or in collaborative teams, I bring creativity, dedication, and a growth mindset to every endeavor.</p>
            <br />
            <p>In my free time, I enjoy listening to music , watching thought-provoking films, and exploring the storytelling art of Japanese animation. I find these creative outlets provide fresh perspectives that often inspire my technical work in unexpected ways.</p>
          </div>
          <div className="flex-1 text-center">
            <div
              className="inline-block h-[300px] w-[300px] rounded-full border-[5px] border-[var(--border)] bg-[var(--light)] bg-cover bg-center"
              style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/profile.jpg')` }}
            ></div>
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
    <section id="education" className="w-full bg-[var(--background-dark)] py-20">
      <div className={containerClass}>
        <SectionTitle title="Education" />
        <div className="relative mx-auto max-w-[800px] py-5 before:absolute before:bottom-0 before:left-5 before:top-0 before:w-1 before:bg-[var(--thirdary)] before:opacity-30 md:before:left-[30px]">
          {educationData.map((edu, index) => (
            <div className="relative mb-[50px] pl-[50px] md:pl-20" key={index}>
              <div className="absolute left-2.5 top-0 z-[1] h-6 w-6 rounded-full bg-[var(--secondary)] md:left-5"></div>
              <div className="absolute left-[50px] top-0 ml-2.5 text-base font-semibold text-[var(--accent)] md:left-20">{edu.year}</div>
              <div className="mt-[30px] rounded-[10px] bg-[var(--background)] p-[30px] shadow-[0_3px_15px_rgba(0,0,0,0.05)]">
                <h3 className="mb-2.5 text-xl font-semibold text-[var(--primary)]">{edu.institution}</h3>
                {edu.gpa && <p className="mb-2 text-[17px] text-[var(--secondary)]">{edu.gpa}</p>}
                <p className="mb-2 text-[17px] text-[var(--secondary)]">{edu.degree}</p>
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
    <section id="activities" className="w-full bg-[var(--background)] py-20">
      <div className={containerClass}>
        <SectionTitle title="Experience & Extracurricular" />
        <div className="mx-auto flex max-w-[800px] flex-col gap-[30px]">
          {activitiesData.map((activity, index) => (
            <div className="flex flex-col overflow-hidden rounded-[10px] bg-[var(--background)] shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] md:flex-row" key={index}>
              <div className="flex h-[60px] w-full items-center justify-center bg-[var(--accent)] text-[28px] text-white md:h-auto md:w-20">
                <i className={activity.iconClass}></i>
              </div>
              <div className="flex-1 p-[25px]">
                <h3 className="mb-2.5 text-xl font-semibold text-[var(--primary)]">{activity.title}</h3>
                <div className="mb-[5px] text-sm font-semibold text-[var(--accent)]">{activity.period}</div>
                <div className="mb-3 text-base font-medium text-[var(--secondary)]">{activity.role}</div>
                <p className="mb-[15px] text-[var(--text)]">{activity.description}</p>
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
      }, (error: unknown) => {
        console.error('Email failed to send:', error);
        setSubmitStatus("Failed to send");
        setTimeout(() => {
          setSubmitStatus("Send Message");
          setIsSubmitting(false);
        }, 3000);
      });
  };

  const inputClass = 'mb-[15px] w-full rounded-[5px] border border-[var(--border)] bg-[var(--background)] p-3 text-[var(--text)] outline-none focus:border-[var(--primary)]';

  return (
    <section id="contact" className="w-full bg-[var(--background-dark)] py-20">
      <div className={containerClass}>
        <SectionTitle title="Get In Touch" />
        <div className="grid gap-[50px] md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          <div className="flex flex-col gap-5">
            {[
              ['fas fa-envelope', 'Email', 'joanne.zh2015@gmail.com'],
              ['fas fa-phone', 'Phone', '+886 905-937-165'],
              ['fas fa-map-marker-alt', 'Location', 'Hsinchu, Taiwan'],
            ].map(([icon, label, value]) => (
              <div className="flex items-center" key={label}>
                <span className="mr-[15px] flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                  <i className={icon}></i>
                </span>
                <div>
                  <h4 className="mb-[5px] text-lg font-semibold text-[var(--primary)]">{label}</h4>
                  {label === 'Email' ? (
                    <p><a href={`mailto:${value}`} className="hover:text-[var(--accent)]">{value}</a></p>
                  ) : (
                    <p>{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form ref={form} id="contact-form" onSubmit={sendEmail}>
            <input className={inputClass} type="text" name="contact-name" id="contact-name" placeholder="Your Name" required />
            <input className={inputClass} type="email" name="contact-email" id="contact-email" placeholder="Your Email" required />
            <textarea className={`${inputClass} h-[150px] resize-y`} name="contact-message" id="contact-message" placeholder="Your Message" required></textarea>
            <button type="submit" className={buttonClass} disabled={isSubmitting}>
              {submitStatus}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#1a252f] font-sans text-[var(--text)]">
      <Navbar />
      <main className="relative z-[3] bg-[var(--background)]">
        <Hero />
        <About />
        <SkillMap />
        <Education />
        <Activities />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
