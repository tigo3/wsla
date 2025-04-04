
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: string;
  userId: string;
  title: string;
  url: string;
  order: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  theme: string;
  backgroundColor?: string;
  backgroundImage?: string;
  buttonStyle: string;
  fontStyle: string;
  socialLinks: SocialLink[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Analytics {
  totalVisits: number;
  linkClicks: {
    [linkId: string]: number;
  };
  visitsByDate: {
    date: string;
    count: number;
  }[];
}

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundValue: string;
}

export interface ButtonStyle {
  id: string;
  name: string;
  className: string;
}

export interface FontStyle {
  id: string;
  name: string;
  fontFamily: string;
}
