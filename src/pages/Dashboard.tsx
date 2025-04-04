
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LinkCard from '@/components/dashboard/LinkCard';
import LinkForm from '@/components/dashboard/LinkForm';
import ThemeSelector from '@/components/dashboard/ThemeSelector';
import ButtonStyleSelector from '@/components/dashboard/ButtonStyleSelector';
import FontStyleSelector from '@/components/dashboard/FontStyleSelector';
import { Link, Profile } from '@/types';
import { themes } from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { useLinkData } from '@/hooks/useLinkData';
import { useProfileData } from '@/hooks/useProfileData';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('links');
  const [themeColor, setThemeColor] = useState('#9b87f5'); // Default color

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
    updateProfileSettings
  } = useProfileData();

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

    try {
      // Get profile settings
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

      const socialLinks = socialData.map(link => ({
        platform: link.platform,
        url: link.url
      }));

      // Create profile object
      const profileData: Profile = {
        id: settingsData.id,
        userId: user.id,
        theme: settingsData.theme,
        backgroundColor: settingsData.background_color || undefined,
        backgroundImage: settingsData.background_image || undefined,
        buttonStyle: settingsData.button_style,
        fontStyle: settingsData.font_style,
        socialLinks: socialLinks,
        createdAt: settingsData.created_at,
        updatedAt: settingsData.updated_at
      };

      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your profile settings',
        variant: 'destructive',
      });
    }
  };

  const handleAddLink = async (data: { title: string; url: string }) => {
    if (user) {
      const newLink = await addLink(data.title, data.url);
      if (newLink) {
        setIsAddLinkDialogOpen(false);
        toast({
          title: 'Link Added',
          description: 'Your link has been added successfully',
        });
      }
    }
  };

  const handleUpdateLink = async (linkId: string, data: { title: string; url: string }) => {
    try {
      const success = await updateLink(linkId, data);
      if (success) {
        toast({
          title: 'Link Updated',
          description: 'Your link has been updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating link:', error);
      // Toast already shown in the hook
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const success = await deleteLink(linkId);
      if (success) {
        toast({
          title: 'Success',
          description: 'Link deleted successfully',
        });
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      // Toast already shown in the hook
    }
  };

  const handleThemeChange = async (themeId: string) => {
    if (user && profile) {
      const success = await updateProfileSettings(user.id, { theme: themeId });
      
      if (success) {
        // Update local state
        setProfile({
          ...profile,
          theme: themeId
        });
        
        // Update theme color
        const selectedTheme = themes.find(t => t.id === themeId);
        if (selectedTheme) {
          setThemeColor(selectedTheme.primaryColor);
        }
        
        toast({
          title: 'Theme updated',
          description: 'Your profile theme has been updated',
        });
      }
    }
  };

  const handleButtonStyleChange = async (styleId: string) => {
    if (user && profile) {
      const success = await updateProfileSettings(user.id, { buttonStyle: styleId });
      
      if (success) {
        // Update local state
        setProfile({
          ...profile,
          buttonStyle: styleId
        });
        
        toast({
          title: 'Button style updated',
          description: 'Your profile button style has been updated',
        });
      }
    }
  };

  const handleFontStyleChange = async (fontId: string) => {
    if (user && profile) {
      const success = await updateProfileSettings(user.id, { fontStyle: fontId });
      
      if (success) {
        // Update local state
        setProfile({
          ...profile,
          fontStyle: fontId
        });
        
        toast({
          title: 'Font style updated',
          description: 'Your profile font style has been updated',
        });
      }
    }
  };

  if (!user || !profile) {
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
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Links</h2>
                <Button onClick={() => setIsAddLinkDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Link
                </Button>
              </div>
              
              {links.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <h3 className="text-lg font-medium mb-2">No links yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first link to get started</p>
                  <Button onClick={() => setIsAddLinkDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Link
                  </Button>
                </div>
              ) : (
                <div>
                  {links.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onUpdate={handleUpdateLink}
                      onDelete={handleDeleteLink}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-4">
            <div className="max-w-3xl mx-auto grid gap-8">
              <h2 className="text-2xl font-bold">Customize Appearance</h2>
              
              <ThemeSelector 
                currentTheme={profile.theme} 
                onThemeChange={handleThemeChange} 
              />
              
              <ButtonStyleSelector 
                currentStyle={profile.buttonStyle} 
                onStyleChange={handleButtonStyleChange} 
                themeColor={themeColor}
              />
              
              <FontStyleSelector 
                currentFont={profile.fontStyle} 
                onFontChange={handleFontStyleChange} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={isAddLinkDialogOpen} onOpenChange={setIsAddLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
          </DialogHeader>
          <LinkForm onSubmit={handleAddLink} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
