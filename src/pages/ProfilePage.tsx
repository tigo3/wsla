import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LinkButton from '@/components/profile/LinkButton';
import SocialLinks from '@/components/profile/SocialLinks';
import { User, Link, Profile } from '@/types';
import { themes, fontStyles } from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useProfileData } from '@/hooks/useProfileData';
import { useLinkData } from '@/hooks/useLinkData';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const { fetchProfileByUsername, isLoading: profileLoading } = useProfileData();
  
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [themeColor, setThemeColor] = useState('#9b87f5'); // Default purple

  const { fetchLinks: fetchUserLinks, recordLinkClick } = useLinkData(user?.id);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        if (username) {
          const profileData = await fetchProfileByUsername(username);
          
          if (profileData) {
            setUser({
              id: profileData.userData.id,
              username: profileData.userData.username,
              email: '', // We don't expose email publicly
              displayName: profileData.userData.displayName,
              bio: profileData.userData.bio,
              profileImage: profileData.userData.profileImage,
              createdAt: profileData.userData.createdAt,
              updatedAt: profileData.userData.updatedAt
            });
            
            setProfile(profileData.profile);
            
            // Set theme color
            const selectedTheme = themes.find(t => t.id === profileData.profile.theme);
            if (selectedTheme) {
              setThemeColor(selectedTheme.primaryColor);
            }
            
            // Now fetch the user's links
            const { data, error } = await supabase
              .from('links')
              .select('*')
              .eq('user_id', profileData.userData.id)
              .order('order_number', { ascending: true });
            
            if (error) throw error;
            
            // Format links from database format to our app format
            const formattedLinks = data.map(link => ({
              id: link.id,
              userId: link.user_id,
              title: link.title,
              url: link.url,
              order: link.order_number,
              clicks: link.clicks,
              createdAt: link.created_at,
              updatedAt: link.updated_at
            }));
            
            setLinks(formattedLinks);
          } else {
            toast({
              title: 'Profile not found',
              description: `No profile found for username: ${username}`,
              variant: 'destructive',
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [username, toast, fetchProfileByUsername]);

  const handleLinkClick = (linkId: string) => {
    recordLinkClick(linkId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <a href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </a>
        </Button>
      </div>
    );
  }

  // Get font family based on profile settings
  const fontStyle = fontStyles.find(f => f.id === profile.fontStyle) || fontStyles[0];

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-12 px-4"
      style={{ 
        fontFamily: fontStyle.fontFamily,
        background: profile.backgroundImage || profile.backgroundColor || 'transparent',
      }}
    >
      <div 
        className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border p-8"
        style={{ 
          color: 'var(--foreground)',
        }}
      >
        <ProfileHeader user={user} />
        
        <SocialLinks 
          socialLinks={profile.socialLinks} 
          themeColor={themeColor}
        />
        
        <div className="space-y-3 mt-6">
          {links.map((link) => (
            <LinkButton
              key={link.id}
              link={link}
              userId={user.id}
              buttonStyle={profile.buttonStyle}
              themeColor={themeColor}
              onLinkClick={() => handleLinkClick(link.id)}
            />
          ))}
        </div>
        
        <div className="mt-10 pt-6 border-t text-center">
          <a 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Powered by Linkly
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
