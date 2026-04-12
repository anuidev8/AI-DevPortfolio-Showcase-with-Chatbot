// types/notion.ts
export interface NotionProject {
    id: string;
    title: string;
    description: string;
    techs: Array<{
      id: string;
      name: string;
      color: string;
    }>;
    live: string;
    github: string;
    featured: boolean;
    category: {
      id: string;
      name: string;
      color: string;
    };
    created_time: string;
    video?: string; // Optional video URL
  }

export interface LandingPlan {
  id: string;
  label: string;
  name: string;
  shortDescription: string;
  subtitle?: string;
  bullets: string[];
  investment: string;
  investmentDetail?: string;
  primaryCTA: string;
  secondaryCTA?: string;
}

export interface UseCase {
  id: string;
  icon: string; // Will store lucide icon name
  title: string;
  benefit: string;
}

export interface ProcessStep {
  index: number;
  title: string;
  description: string;
  icon?: string;
}

export interface LandingTestimonial {
  id: string;
  quote: string;
  role: string;
  outcomeTag: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ProofStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  badge?: string;
}

export interface ResourcePost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  href: string;
  imagePlaceholderColor: string;
}