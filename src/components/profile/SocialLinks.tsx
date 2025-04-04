
import React from 'react';
import { SocialLink as SocialLinkType } from '@/types';
import { 
  Facebook, Twitter, Instagram, Youtube, Github, Linkedin, Twitch, 
  Globe, Mail, Music, Store 
} from 'lucide-react';

interface SocialLinksProps {
  socialLinks: SocialLinkType[];
  themeColor: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks, themeColor }) => {
  if (!socialLinks.length) {
    return null;
  }

  const socialIcons: Record<string, React.ReactNode> = {
    facebook: <Facebook />,
    twitter: <Twitter />,
    instagram: <Instagram />,
    youtube: <Youtube />,
    github: <Github />,
    linkedin: <Linkedin />,
    twitch: <Twitch />,
    website: <Globe />,
    email: <Mail />,
    spotify: <Music />,
    store: <Store />,
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4 mb-6">
      {socialLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-accent transition-colors"
          style={{ color: themeColor }}
          aria-label={link.platform}
        >
          {socialIcons[link.platform.toLowerCase()] || <Globe />}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
