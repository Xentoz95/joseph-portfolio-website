'use client';

import Image from 'next/image';
import { FadeIn } from './FadeIn';

export function Skills() {
  const skillCategories = [
    {
      name: 'Web Development',
      skills: [
        'HTML5 & CSS3',
        'JavaScript & TypeScript',
        'React & Next.js',
        'Responsive Design',
        'Tailwind CSS',
      ],
    },
    {
      name: 'UI/UX Design',
      skills: [
        'User Interface Design',
        'User Experience Design',
        'Figma Prototyping',
        'Design Systems',
        'Accessibility (WCAG)',
      ],
    },
    {
      name: 'Systems & Data',
      skills: [
        'Microsoft Access',
        'Database Design',
        'Excel Dashboards',
        'Data Tracking Tools',
        'Form & Report Building',
      ],
    },
    {
      name: 'Digital & Creative',
      skills: [
        'Graphic Design',
        'Visual Branding',
        'Video Editing',
        'Content Creation',
        'Presentation Design',
      ],
    },
    {
      name: 'Business Tools',
      skills: [
        'Process Automation',
        'Dashboard Solutions',
        'Reporting Systems',
        'Productivity Tools',
        'Workflow Optimization',
      ],
    },
    {
      name: 'Soft Skills',
      skills: [
        'Problem Solving',
        'Communication',
        'Project Management',
        'Collaboration',
        'Creative Thinking',
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Brand Watermark Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/brand/4.png"
          alt=""
          fill
          className="object-cover opacity-[0.05] grayscale"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-6 mb-16">
          <FadeIn delay={100} className="text-primary font-semibold text-lg tracking-wide">
            What I Bring to the Table
          </FadeIn>
          <FadeIn delay={150} className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
            Skills & Expertise
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {skillCategories.map((category, i) => (
            <FadeIn
              key={i}
              delay={i * 100}
              className="group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <h3 className="text-2xl font-bold text-primary mb-6 group-hover:text-primary transition">{category.name}</h3>
              <ul className="space-y-4">
                {category.skills.map((skill, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-primary/60 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-foreground/90 group-hover:text-foreground transition">{skill}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="bg-card rounded-3xl p-10 sm:p-12 border border-border/50">
          <FadeIn delay={300} className="text-3xl font-bold text-foreground mb-10">
            Tech Stack
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'React',
              'Next.js',
              'TypeScript',
              'Tailwind',
              'JavaScript',
              'Figma',
              'Microsoft Access',
              'Excel VBA',
              'HTML5',
              'CSS3',
              'Git',
              'Node.js',
            ].map((tech, i) => (
              <div
                key={i}
                className="bg-background rounded-xl p-4 border border-border/30 text-center hover:border-primary/50 hover:bg-primary/5 hover:shadow-md transition-all duration-300 transform hover:scale-105"
              >
                <p className="font-semibold text-foreground/90 text-sm">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
