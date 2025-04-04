
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  // Get the user's initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <Avatar className="w-20 h-20 mb-4">
        <AvatarImage src={user.profileImage} alt={user.displayName || user.username} />
        <AvatarFallback>{getInitials(user.displayName || user.username)}</AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold">{user.displayName || user.username}</h1>
      {user.bio && <p className="text-muted-foreground text-center mt-2 max-w-md">{user.bio}</p>}
    </div>
  );
};

export default ProfileHeader;
