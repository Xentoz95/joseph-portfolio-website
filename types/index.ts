/**
 * Type definitions for portfolio website data structures
 */

export type ProjectCategory = 'web' | 'system' | 'dashboard' | 'design' | 'mobile';

export interface ProjectImages {
  thumbnail: string;
  hero?: string;
  gallery?: string[];
  alt: string;
}

export interface ProjectLinks {
  liveDemo?: string;
  github?: string;
  caseStudy?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  tags: string[];
  images: ProjectImages;
  links?: ProjectLinks;
  client?: string;
  year?: number;
  featured?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level?: number; // 1-5 proficiency level
  years?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features: string[];
  priceRange?: string;
}

export interface AboutSection {
  title: string;
  subtitle: string;
  bio: string;
  stats: {
    projects: number;
    clients: number;
    years: number;
  };
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  username?: string;
}

export interface ContactInfo {
  email: string;
  location?: string;
  availability?: string;
}

export interface PortfolioMetadata {
  title: string;
  description: string;
  author: string;
  keywords: string[];
  ogImage?: string;
}
