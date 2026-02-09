/**
 * Central export point for all data
 * Import data from a single location for better maintenance
 */

export { projects } from './projects';
export { skills } from './skills';
export { services } from './services';
export { about, contact, socialLinks } from './about';
export { metadata } from './metadata';

// Re-export types for convenience
export type {
  Project,
  ProjectCategory,
  ProjectImages,
  ProjectLinks,
  Skill,
  SkillCategory,
  Service,
  AboutSection,
  SocialLink,
  ContactInfo,
  PortfolioMetadata,
} from '../types';
