import { NotionProject } from '@/types/project.types';

// Mock projects data
export const mockProjects: NotionProject[] = [
  {
    id: '15',
    title: 'Fitness AI Dashboard – Voice-Powered Health & Progress Intelligence',
    description: `Fitness AI Dashboard is an intelligent fitness tracking and coaching platform that combines analytics, real-time voice interaction, and AI-powered personalization.
  
  The platform allows users to track workout sessions, monitor goal progress (strength, cardio, flexibility), analyze nutrition status, and interact with a voice-based AI fitness assistant for personalized plans.
  
  Instead of static tracking apps, this system integrates real-time analytics + AI conversation to adapt plans dynamically based on user performance and goals.
  
  🏗️ Architecture Overview
  
  Frontend (Next.js / React)
  - Interactive dashboard UI
  - Real-time stats visualization
  - Circular progress tracking
  - Nutrition & workout analytics panels
  - Voice interaction button + waveform feedback
  
  Backend (Node.js / Python)
  - User fitness data processing
  - Goal tracking engine
  - Nutrition scoring logic
  - AI plan generation
  - Performance trend analytics
  
  AI Layer
  - Conversational fitness assistant
  - Personalized workout recommendations
  - Adaptive goal optimization
  - Progress prediction modeling
  
  🔄 User Flow
  User Opens Dashboard
     ↓
  Views Workout & Nutrition Stats
     ↓
  Speaks to AI Assistant
     ↓
  AI Analyzes Fitness Data
     ↓
  Generates Updated Plan & Insights
     ↓
  Dashboard Updates in Real-Time
  
  🚀 Key Features
  - AI Fitness Coach (Voice-Enabled)
  - Real-Time Workout Tracking
  - Goal Progress Monitoring (Strength / Cardio / Flexibility)
  - Nutrition Status Intelligence
  - Trend & Performance Analytics
  - Predictive Fitness Insights
  - Modern AI-Centric UI Experience
  
  This platform transforms traditional fitness tracking into an intelligent, conversational coaching experience powered by real-time data and AI-driven decision making.`,
    techs: [
      { id: '1', name: 'Next.js', color: '#000000' },
      { id: '2', name: 'React.js', color: '#61dafb' },
      { id: '3', name: 'Node.js', color: '#339933' },
      { id: '4', name: 'OpenAI API', color: '#10b981' },
      { id: '5', name: 'Voice Interface', color: '#f59e0b' },
      { id: '6', name: 'Data Visualization', color: '#06b6d4' },
      { id: '7', name: 'AI Coaching', color: '#8b5cf6' },
      { id: '8', name: 'Real-Time Analytics', color: '#ef4444' },
      { id: '9', name: 'Dashboard UI', color: '#22c55e' }
    ],
    live: '#',
    github: '#',
    featured: true,
    category: {
      id: '4',
      name: 'AI Agent',
      color: '#10b981'
    },
    created_time: '2026-03-04T00:00:00.000Z',
    video: 'https://res.cloudinary.com/dnmjmjdsj/video/upload/v1772649648/videos%20anuidev/V%C3%ADdeo_sin_t%C3%ADtulo_Hecho_con_Clipchamp-2_djxir7.mp4'
  },
  {
    id: '14',
    title: 'Marketing AI – Real-Time Voice Talent Matching Platform',
    description: `Marketing AI is a real-time voice-powered platform designed to connect businesses with the right digital marketing specialists instantly.
  
  Instead of filling long forms or manually searching through marketplaces, business owners simply speak to the AI assistant. The system listens, analyzes intent, extracts marketing needs (Google Ads, Meta Ads, TikTok, LinkedIn, Email, etc.), evaluates budget, and matches the best-fit "traffickers" in real time.
  
  🏗️ Architecture Overview
  
  Frontend (Next.js / React)
  - Real-time voice interface
  - Live waveform visualization
  - Dynamic freelancer cards
  - Budget estimation panel
  - Streaming UI updates
  
  Backend (Node.js / Python)
  - Speech-to-Text processing
  - Intent & skill extraction (NLP)
  - Matching & ranking algorithm
  - Budget estimation engine
  - Real-time database queries
  
  AI Layer
  - LLM for requirement understanding
  - Scoring system for talent matching
  - Cost & duration prediction logic
  
  🔄 Matching Flow
  User Voice Input
     ↓ Speech-to-Text
  Intent & Skill Extraction
     ↓ Budget Analysis
  Matching Algorithm
     ↓ Ranked Talent List
  Real-Time UI Update
  
  🚀 Key Features
  - Voice-Based Hiring Assistant
  - Real-Time Freelancer Matching
  - Intelligent Budget Forecasting
  - Skill-Based Ranking System
  - Success Rate & Response Time Metrics
  - Modern AI-driven Interface
  
  This platform transforms hiring into a conversational experience, reducing talent discovery time from days to minutes while improving match quality through AI scoring and predictive analytics.`,
    techs: [
      { id: '1', name: 'Next.js', color: '#000000' },
      { id: '2', name: 'React.js', color: '#61dafb' },
      { id: '3', name: 'Node.js', color: '#339933' },
      { id: '4', name: 'OpenAI API', color: '#10b981' },
      { id: '5', name: 'Google Voice API', color: '#4285F4' },
      { id: '6', name: 'vercel sdk ai', color: '#f59e0b' },
      { id: '7', name: 'WebRTC', color: '#06b6d4' },
      { id: '8', name: 'Real-Time Streaming', color: '#8b5cf6' },
      { id: '9', name: 'AI Matching Algorithm', color: '#ef4444' },
      { id: '10', name: 'NLP', color: '#22c55e' }
    ],
    live: '#',
    github: 'https://github.com/anuidev8/conversational-event-flow.git',
    featured: true,
    category: {
      id: '4',
      name: 'AI Agent',
      color: '#10b981'
    },
    created_time: '2024-01-14T00:00:00.000Z',
    video: 'https://res.cloudinary.com/dnmjmjdsj/video/upload/v1772649393/videos%20anuidev/video-2_il1cdn.mp4'
  },
  {
    id: '13',
    title: 'Real-Time Voice AI Mobile App - OpenAI Realtime + React Native',
    description: `Hace poco publiqué un demo implementando la API de Google para transmitir voz en tiempo real con IA. Explorando más a fondo, entendí el verdadero poder que puede tener una interfaz que combine voz + video + IA de forma interactiva en el día a día.

Ahora el verdadero reto es llevarlo al móvil 📱, el dispositivo que todos usamos constantemente y donde la accesibilidad es mayor.

👉 En este camino me encontré con la librería Realtime de OpenAI junto con React Native y Expo, para construir aplicaciones móviles que transmitan y procesen audio en vivo.

Pero no solo se limita a OpenAI: también se puede integrar con Google, ElevenLabs y otras plataformas.

Lo importante es el protocolo, como react-native-webrtc, que permite transmitir el audio en vivo para que la IA lo interprete al instante.

🚀 Les comparto el demo por acá 👇`,
    techs: [
      { id: '1', name: 'React Native', color: '#61dafb' },
      { id: '2', name: 'Expo', color: '#000000' },
      { id: '3', name: 'OpenAI Realtime', color: '#10b981' },
      { id: '4', name: 'WebRTC', color: '#06b6d4' },
      { id: '5', name: 'Google Voice API', color: '#4285F4' },
      { id: '6', name: 'ElevenLabs', color: '#8b5cf6' },
      { id: '7', name: 'Real-Time Audio', color: '#f59e0b' },
      { id: '8', name: 'Mobile AI', color: '#ef4444' }
    ],
    live: '#',
    github: '#',
    featured: true,
    category: {
      id: '5',
      name: 'Mobile AI',
      color: '#8b5cf6'
    },

    created_time: '2026-03-04T00:00:00.000Z',
    video: 'https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758061704/videos%20anuidev/Copia_de_video_example_Hecho_con_Clipchamp_wefai9.mp4'
  },
  {
      id: '12',
      title: 'SECOP AI Agent',
      description: `Tu agente IA para encontrar y ganar licitaciones públicas en Colombia.
    
    🏗️ Arquitectura Completa
    
    Frontend (React/Next.js)
    - Framework: Next.js 15 con CopilotKit
    - UI: Tailwind CSS + Radix UI
    - Chat: Componente AgenticChat con streaming
    - Puerto: 3000
    
    Backend (Python/Flask)
    - Framework: Flask con CrewAI
    - LLM: LiteLLM + OpenAI GPT-4o
    - Herramientas: Integración con datos.gov.co
    - Puerto: 5000
    
    🔄 Flujo de Comunicación
    Frontend React (puerto 3000)
        ↓ HTTP POST
    Backend Python (puerto 5000)
        ↓ CrewAI + LiteLLM
    OpenAI GPT-4o
        ↓ Streaming
    Frontend React
    
    🚀 Características
    - Chat Agéntico: Sistema inteligente con herramientas
    - Streaming en Tiempo Real: Respuestas fluidas
    - Herramientas de Datos: Integración con datos.gov.co
    - Interfaz Moderna: UI responsive y accesible
    - Configuración Flexible: Modo general y especializado`,
      techs: [
        { id: '1', name: 'Next.js 15', color: '#000000' },
        { id: '2', name: 'CopilotKit', color: '#0ea5e9' },
        { id: '3', name: 'Tailwind CSS', color: '#06b6d4' },
        { id: '4', name: 'Radix UI', color: '#6366f1' },
        { id: '5', name: 'Python', color: '#3776AB' },
        { id: '6', name: 'Flask', color: '#000000' },
        { id: '7', name: 'CrewAI', color: '#f59e0b' },
        { id: '8', name: 'LiteLLM', color: '#22c55e' },
        { id: '9', name: 'OpenAI GPT-4o', color: '#10b981' },
        { id: '10', name: 'datos.gov.co', color: '#ef4444' }
      ],
      live: '#',
      github: '#',
      featured: true,
      category: {
        id: '4',
        name: 'AI Agent',
        color: '#10b981'
      },
      created_time: '2024-01-12T00:00:00.000Z',
      video: 'https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758061155/videos%20anuidev/secop_Hecho_con_Clipchamp_etzgrp.mp4'
    

  },
  {
    id: '11',
    title: 'Real-Time Meditation Demo – Tribu IA',
    description: `La semana pasada tuve la oportunidad de presentar en Tribu IA un pequeño demo de meditación en tiempo real, utilizando la API de Google Live. En este ejercicio combinamos voz y cámara para guiar prácticas de meditación interactivas.
  
  Al explorar más a fondo, me surgió una inquietud sobre cómo se da la comunicación entre el cliente (la plataforma) y la API de Google en tiempo real. En el camino aparecieron dos protagonistas clave: WebSocket y WebRTC.
  
  Esto me llevó a una pregunta interesante:
  👉 ¿Cuál de estos protocolos utiliza realmente Google y por qué?
  👉 ¿Cuál es más adecuado para aplicaciones en tiempo real donde intervienen voz e imágenes?`,
    techs: [
      { id: '1', name: 'Google Live API', color: '#4285F4' },
      { id: '2', name: 'WebSocket', color: '#f59e0b' },
      { id: '3', name: 'WebRTC', color: '#06b6d4' },
      { id: '4', name: 'Real-Time Apps', color: '#8b5cf6' }
    ],
    live: '#',
    github: '#',
    featured: true,
    category: {
      id: '3',
      name: 'AI & Real-Time',
      color: '#8b5cf6'
    },
    created_time: '2024-01-11T00:00:00.000Z',
    video: 'https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758059434/videos%20anuidev/Copia_de_video-media-ai-protocl_Hecho_con_Clipchamp_vvfpkp.mp4'
  }
  ,
  {
    id: '10',
    title: 'AI Interfaces Exploration – Google Voice & Camera Vision Live API',
    description: `I have always been passionate about exploring new tools to build interfaces and bring small elements of the web to life in different ways. What we are experiencing now with artificial intelligence is truly amazing: we can create interfaces not only faster, but also with more purpose and focus. AI gives us the chance to transform our workflows and enrich the connection between user interfaces and technology. I believe our biggest challenge as frontend developers is to adapt and make the most of these new tools.
  
  I’m sharing a small use case that integrates Google Voice and Camera Vision Live API with Next.js and Google Vercel. Thanks to Jamilton Alonso Quintero Osorio for sharing your knowledge and building products with purpose.`,
    techs: [
      { id: '1', name: 'Next.js', color: '#000000' },
      { id: '2', name: 'Google Voice API', color: '#4285F4' },
      { id: '3', name: 'Google Camera Vision Live API', color: '#34A853' },
      { id: '4', name: 'AI Integration', color: '#8b5cf6' },
      { id: '5', name: 'Vercel', color: '#000000' }
    ],
    live: '#',
    github: '#',
    featured: true,
    category: {
      id: '2',
      name: 'Frontend',
      color: '#3b82f6'
    },
    created_time: '2024-01-10T00:00:00.000Z',
    video: 'https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758059335/videos%20anuidev/V%C3%ADdeo_sin_t%C3%ADtulo_Hecho_con_Clipchamp_1_ziopjg.mp4'
  },
  {
    id: '9',
    title: 'n8n Data Analysis & Automation Platform',
    description: 'Una de las principales ventajas que he descubierto al explorar n8n es la capacidad de crear análisis interactivos de forma ágil para resolver problemas complejos de automatización de procesos y optimización de flujos de trabajo en tiempo real, en este caso en el ámbito del marketing digital. Al combinar mi pasión por las interfaces con estas herramientas, he logrado desarrollar experiencias de usuario intuitivas, que convierten datos complejos en insights claros y accionables, facilitando la toma de decisiones estratégicas de manera eficiente y accesible.',
    techs: [
      { id: '1', name: 'n8n', color: '#ff6b35' },
      { id: '2', name: 'Data Analysis', color: '#8b5cf6' },
      { id: '3', name: 'Automation', color: '#06b6d4' },
      { id: '4', name: 'Marketing Digital', color: '#f59e0b' },
      { id: '5', name: 'Workflow Optimization', color: '#10b981' }
    ],
    live: '#',
    github: '#',
    featured: true,
    category: {
      id: '3',
      name: 'Backend',
      color: '#f59e0b'
    },
    created_time: '2024-01-09T00:00:00.000Z',
    video: 'https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758057664/videos%20anuidev/n8n-ads_wyekk0.mp4'
  },
  {
    id: '8',
    title: 'The School Of Breath App',
    description: 'Discover your True Self through Ancient Breathing Techniques - Holistic Courses on Breathwork, Meditation & Sleep - Holistic Membership with Exclusive',
    techs: [
      { id: '1', name: 'React-Native', color: '#61dafb' },
      { id: '2', name: 'Node.js', color: '#339933' },
      { id: '3', name: 'React-Query', color: '#ff4154' },
      { id: '4', name: 'TypeScript', color: '#3178c6' }
    ],
    live: 'https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath&hl=es_CO',
    github: 'https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath&hl=es_CO',
    featured: true,
    category: {
      id: '1',
      name: 'Full Stack',
      color: '#10b981'
    },
    created_time: '2024-01-08T00:00:00.000Z',
    video: 'https://res.cloudinary.com/dnmjmjdsj/video/upload/v1758058548/videos%20anuidev/THE_SCHOOL_OF_BREATH_APP_Breathwork_-_Meditation_-_Sleep_Music_-_The_School_of_Breath_1080p_h264_youtube_nbp7oz.mp4'
  },
  {
    id: '7',
    title: 'Sleep music web app',
    description: 'web app for Transform your well-being with our expertly designed tools and resources',
    techs: [
      { id: '1', name: 'React.js', color: '#61dafb' },
      { id: '2', name: 'React-Query', color: '#ff4154' },
      { id: '3', name: 'Vitest', color: '#6e9f18' },
      { id: '4', name: 'TypeScript', color: '#3178c6' },
      { id: '5', name: 'Tailwind CSS', color: '#06b6d4' }
    ],
    live: 'https://www.meditatewithabhi.com/app',
    github: 'https://www.meditatewithabhi.com/app',
    featured: true,
    category: {
      id: '2',
      name: 'Frontend',
      color: '#3b82f6'
    },
    created_time: '2024-01-07T00:00:00.000Z'
  },
  {
    id: '6',
    title: 'SONY Wireless control DualSense',
    description: 'SONY Wireless control DualSense™ ui',
    techs: [
      { id: '1', name: 'React.js', color: '#61dafb' },
      { id: '2', name: 'CSS', color: '#1572b6' },
      { id: '3', name: 'SVG', color: '#ff6b35' }
    ],
    live: 'sony-wireless-control-ui.vercel.app',
    github: 'https://github.com/anuidev8/SONY-wireless-control-ui',
    featured: true,
    category: {
      id: '2',
      name: 'Frontend',
      color: '#3b82f6'
    },
    created_time: '2024-01-06T00:00:00.000Z'
  },
  {
    id: '5',
    title: 'At The Cusp Of Freedom',
    description: 'At The Cusp Of Freedom',
    techs: [
      { id: '1', name: 'Next.js', color: '#000000' },
      { id: '2', name: 'CSS', color: '#1572b6' }
    ],
    live: 'https://at-the-cusp-of-freedom-podcast.vercel.app/',
    github: 'https://at-the-cusp-of-freedom-podcast.vercel.app/',
    featured: true,
    category: {
      id: '2',
      name: 'Frontend',
      color: '#3b82f6'
    },
    created_time: '2024-01-05T00:00:00.000Z'
  },
  {
    id: '4',
    title: 'Briefcase',
    description: 'Personal web briefcase to share my knowledge, personal projects and people I have worked with.',
    techs: [
      { id: '1', name: 'Next.js', color: '#000000' },
      { id: '2', name: 'GSAP', color: '#88ce02' }
    ],
    live: 'briefcase-lilac.vercel.app',
    github: 'https://github.com/anuidev8/briefcase',
    featured: true,
    category: {
      id: '2',
      name: 'Frontend',
      color: '#3b82f6'
    },
    created_time: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Anatomy of a Neuron',
    description: 'Do you know how a neuron works ?. In this animation, explain to you, who work a neuron, using js and GSAP framework animation',
    techs: [
      { id: '1', name: 'SVG', color: '#ff6b35' }
    ],
    live: 'neuron-anatomy-animation.vercel.app',
    github: 'https://github.com/anuidev8/NEURON-ANATOMY-ANIMATION',
    featured: true,
    category: {
      id: '2',
      name: 'Frontend',
      color: '#3b82f6'
    },
    created_time: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'VISTA VERDE MALL',
    description: 'Mall shopping landing page, where is shown through 360° imaging info about stores in the mall and shown, events, the better store, the best client.',
    techs: [
      { id: '1', name: 'React.js', color: '#61dafb' },
      { id: '2', name: 'Tailwind CSS', color: '#06b6d4' },
      { id: '3', name: 'Three.js', color: '#000000' },
      { id: '4', name: 'Next.js', color: '#000000' }
    ],
    live: 'https://mall-landing-page.vercel.app/',
    github: 'https://mall-landing-page.vercel.app/',
    featured: true,
    category: {
      id: '2',
      name: 'Frontend',
      color: '#3b82f6'
    },
    created_time: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '1',
    title: 'Events medellin Platform',
    description: 'eventsmedellin | language exchange Unlock Languages, Culture & Rewards in Medellín. Learn languages while exploring Medellín',
    techs: [
      { id: '1', name: 'Wordpress', color: '#21759b' }
    ],
    live: 'https://www.events-medellin.com',
    github: 'https://www.events-medellin.com/',
    featured: true,
    category: {
      id: '1',
      name: 'Full Stack',
      color: '#10b981'
    },
    created_time: '2024-01-01T00:00:00.000Z'
  }
];
