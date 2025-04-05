
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LinksTab from '@/components/dashboard/LinksTab';
import AppearanceTab from '@/components/dashboard/AppearanceTab';
import { Profile } from '@/types';
import { themes } from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';
import { useLinkData } from '@/hooks/useLinkData';
import { useProfileData } from '@/hooks/useProfileData';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('links');
  const [themeColor, setThemeColor] = useState('#9b87f5'); // Default color
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const {
    links,
    isLoading: linksLoading,
    fetchLinks,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks
  } = useLinkData(user?.id);

  const {
    fetchProfileByUsername
  } = useProfileData();

  // Get initial profile data
  const [initialProfile, setInitialProfile] = useState<Profile | null>(null);
  
  // Use the new profile settings hook
  const {
    profile,
    setProfile,
    isUpdating,
    updateTheme,
    updateButtonStyle,
    updateFontStyle
  } = useProfileSettings(initialProfile);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load user content
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchLinks();
    }
  }, [user]);

  // Update theme color when profile changes
  useEffect(() => {
    if (profile) {
      const selectedTheme = themes.find(t => t.id === profile.theme);
      if (selectedTheme) {
        setThemeColor(selectedTheme.primaryColor);
      }
    }
  }, [profile]);

  const fetchUserData = async () => {
    if (!user) return;
    setIsLoadingProfile(true);

    try {
      // First try to get the profile using the username
      if (user.username) {
        const profileData = await fetchProfileByUsername(user.username);
        if (profileData) {
          setInitialProfile(profileData.profile);
          setProfile(profileData.profile);
          setIsLoadingProfile(false);
          return;
        }
      }

      // Fallback: Get profile settings directly
      const { data: settingsData, error: settingsError } = await supabase
        .from('profile_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError) throw settingsError;

      // Get social links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', user.id);

      if (socialError) throw socialError;

      const socialLinks = socialData?.map(link => ({
        platform: link.platform,
        url: link.url
      })) || [];

      // Create profile object
      const profileData: Profile = {
        id: user.id,
        userId: user.id,
        theme: settingsData?.theme || 'purple',
        backgroundColor: settingsData?.background_color || undefined,
        backgroundImage: settingsData?.background_image || undefined,
        buttonStyle: settingsData?.button_style || 'filled',
        fontStyle: settingsData?.font_style || 'sans',
        socialLinks: socialLinks,
        createdAt: settingsData?.created_at || new Date().toISOString(),
        updatedAt: settingsData?.updated_at || new Date().toISOString()
      };

      setInitialProfile(profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your profile settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleAddLink = async (data: { title: string; url: string }) => {
    if (user) {
      const newLink = await addLink(data.title, data.url);
      if (newLink) {
        toast({
          title: 'Link Added',
          description: 'Your link has been added successfully',
        });
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="links">My Links</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="links" className="mt-4">
            <LinksTab 
              links={links}
              isLoading={linksLoading}
              onAdd={handleAddLink}
              onUpdate={updateLink}
              onDelete={deleteLink}
              onReorder={reorderLinks}
            />
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-4">
            <AppearanceTab 
              profile={profile}
              isUpdating={isUpdating || isLoadingProfile}
              themeColor={themeColor}
              onThemeChange={updateTheme}
              onButtonStyleChange={updateButtonStyle}
              onFontStyleChange={updateFontStyle}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
