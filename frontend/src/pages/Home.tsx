import React, { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { Navbar, Footer } from '../components/Essentials';
import { MailIcon, MapPinIcon, PhoneIcon } from '../components/Icons';
import SkillMap from '../components/SkillMap';

interface EducationItem {
  year: string;
  institution: string;
  degree: string;
  gpa?: string;
}

interface ActivityItem {
  title: string;
  period: string;
  role: string;
  description: string;
}

const containerClass = 'mx-auto w-full max-w-[1180px] px-5';
const sectionClass = 'w-full bg-[var(--background)] py-20 md:py-28';
const buttonClass = 'inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--text-light)] transition hover:-translate-y-1 hover:bg-[var(--accent)] hover:shadow-[var(--shadow-soft)] focus:outline-none focus:shadow-[var(--focus-ring)]';

const contactItems = [
  { Icon: MailIcon, label: 'Email', value: 'joanne.zh2015@gmail.com' },
  { Icon: PhoneIcon, label: 'Phone', value: '+886 905-937-165' },
  { Icon: MapPinIcon, label: 'Location', value: 'Hsinchu, Taiwan' },
];

const SectionMarker: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <h2 className="font-serif text-4xl font-semibold leading-tight text-[var(--section-heading)] md:text-5xl">{label}</h2>
    <div className="mt-5 flex w-36 items-center gap-2">
      <span className="h-[6px] w-12 rounded-full bg-[var(--section-rule)]"></span>
      <span className="h-px flex-1 bg-[var(--section-rule-soft)]"></span>
    </div>
  </div>
);

