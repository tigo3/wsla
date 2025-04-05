
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LinkButton from '@/components/profile/LinkButton';
import SocialLinks from '@/components/profile/SocialLinks';
import { User, Link, Profile } from '@/types';
import { themes, fontStyles } from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useProfileData } from '@/hooks/useProfileData';
import { recordLinkClick } from '@/services/supabaseService';
import { Card, CardContent } from '@/components/ui/card';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchProfileByUsername, isLoading: profileLoading } = useProfileData();
  
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [themeColor, setThemeColor] = useState('#9b87f5'); // Default purple

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      
      if (!username) {
        toast({
          title: 'Error',
          description: 'No username provided',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      
      try {
        const profileData = await fetchProfileByUsername(username);
        
        if (profileData) {
          // Ensure userData has all required properties for User type
          setUser(profileData.userData);
          setProfile(profileData.profile);
          setLinks(profileData.links);
          
          // Set theme color
          const selectedTheme = themes.find(t => t.id === profileData.profile.theme);
          if (selectedTheme) {
            setThemeColor(selectedTheme.primaryColor);
          }
        } else {
          toast({
            title: 'Profile not found',
            description: `No profile found for username: ${username}`,
            variant: 'destructive',
          });
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
  }, [username, toast, fetchProfileByUsername, navigate]);

  const handleLinkClick = async (linkId: string) => {
    try {
      await recordLinkClick(linkId);
    } catch (error) {
      console.error('Error recording link click:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-20 w-20 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center">
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
        </Card>
      </div>
    );
  }

  // Get font family based on profile settings
  const fontStyle = fontStyles.find(f => f.id === profile.fontStyle) || fontStyles[0];

  // Determine if the background is dark to adjust text color
  const backgroundIsDark = profile.backgroundColor?.startsWith('#0') || 
                           profile.backgroundColor?.startsWith('#1') ||
                           profile.backgroundColor?.startsWith('#2');

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-12 px-4 bg-cover bg-center bg-no-repeat"
      style={{ 
        fontFamily: fontStyle.fontFamily,
        background: profile.backgroundImage || profile.backgroundColor || 'transparent',
        color: backgroundIsDark ? 'white' : 'inherit'
      }}
    >
      <Card 
        className="w-full max-w-md mx-auto rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 backdrop-blur-sm"
        style={{ 
          backgroundColor: backgroundIsDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
          color: backgroundIsDark ? 'white' : 'var(--foreground)',
        }}
      >
        <CardContent className="p-8">
          <ProfileHeader user={user} />
          
          <SocialLinks 
            socialLinks={profile.socialLinks} 
            themeColor={themeColor}
          />
          
          {links.length > 0 ? (
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
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No links have been added yet
            </div>
          )}
          
          <div className="mt-10 pt-6 border-t text-center">
            <a 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Powered by Linkly
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
