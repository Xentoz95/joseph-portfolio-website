import { Service } from '../types';

export const services: Service[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies like Next.js, React, and TypeScript.',
    features: [
      'Responsive design for all devices',
      'Fast loading and optimized performance',
      'SEO-friendly architecture',
      'Modern, clean code',
      'CMS integration options',
    ],
    priceRange: 'Starting at $1,500',
  },
  {
    id: 'system-development',
    title: 'Business Systems',
    description: 'Custom business management systems including HR, inventory, access control, and more using Microsoft Access and VBA.',
    features: [
      'Tailored to your business processes',
      'Automated reporting and alerts',
      'User-friendly interfaces',
      'Data security and backups',
      'Training and documentation',
    ],
    priceRange: 'Starting at $2,000',
  },
  {
    id: 'dashboard-solutions',
    title: 'Dashboard Solutions',
    description: 'Interactive dashboards for data visualization, analytics, and business intelligence.',
    features: [
      'Real-time data updates',
      'Custom charts and visualizations',
      'Export and reporting features',
      'Multi-user support',
      'Mobile responsive',
    ],
    priceRange: 'Starting at $1,800',
  },
  {
    id: 'ui-design',
    title: 'UI/UX Design',
    description: 'Beautiful, functional user interfaces designed with user experience and conversion in mind.',
    features: [
      'User research and personas',
      'Wireframing and prototyping',
      'Design systems and components',
      'Responsive mockups',
      'Developer handoff',
    ],
    priceRange: 'Starting at $1,000',
  },
];
