'use client';

import { BlurText } from './blur-text';

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
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6 mb-16">
          <BlurText
            text="What I Bring to the Table"
            className="text-primary font-semibold text-lg tracking-wide"
            delay={100}
            animateBy="words"
            direction="top"
          />
          <BlurText
            text="Skills & Expertise"
            className="text-5xl sm:text-6xl font-bold text-foreground text-balance"
            delay={150}
            animateBy="words"
            direction="top"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {skillCategories.map((category, i) => (
            <div
              key={i}
              className="group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-primary mb-6 group-hover:text-primary transition">{category.name}</h3>
              <ul className="space-y-4">
                {category.skills.map((skill, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-primary/70 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-foreground/90 group-hover:text-foreground transition">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="bg-background rounded-3xl p-10 sm:p-12 border border-border/50">
          <BlurText
            text="Tech Stack"
            className="text-3xl font-bold text-foreground mb-10"
            delay={300}
            animateBy="words"
            direction="top"
          />
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
                className="bg-card rounded-xl p-4 border border-border/30 text-center hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 transform hover:scale-105"
              >
                <p className="font-semibold text-foreground text-sm">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
