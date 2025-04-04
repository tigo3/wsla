
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
import { 
  getLinks, addLink, updateLink, deleteLink, reorderLinks,
  getProfile, updateProfile, themes,
  initializeMockData
} from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [links, setLinks] = useState<Link[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('links');
  const [themeColor, setThemeColor] = useState('#9b87f5'); // Default color

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Initialize data and load user content
  useEffect(() => {
    if (user) {
      initializeMockData(user.id);
      loadUserContent();
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

  const loadUserContent = () => {
    if (user) {
      const userLinks = getLinks(user.id);
      const userProfile = getProfile(user.id);
      
      setLinks(userLinks);
      setProfile(userProfile);
    }
  };

  const handleAddLink = (data: { title: string; url: string }) => {
    if (user) {
      const newLink = addLink(user.id, data.title, data.url);
      setLinks([...links, newLink]);
      setIsAddLinkDialogOpen(false);
    }
  };

  const handleUpdateLink = (linkId: string, data: { title: string; url: string }) => {
    try {
      const updatedLink = updateLink(linkId, data);
      setLinks(links.map(link => link.id === linkId ? updatedLink : link));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update link',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteLink = (linkId: string) => {
    try {
      deleteLink(linkId);
      setLinks(links.filter(link => link.id !== linkId));
      toast({
        title: 'Success',
        description: 'Link deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete link',
        variant: 'destructive',
      });
    }
  };

  const handleThemeChange = (themeId: string) => {
    if (user && profile) {
      const updatedProfile = updateProfile(user.id, { theme: themeId });
      setProfile(updatedProfile);
      
      const selectedTheme = themes.find(t => t.id === themeId);
      if (selectedTheme) {
        setThemeColor(selectedTheme.primaryColor);
      }
      
      toast({
        title: 'Theme updated',
        description: 'Your profile theme has been updated',
      });
    }
  };

  const handleButtonStyleChange = (styleId: string) => {
    if (user && profile) {
      const updatedProfile = updateProfile(user.id, { buttonStyle: styleId });
      setProfile(updatedProfile);
      
      toast({
        title: 'Button style updated',
        description: 'Your profile button style has been updated',
      });
    }
  };

  const handleFontStyleChange = (fontId: string) => {
    if (user && profile) {
      const updatedProfile = updateProfile(user.id, { fontStyle: fontId });
      setProfile(updatedProfile);
      
      toast({
        title: 'Font style updated',
        description: 'Your profile font style has been updated',
      });
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
