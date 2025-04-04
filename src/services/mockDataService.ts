
import { Link, Profile, Theme, ButtonStyle, FontStyle, Analytics } from '../types';

// Mock themes
export const themes: Theme[] = [
  {
    id: 'purple',
    name: 'Purple',
    primaryColor: 'rgb(155, 135, 245)',
    secondaryColor: 'rgb(126, 105, 171)',
    backgroundType: 'gradient',
    backgroundValue: 'linear-gradient(135deg, rgb(155, 135, 245, 0.1), rgb(126, 105, 171, 0.1))',
  },
  {
    id: 'blue',
    name: 'Blue',
    primaryColor: 'rgb(96, 165, 250)',
    secondaryColor: 'rgb(59, 130, 246)',
    backgroundType: 'gradient',
    backgroundValue: 'linear-gradient(135deg, rgb(96, 165, 250, 0.1), rgb(59, 130, 246, 0.1))',
  },
  {
    id: 'green',
    name: 'Green',
    primaryColor: 'rgb(52, 211, 153)',
    secondaryColor: 'rgb(16, 185, 129)',
    backgroundType: 'gradient',
    backgroundValue: 'linear-gradient(135deg, rgb(52, 211, 153, 0.1), rgb(16, 185, 129, 0.1))',
  },
  {
    id: 'red',
    name: 'Red',
    primaryColor: 'rgb(248, 113, 113)',
    secondaryColor: 'rgb(239, 68, 68)',
    backgroundType: 'gradient',
    backgroundValue: 'linear-gradient(135deg, rgb(248, 113, 113, 0.1), rgb(239, 68, 68, 0.1))',
  },
  {
    id: 'orange',
    name: 'Orange',
    primaryColor: 'rgb(251, 146, 60)',
    secondaryColor: 'rgb(249, 115, 22)',
    backgroundType: 'gradient',
    backgroundValue: 'linear-gradient(135deg, rgb(251, 146, 60, 0.1), rgb(249, 115, 22, 0.1))',
  },
  {
    id: 'pink',
    name: 'Pink',
    primaryColor: 'rgb(244, 114, 182)',
    secondaryColor: 'rgb(236, 72, 153)',
    backgroundType: 'gradient',
    backgroundValue: 'linear-gradient(135deg, rgb(244, 114, 182, 0.1), rgb(236, 72, 153, 0.1))',
  },
];

// Mock button styles
export const buttonStyles: ButtonStyle[] = [
  {
    id: 'filled',
    name: 'Filled',
    className: 'bg-current text-white hover:opacity-90',
  },
  {
    id: 'outline',
    name: 'Outline',
    className: 'border-2 border-current text-current hover:bg-current hover:text-white',
  },
  {
    id: 'soft',
    name: 'Soft',
    className: 'bg-current/10 text-current hover:bg-current/20',
  },
  {
    id: 'shadow',
    name: 'Shadow',
    className: 'bg-white text-current border border-current/10 shadow-lg shadow-current/20 hover:shadow-current/30',
  },
];

