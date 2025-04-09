
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import LinksTab from '@/components/dashboard/LinksTab';
import AppearanceTab from '@/components/dashboard/AppearanceTab';
import { Profile, Link } from '@/types';
import { themes } from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';
import { useLinkData } from '@/hooks/useLinkData';
import { useProfileData } from '@/hooks/useProfileData';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardWelcome from '@/components/dashboard/DashboardWelcome';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('links');
  const [themeColor, setThemeColor] = useState('#9b87f5'); // Default color
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [initialProfile, setInitialProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    links,
    isLoading: linksLoading,
    error: linksError,
    fetchLinks,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks
  } = useLinkData(user?.id);

  const {
    fetchProfileByUsername
  } = useProfileData();
  
  // Use the profile settings hook
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

  // Update theme color when profile changes
  useEffect(() => {
    if (profile) {
      const selectedTheme = themes.find(t => t.id === profile.theme);
      if (selectedTheme) {
        setThemeColor(selectedTheme.primaryColor);
      }
    }
  }, [profile]);

  // Calculate total clicks
  const totalClicks = links.reduce((total, link) => total + link.clicks, 0);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    setIsLoadingProfile(true);
    setProfileError(null);

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
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setProfileError('Network connection issue. Unable to load your profile settings.');
      } else {
        setProfileError('Failed to load your profile settings');
        toast({
          title: 'Error',
          description: 'Failed to load your profile settings',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user, fetchProfileByUsername, setProfile, toast]);

  // Load user content
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchLinks();
    }
  }, [user, fetchUserData, fetchLinks]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    Promise.all([fetchUserData(), fetchLinks()])
      .finally(() => {
        setIsRefreshing(false);
      });
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

  // Add wrapper functions to convert Promise<boolean> to Promise<void>
  const handleUpdateLink = async (linkId: string, data: { title: string; url: string }) => {
    return await updateLink(linkId, data);
  };

  const handleDeleteLink = async (linkId: string) => {
    return await deleteLink(linkId);
  };

  const handleReorderLinks = async (links: Link[]) => {
    return await reorderLinks(links);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2.5"></div>
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <main className="container mx-auto py-6 px-4">
        <DashboardWelcome 
          user={user} 
          linkCount={links.length} 
          totalClicks={totalClicks} 
        />
        
        {profileError && (
          <Alert 
            variant={profileError.includes('Network') ? "warning" : "destructive"} 
            className="mb-4"
          >
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>{profileError.includes('Network') ? "Connection Issue" : "Error"}</AlertTitle>
            <AlertDescription className="mt-2">
              {profileError}
              {profileError.includes('Network') && (
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Retry Now'}
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="links" className="text-sm font-medium">
              My Links
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-sm font-medium">
              Appearance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="links" className="mt-4 animate-fade-in">
            <LinksTab 
              links={links}
              isLoading={linksLoading || isRefreshing}
              error={linksError}
              onAdd={handleAddLink}
              onUpdate={handleUpdateLink}
              onDelete={handleDeleteLink}
              onReorder={handleReorderLinks}
              onRefresh={handleRefresh}
            />
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-4 animate-fade-in">
            <AppearanceTab 
              profile={profile}
              isUpdating={isUpdating || isLoadingProfile || isRefreshing}
              themeColor={themeColor}
              onThemeChange={updateTheme}
              onButtonStyleChange={updateButtonStyle}
              onFontStyleChange={updateFontStyle}
            />
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
