export type CommunityProfile = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  skills: string[];
  intent: string;
  bio: string;
  matchScore?: number;
  online?: boolean;
  animalId?: string;
  business?: string;
  lookingFor?: string;
  canHelp?: string;
};

export const NETWORKING_ANIMALS = [
  { id: "lion", emoji: "🦁", name: "Lion", vibe: "I lead and make intros", color: "#ff7400" },
  { id: "owl", emoji: "🦉", name: "Owl", vibe: "I listen and give advice", color: "#7c5cff" },
  { id: "fox", emoji: "🦊", name: "Fox", vibe: "I spot deals and partners", color: "#ff4d1a" },
  { id: "eagle", emoji: "🦅", name: "Eagle", vibe: "I see the bigger play", color: "#00e5ff" },
  { id: "dolphin", emoji: "🐬", name: "Dolphin", vibe: "I connect people fast", color: "#2bb0d9" },
  { id: "bee", emoji: "🐝", name: "Bee", vibe: "I build and get it done", color: "#ffc107" },
  { id: "wolf", emoji: "🐺", name: "Wolf", vibe: "I team up and ship", color: "#8d99ae" },
  { id: "hummingbird", emoji: "🐦", name: "Hummingbird", vibe: "I bring creative energy", color: "#ff0080" },
] as const;

export const NOSHY_QUESTIONS = [
  {
    id: "business",
    label: "1. What is your business?",
    placeholder: "What you do or sell, in one sentence.",
  },
  {
    id: "lookingFor",
    label: "2. What are you looking for?",
    placeholder: "A partner, client, intro, hire, or specific help.",
  },
  {
    id: "canHelp",
    label: "3. How can you help someone here?",
    placeholder: "One thing you can do for someone in this room tonight.",
  },
] as const;

export function getNetworkingAnimal(id?: string) {
  return NETWORKING_ANIMALS.find((animal) => animal.id === id);
}

export type CommunityCircle = {
  id: string;
  name: string;
  members: number;
  active: number;
  avatars: string[];
  accent: string;
  description: string;
};

export const COMMUNITY_CIRCLES: CommunityCircle[] = [
  {
    id: "1",
    name: "AI After Hours",
    members: 86,
    active: 18,
    avatars: [
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c1&backgroundColor=5cbef8",
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c2&backgroundColor=1a3a5c",
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c3&backgroundColor=ff7400",
    ],
    accent: "#00f2ff",
    description: "Practical AI talks for builders and operators",
  },
  {
    id: "2",
    name: "Builders & Devs",
    members: 124,
    active: 29,
    avatars: [
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c4&backgroundColor=00e5ff",
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c5&backgroundColor=5cbef8",
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c6&backgroundColor=112240",
    ],
    accent: "#b44aff",
    description: "Ship products, find co-founders, pair up on projects",
  },
  {
    id: "3",
    name: "Creators Lab",
    members: 67,
    active: 14,
    avatars: [
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c7&backgroundColor=ff0080",
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c8&backgroundColor=ff7400",
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c9&backgroundColor=5cbef8",
    ],
    accent: "#ff007a",
    description: "Video, design, and paid creative projects",
  },
  {
    id: "4",
    name: "Mentorship Circle",
    members: 52,
    active: 11,
    avatars: [
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c10&backgroundColor=5cbef8",
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c11&backgroundColor=00e5ff",
      "https://api.dicebear.com/9.x/adventurer/svg?seed=c12&backgroundColor=ff0080",
    ],
    accent: "#00f2ff",
    description: "Career, business, and AI guidance",
  },
];
