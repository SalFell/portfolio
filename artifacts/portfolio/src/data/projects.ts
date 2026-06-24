export interface Project {
  id: number;
  title: string;
  subtitle: string;
  genre: "WEB APP" | "MOBILE" | "DESIGN" | "GAME" | "LIBRARY" | "DATA";
  difficulty: number;
  year: number;
  description: string;
  tech: string[];
  status: "COMPLETE" | "IN PROGRESS" | "SHIPPED";
  color: string;
  videoId?: string;
  url?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Sun's Edge",
    subtitle: "Systems Developer",
    genre: "GAME",
    difficulty: 5,
    year: 2023,
    description: "Designed and implemented gameplay systems for character abilities and inventory in Unreal Engine 5. \
      Utilized Trello to track progress and prioritize tasks. \
      Used Unreal's debugger and profiler to identify and fix bugs and optimize performance.",
    tech: ["Unreal Engine", "C++", "Trello", "Github"],
    status: "IN PROGRESS",
    color: "#00FFFF", // Cyan
    videoId: "JrwKrnEH5wM",
    url: "https://store.steampowered.com/app/2174210/Suns_Edge/",
  },
  {
    id: 2,
    title: "Crab Dash",
    subtitle: "Gameplaye & UI Programmer",
    genre: "GAME",
    difficulty: 3,
    year: 2025,
    description: "Developed a third-person puzzle game as part of a game jam themed “Hidden Currency” focusing on core mechanics such as a randomly populated puzzle board, score system, and UI logic using Unreal Engine 5's Blueprints. \
      Setup and managed version control for a team of 6 through Github. \
      Delegated tasks based on priority while ensuring to outline expected task outcomes and to stay within the project's scope.",
    tech: ["Unreal Engine", "C++", "itch.io", "Github"],
    status: "SHIPPED",
    color: "#FF00FF", // Magenta
    videoId: "llS4CNA1IJU",
    url: "https://maruvail.itch.io/crabdash",
  },
  {
    id: 3,
    title: "Lean and Loot",
    subtitle: "Solo Developer",
    genre: "GAME",
    difficulty: 4,
    year: 2025,
    description: "Developed a movement based first-person stealth demo in Unreal Engine 5. \
      Created game design document and pitch deck outlining core mechanics, minimum viable product, and target audience. \
      Created and maintained production plan using HacknPlan to track progress, prioritize tasks, and setup knowledgebase of design decisions. \
      Blocked out levels first on paper, then in editor. \
      Created metrics gym to help with player movement and level design. \
      Implemented core movement mechanics and AI behavior. \
      Designed and implemented simple UI to navigate the game and adjust visual and audio settings.",
    tech: ["Unreal Engine", "C++", "itch.io", "Github"],
    status: "IN PROGRESS",
    color: "#00FF41", // Green
    videoId: "U_SxnTr-6J0",
    url: "https://salfell.itch.io/lean-and-loot",
  },
];
