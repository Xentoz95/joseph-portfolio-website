import { SkillCategory } from '../types';

export const skills: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    skills: [
      { name: 'React', level: 5, years: 5 },
      { name: 'Next.js', level: 5, years: 4 },
      { name: 'TypeScript', level: 4, years: 4 },
      { name: 'Tailwind CSS', level: 5, years: 4 },
      { name: 'HTML/CSS', level: 5, years: 8 },
      { name: 'JavaScript', level: 5, years: 8 },
    ],
  },
  {
    id: 'backend',
    name: 'Backend Development',
    skills: [
      { name: 'Node.js', level: 4, years: 4 },
      { name: 'Python', level: 3, years: 3 },
      { name: 'PostgreSQL', level: 3, years: 3 },
      { name: 'REST APIs', level: 4, years: 5 },
    ],
  },
  {
    id: 'tools',
    name: 'Tools & Platforms',
    skills: [
      { name: 'Git', level: 5, years: 7 },
      { name: 'Figma', level: 4, years: 4 },
      { name: 'Vercel', level: 4, years: 3 },
      { name: 'VS Code', level: 5, years: 6 },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    skills: [
      { name: 'UI/UX Design', level: 4, years: 5 },
      { name: 'Responsive Design', level: 5, years: 6 },
      { name: 'Design Systems', level: 4, years: 4 },
      { name: 'Prototyping', level: 4, years: 4 },
    ],
  },
  {
    id: 'database',
    name: 'Database & Systems',
    skills: [
      { name: 'Microsoft Access', level: 5, years: 8 },
      { name: 'Excel/VBA', level: 5, years: 8 },
      { name: 'SQL', level: 4, years: 5 },
      { name: 'System Design', level: 4, years: 6 },
    ],
  },
];
