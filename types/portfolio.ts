export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface Experience {
  company: string;
  period: string;
  position: string;
  tasks: string[];
  isCurrent?: boolean;
}

export interface Screenshot {
  src: string;
  alt: string;
}

export interface Project {
  id: string;
  title: string;
  year: string;
  company?: string;
  role: string;
  description: string;
  highlights: string[];
  tags: string[];
  image: string;
  screenshots: Screenshot[];
}

export interface Skill {
  category: string;
  items: string[];
}
