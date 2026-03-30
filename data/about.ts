import { AboutSection, ContactInfo, SocialLink } from '../types';

export const about: AboutSection = {
  title: 'About Me',
  subtitle: 'Creative Web Developer & System Builder',
  bio: "I'm Joseph Thuo, a passionate Full Stack Developer and System Builder based in Nairobi, Kenya. With over 5 years of experience, I specialize in creating modern web applications, custom business systems, and digital solutions that help businesses work more efficiently. I combine technical expertise with creative problem-solving to deliver practical, user-friendly solutions that make a real impact. From responsive websites to complex management systems, I'm dedicated to turning ideas into functional, beautiful products.",
  stats: {
    projects: 50,
    clients: 30,
    years: 5,
  },
};

export const contact: ContactInfo = {
  email: 'thuojesseph405@gmail.com',
  location: 'Nairobi, Kenya',
  availability: 'Available for projects',
};

export const socialLinks: SocialLink[] = [
  {
    id: 'github',
    platform: 'GitHub',
    url: 'https://github.com/josephthuo',
    username: '@josephthuo',
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/josephthuo',
    username: '/in/josephthuo',
  },
  {
    id: 'twitter',
    platform: 'Twitter',
    url: 'https://twitter.com/josephthuo',
    username: '@josephthuo',
  },
  {
    id: 'whatsapp',
    platform: 'WhatsApp',
    url: 'https://wa.me/254768682374',
    username: '+254 768 682 374',
  },
  {
    id: 'email',
    platform: 'Email',
    url: 'mailto:thuojesseph405@gmail.com',
  },
];
