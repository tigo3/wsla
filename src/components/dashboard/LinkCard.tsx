
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/types';
import { Edit, Trash2, ExternalLink, GripVertical } from 'lucide-react';
import LinkForm from './LinkForm';

interface LinkCardProps {
  link: Link;
  onUpdate: (linkId: string, data: { title: string; url: string }) => void;
  onDelete: (linkId: string) => void;
  isDragging?: boolean;
}

const LinkCard: React.FC<LinkCardProps> = ({
  link,
  onUpdate,
  onDelete,
  isDragging,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (data: { title: string; url: string }) => {
    onUpdate(link.id, data);
    setIsEditing(false);
  };

  const truncateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname.length > 1 ? urlObj.pathname : ''}`;
    } catch {
      return url;
    }
  };

  if (isEditing) {
    return (
      <Card className={`mb-4 ${isDragging ? 'border-brand-purple shadow-md' : ''}`}>
        <CardContent className="p-4">
          <LinkForm
            link={link}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`mb-4 ${isDragging ? 'border-brand-purple shadow-md' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="cursor-move touch-none">
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium truncate">{link.title}</h3>
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-muted-foreground flex items-center hover:underline"
              >
                <span className="truncate">{truncateUrl(link.url)}</span>
                <ExternalLink className="h-3 w-3 ml-1 inline" />
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">{link.clicks} clicks</span>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(link.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
