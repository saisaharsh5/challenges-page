export interface TryHackMeRoom {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  url: string;
  completion_date: string;
  created_at: string;
}

export interface HackTheBoxMachine {
  id: string;
  machine_name: string;
  description: string;
  os_type: 'Linux' | 'Windows' | 'Other';
  points: number;
  url: string;
  completion_date: string;
  created_at: string;
}

export interface CTFChallenge {
  id: string;
  event_name: string;
  challenge_title: string;
  category: string;
  my_ranking: number;
  completion_date: string;
  created_at: string;
}

export interface StaticContent {
  id: string;
  key: string;
  content: string;
  updated_at: string;
}

export interface SectionContent {
  id: string;
  section_key: string;
  title: string;
  description: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}