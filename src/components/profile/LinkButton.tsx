
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from '@/types';
import { buttonStyles } from '@/services/mockDataService';
import { recordLinkClick } from '@/services/mockDataService';

interface LinkButtonProps {
  link: Link;
  userId: string;
  buttonStyle: string;
  themeColor: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ link, userId, buttonStyle, themeColor }) => {
  const buttonStyleConfig = buttonStyles.find((style) => style.id === buttonStyle) || buttonStyles[0];

  const handleClick = () => {
    recordLinkClick(userId, link.id);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={`linkly-button group ${buttonStyleConfig.className} mb-3 relative`}
      style={{
        color: buttonStyleConfig.className.includes('text-current') ? themeColor : '',
        backgroundColor: buttonStyleConfig.className.includes('bg-current') ? themeColor : '',
        borderColor: buttonStyleConfig.className.includes('border-current') ? themeColor : '',
      }}
    >
      <span className="flex items-center justify-center">
        {link.title}
        <ExternalLink className="h-4 w-4 ml-2 opacity-60 group-hover:opacity-100 transition-opacity" />
      </span>
    </button>
  );
};

export default LinkButton;
