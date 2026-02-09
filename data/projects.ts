import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'ecommerce-dashboard',
    slug: 'ecommerce-dashboard',
    title: 'E-Commerce Dashboard',
    description: 'Custom analytics dashboard for tracking sales, inventory, and customer metrics in real-time. Built with Next.js and featuring interactive charts, inventory management, and sales reports.',
    longDescription: 'A comprehensive e-commerce analytics solution that helps businesses track their performance. Features include real-time sales tracking, inventory level monitoring, customer analytics, and automated reporting. The dashboard provides actionable insights to help business owners make data-driven decisions.',
    category: 'dashboard',
    tags: ['Next.js', 'React', 'TypeScript', 'Chart.js', 'Tailwind CSS', 'Supabase'],
    images: {
      thumbnail: '/images/projects/ecommerce-dashboard/thumb.svg',
      hero: '/images/projects/ecommerce-dashboard/hero.svg',
      gallery: [
        '/images/projects/ecommerce-dashboard/1.svg',
        '/images/projects/ecommerce-dashboard/2.svg',
      ],
      alt: 'E-Commerce Dashboard Interface showing sales analytics',
    },
    featured: true,
    technologies: ['Next.js', 'React', 'TypeScript', 'Chart.js', 'Supabase'],
    liveUrl: '#',
    githubUrl: 'https://github.com/josephthuo',
    caseStudy: '/projects/ecommerce-dashboard',
  },
  {
    id: 'hr-management-system',
    slug: 'hr-management-system',
    title: 'HR Management System',
    description: 'Complete employee management system with staff database, attendance tracking, leave management, and automated reporting. Built with Microsoft Access and VBA.',
    longDescription: 'A comprehensive HR management solution designed to streamline employee management processes. Features include employee records management, attendance tracking with biometric integration, leave management, payroll preparation, and detailed HR reports. The system has helped HR teams reduce administrative time by 60%.',
    category: 'system',
    tags: ['Microsoft Access', 'VBA', 'SQL', 'Excel'],
    images: {
      thumbnail: '/images/projects/hr-management-system/thumb.svg',
      hero: '/images/projects/hr-management-system/hero.svg',
      gallery: [
        '/images/projects/hr-management-system/1.svg',
      ],
      alt: 'HR Management System showing employee records',
    },
    featured: true,
    technologies: ['Microsoft Access', 'VBA', 'SQL'],
    caseStudy: '/projects/hr-management-system',
  },
  {
    id: 'corporate-landing-page',
    slug: 'corporate-landing-page',
    title: 'Corporate Landing Page',
    description: 'Modern, responsive landing page for B2B SaaS company with conversion-focused design, smooth animations, and SEO optimization.',
    longDescription: 'A high-converting landing page designed for a B2B SaaS company. The page features smooth scroll animations, responsive design, optimized performance, and integrated contact forms. Built with Next.js for optimal SEO and fast loading times.',
    category: 'web',
    tags: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'SEO'],
    images: {
      thumbnail: '/images/projects/corporate-landing-page/thumb.svg',
      hero: '/images/projects/corporate-landing-page/hero.svg',
      gallery: [
        '/images/projects/corporate-landing-page/1.svg',
      ],
      alt: 'Corporate landing page with modern design',
    },
    technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: '#',
    githubUrl: 'https://github.com/josephthuo',
    caseStudy: '/projects/corporate-landing-page',
  },
  {
    id: 'inventory-tracking-system',
    slug: 'inventory-tracking-system',
    title: 'Inventory Tracking System',
    description: 'Advanced inventory management system with automated stock alerts, barcode scanning, supplier management, and comprehensive reporting capabilities.',
    longDescription: 'An intelligent inventory management solution that helps businesses track stock levels, automate reorder points, manage suppliers, and generate detailed reports. Features include barcode/QR code scanning, multi-location support, automated low-stock alerts, and sales forecasting.',
    category: 'system',
    tags: ['Excel', 'VBA', 'Power Query', 'Microsoft Access'],
    images: {
      thumbnail: '/images/projects/inventory-tracking-system/thumb.svg',
      hero: '/images/projects/inventory-tracking-system/hero.svg',
      gallery: [
        '/images/projects/inventory-tracking-system/1.svg',
      ],
      alt: 'Inventory tracking system dashboard',
    },
    technologies: ['Microsoft Access', 'VBA', 'Power Query'],
    caseStudy: '/projects/inventory-tracking-system',
  },
  {
    id: 'fintech-ui-system',
    slug: 'fintech-ui-system',
    title: 'Fintech UI System',
    description: 'Complete UI design system and component library for financial technology platform with 50+ reusable components.',
    longDescription: 'A comprehensive design system created for a fintech startup. Includes 50+ reusable components, design tokens, documentation, and Figma components. The system ensures consistency across all products and speeds up development time by 40%.',
    category: 'design',
    tags: ['UI/UX', 'Design System', 'Figma', 'React'],
    images: {
      thumbnail: '/images/projects/fintech-ui-system/thumb.svg',
      hero: '/images/projects/fintech-ui-system/hero.svg',
      gallery: [
        '/images/projects/fintech-ui-system/1.svg',
        '/images/projects/fintech-ui-system/2.svg',
      ],
      alt: 'Fintech UI design system components',
    },
    featured: true,
    technologies: ['Figma', 'React', 'Storybook'],
    caseStudy: '/projects/fintech-ui-system',
  },
  {
    id: 'access-control-system',
    slug: 'access-control-system',
    title: 'Access Control System',
    description: 'Multi-location access management system with visitor logging, biometric integration, and security reporting.',
    longDescription: 'A comprehensive security management solution for organizations with multiple locations. Features include visitor pre-registration, biometric authentication, door access control, security incident reporting, and real-time monitoring dashboard. The system enhances security while providing a seamless visitor experience.',
    category: 'system',
    tags: ['Microsoft Access', 'VBA', 'Security', 'Reporting'],
    images: {
      thumbnail: '/images/projects/access-control-system/thumb.svg',
      hero: '/images/projects/access-control-system/hero.svg',
      gallery: [
        '/images/projects/access-control-system/1.svg',
      ],
      alt: 'Access control system interface',
    },
    technologies: ['Microsoft Access', 'VBA', 'Biometric Integration'],
    caseStudy: '/projects/access-control-system',
  },
];

// Helper function to get projects by category
export function getProjectsByCategory(category?: string): Project[] {
  if (!category || category === 'all') return projects;
  return projects.filter((p) => p.category === category);
}

// Helper function to get featured projects
export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

// Helper function to get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

// Get all unique categories
export function getCategories(): string[] {
  const categories = new Set(projects.map((p) => p.category));
  return ['all', ...Array.from(categories)];
}
