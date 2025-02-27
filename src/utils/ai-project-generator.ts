// utils/ai-project-generator.ts
import { NotionProject } from '@/types/project.types';

export function generateAIProject(prompt: string): Omit<NotionProject, 'id' | 'created_time'> {
  // This is a simplified version. In real implementation, 
  // you would use the AI to generate these details
  return {
    title: `AI Generated Project: ${prompt}`,
    description: "An AI-generated project based on your portfolio technologies and style.",
    techs: [
      {
        id: "1",
        name: "React.js",
        color: "blue"
      },
      {
        id: "2",
        name: "Next.js",
        color: "black"
      },
      {
        id: "3",
        name: "Tailwind CSS",
        color: "blue"
      }
    ],
    live: "#",
    github: "#",
    featured: Math.random() > 0.5,
    category: {
      id: "1",
      name: "Frontend",
      color: "blue"
    }
  };
}

export function formatAIResponse(projects: Array<Omit<NotionProject, 'id' | 'created_time'>>) {
  return {
    type: 'projects',
    content: projects.map(project => ({
      ...project,
      aiGenerated: true
    }))
  };
}