// Mock font styles
export const fontStyles: FontStyle[] = [
  {
    id: 'sans',
    name: 'Sans',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: 'serif',
    name: 'Serif',
    fontFamily: 'ui-serif, Georgia, serif',
  },
  {
    id: 'mono',
    name: 'Mono',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
];

// Mock links data store
let mockLinks: Link[] = [];

// Mock profiles data store
let mockProfiles: { [userId: string]: Profile } = {};

// Mock analytics data store
let mockAnalytics: { [userId: string]: Analytics } = {};

// Initialize with default data for the current user
export const initializeMockData = (userId: string) => {
  // Check if this user already has data
  if (!mockLinks.some(link => link.userId === userId)) {
    // Create sample links for this user
    mockLinks = [
      ...mockLinks,
      {
        id: 'link1',
        userId,
        title: 'My Website',
        url: 'https://example.com',
        order: 0,
        clicks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'link2',
        userId,
        title: 'Twitter',
        url: 'https://twitter.com',
        order: 1,
        clicks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'link3',
        userId,
        title: 'GitHub',
        url: 'https://github.com',
        order: 2,
        clicks: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Check if this user already has a profile
  if (!mockProfiles[userId]) {
    // Create a default profile for this user
    mockProfiles[userId] = {
      id: 'profile1',
      userId,
      theme: 'purple',
      buttonStyle: 'filled',
      fontStyle: 'sans',
      socialLinks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Check if this user already has analytics
  if (!mockAnalytics[userId]) {
    // Create default analytics for this user
    mockAnalytics[userId] = {
      totalVisits: 0,
      linkClicks: {},
      visitsByDate: Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 10),
        };
      }).reverse(),
    };
  }
};

// Get links for a user
export const getLinks = (userId: string): Link[] => {
  return mockLinks
    .filter(link => link.userId === userId)
    .sort((a, b) => a.order - b.order);
};

// Add a new link
export const addLink = (userId: string, title: string, url: string): Link => {
  const existingLinks = getLinks(userId);
  const newLink: Link = {
    id: `link${Date.now()}`,
    userId,
    title,
    url,
    order: existingLinks.length,
    clicks: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockLinks.push(newLink);
  return newLink;
};

// Update a link
export const updateLink = (linkId: string, updates: Partial<Link>): Link => {
  const linkIndex = mockLinks.findIndex(link => link.id === linkId);
  if (linkIndex === -1) {
    throw new Error('Link not found');
  }
  
  mockLinks[linkIndex] = {
    ...mockLinks[linkIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return mockLinks[linkIndex];
};

// Delete a link
export const deleteLink = (linkId: string): void => {
  const linkIndex = mockLinks.findIndex(link => link.id === linkId);
  if (linkIndex === -1) {
    throw new Error('Link not found');
  }
  
  const deletedLink = mockLinks[linkIndex];
  mockLinks = mockLinks.filter(link => link.id !== linkId);
  
  // Update order of remaining links
  mockLinks
    .filter(link => link.userId === deletedLink.userId && link.order > deletedLink.order)
    .forEach(link => {
      link.order -= 1;
    });
};

// Reorder links
export const reorderLinks = (userId: string, linkIds: string[]): Link[] => {
  linkIds.forEach((linkId, index) => {
    const link = mockLinks.find(link => link.id === linkId && link.userId === userId);
    if (link) {
      link.order = index;
      link.updatedAt = new Date().toISOString();
    }
  });
  
  return getLinks(userId);
};

// Get profile for a user
export const getProfile = (userId: string): Profile => {
  return mockProfiles[userId] || null;
};

// Update profile
export const updateProfile = (userId: string, updates: Partial<Profile>): Profile => {
  if (!mockProfiles[userId]) {
    throw new Error('Profile not found');
  }
  
  mockProfiles[userId] = {
    ...mockProfiles[userId],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return mockProfiles[userId];
};

// Get analytics for a user
export const getAnalytics = (userId: string): Analytics => {
  return mockAnalytics[userId] || null;
};

// Record a visit to a profile
export const recordProfileVisit = (userId: string): void => {
  if (!mockAnalytics[userId]) {
    initializeMockData(userId);
  }
  
  mockAnalytics[userId].totalVisits += 1;
  
  const today = new Date().toISOString().split('T')[0];
  const todayIndex = mockAnalytics[userId].visitsByDate.findIndex(
    visit => visit.date === today
  );
  
  if (todayIndex !== -1) {
    mockAnalytics[userId].visitsByDate[todayIndex].count += 1;
  } else {
    mockAnalytics[userId].visitsByDate.push({
      date: today,
      count: 1,
    });
  }
};

// Record a link click
export const recordLinkClick = (userId: string, linkId: string): void => {
  if (!mockAnalytics[userId]) {
    initializeMockData(userId);
  }
  
  if (!mockAnalytics[userId].linkClicks[linkId]) {
    mockAnalytics[userId].linkClicks[linkId] = 0;
  }
  
  mockAnalytics[userId].linkClicks[linkId] += 1;
  
  // Also update the link object
  const link = mockLinks.find(link => link.id === linkId);
  if (link) {
    link.clicks += 1;
  }
};

// Get profile by username
export const getProfileByUsername = (username: string): { profile: Profile, links: Link[] } | null => {
  // This is a mock function - in a real app, this would query the database
  // For now, we'll just return the first user's profile and links
  const userId = '1';
  initializeMockData(userId);
  
  return {
    profile: mockProfiles[userId],
    links: getLinks(userId),
  };
};