const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--background)] pt-20">
      <div className={`${containerClass} grid min-h-[88svh] items-center gap-12 py-14 md:grid-cols-[minmax(0,0.98fr)_minmax(320px,0.82fr)] md:py-20`}>
        <div className="min-w-0">
          <p className="mb-5 text-sm font-semibold uppercase text-[var(--accent)]">Portfolio / Computer Science</p>
          <h1 className="max-w-[760px] font-serif text-[clamp(3.4rem,14vw,5.2rem)] font-semibold leading-[1.02] text-[var(--primary)] md:text-[clamp(4.8rem,6vw,7rem)]">
            <span className="block">&#x9673;&#x82B7;&#x598D;</span>
            <span className="block">Joanne Chen</span>
          </h1>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#contact" className={buttonClass}>Get In Touch</a>
          </div>
        </div>

        <div className="hidden min-w-0 md:block">
          <div className="relative ml-auto aspect-[4/3] max-h-[560px] w-full overflow-hidden rounded-[4px]">
            <img
              className="h-full w-full object-cover object-center opacity-90 saturate-[0.86]"
              src={`${import.meta.env.BASE_URL}images/profile.jpg`}
              alt="Joanne Chen portrait"
            />
            <div className="absolute inset-0 bg-[var(--image-scrim)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  return (
    <section id="about" className={sectionClass}>
      <div className={containerClass}>
        <div className="grid gap-10 md:grid-cols-[260px_1fr] md:items-start">
          <SectionMarker label="About" />
          <div className="max-w-[840px] space-y-6 text-lg leading-8 text-[var(--text)] md:text-xl md:leading-9">
            <p>I am an undergraduate Computer Science student at National Tsing Hua University.</p>
            <p>My technical interests span machine learning, computer vision, and software development. I enjoy building projects that stretch my boundaries and sharpen my instincts for useful, resilient systems.</p>
            <p>Outside of code, music, film, and Japanese animation keep my sense of rhythm and storytelling alive. Those influences often find their way back into how I think about interfaces and technical work.</p>
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
    <section id="education" className={sectionClass}>
      <div className={containerClass}>
        <div className="grid gap-10 md:grid-cols-[260px_1fr]">
          <SectionMarker label="Education" />
          <div className="border-t border-[var(--border)]">
            {educationData.map((edu) => (
              <div className="grid gap-4 border-b border-[var(--border)] py-8 md:grid-cols-[180px_1fr]" key={`${edu.year}-${edu.institution}`}>
                <p className="text-sm font-semibold text-[var(--accent)]">{edu.year}</p>
                <div>
                  <h3 className="text-2xl font-semibold text-[var(--primary)]">{edu.institution}</h3>
                  {edu.gpa && <p className="mt-2 text-[var(--text-muted)]">{edu.gpa}</p>}
                  <p className="mt-2 text-lg text-[var(--text-muted)]">{edu.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const activitiesData: ActivityItem[] = [
  {
    title: 'NTHU Blockchain Club x NTHU GDSC',
    period: '2024 - Present',
    role: 'Activities Department',
    description: 'Lead the planning and execution of technical workshops and networking events with industry professionals. Develop timelines and coordinate teams for club activities focused on blockchain technology and software development.',
  },
  {
    title: 'NYCU Google Developer Student Club',
    period: '2025 - Present',
    role: 'Public Relations and Activities Department',
    description: 'Build relationships with industry professionals and potential speakers for technical workshops. Collaborate with lecturers on curriculum and improve club visibility through strategic content.',
  },
  {
    title: 'NTHU Pop Dance Club',
    period: '2023 - 2024',
    role: 'Member',
    description: 'Participated in intensive hip-hop dance training and semester showcases, developing teamwork, discipline, and performance confidence through collaborative artistic work.',
  },
];

const Activities: React.FC = () => {
  return (
    <section id="activities" className="w-full bg-[var(--surface-soft)] py-20 md:py-28">
      <div className={containerClass}>
        <div className="grid gap-10 md:grid-cols-[260px_1fr]">
          <SectionMarker label="Experience" />
          <div className="border-t border-[var(--border-strong)]">
            {activitiesData.map((activity, index) => (
              <article className="grid gap-5 border-b border-[var(--border-strong)] py-8 md:grid-cols-[88px_1fr_180px]" key={activity.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-[var(--text-light)]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[var(--primary)]">{activity.title}</h3>
                  <p className="mt-3 max-w-[720px] leading-7 text-[var(--text)]">{activity.description}</p>
                </div>
                <div className="text-sm leading-6 text-[var(--text-muted)] md:text-right">
                  <p className="font-semibold text-[var(--primary)]">{activity.period}</p>
                  <p>{activity.role}</p>
                </div>
              </article>
            ))}
          </div>
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

  const inputClass = 'block w-full rounded-[4px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:shadow-[var(--focus-ring)]';

  return (
    <section id="contact" className="w-full bg-[var(--background)] py-20 md:py-28">
      <div className={containerClass}>
        <div className="grid gap-12 md:grid-cols-[0.78fr_1.22fr]">
          <div>
            <SectionMarker label="Contact" />
            <div className="mt-10 space-y-6">
              {contactItems.map(({ Icon, label, value }) => (
                <div className="flex items-start gap-4" key={label}>
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold uppercase text-[var(--text-muted)]">{label}</h4>
                    {label === 'Email' ? (
                      <p className="mt-1 text-lg text-[var(--primary)]"><a href={`mailto:${value}`} className="hover:text-[var(--accent)]">{value}</a></p>
                    ) : (
                      <p className="mt-1 text-lg text-[var(--primary)]">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form ref={form} id="contact-form" onSubmit={sendEmail} className="flex flex-col gap-4 border-t border-[var(--border)] pt-2 md:border-l md:border-t-0 md:pl-12">
            <input className={inputClass} type="text" name="contact-name" id="contact-name" placeholder="Your Name" required />
            <input className={inputClass} type="email" name="contact-email" id="contact-email" placeholder="Your Email" required />
            <textarea className={`${inputClass} min-h-[170px] resize-y`} name="contact-message" id="contact-message" placeholder="Your Message" required></textarea>
            <button type="submit" className={`${buttonClass} mt-4 self-start`} disabled={isSubmitting}>
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
    <div className="relative isolate min-h-screen w-full bg-[var(--footer-background)] font-sans text-[var(--text)]">
      <Navbar />
      <main className="relative z-[2] overflow-hidden bg-[var(--background)] shadow-[var(--page-shadow)]">
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
