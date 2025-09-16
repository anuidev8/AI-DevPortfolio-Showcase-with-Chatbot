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