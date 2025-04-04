
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Profile, SocialLink } from '@/types';
import { getProfileByUsername, updateProfileSettings } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';

export function useProfileData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfileByUsername = async (username: string) => {
    setIsLoading(true);
    try {
      const data = await getProfileByUsername(username);
      
      if (data) {
        setProfile(data.profile);
        
        // Record a profile visit
        await recordProfileVisit(data.userData.id);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileSettingsData = async (
    userId: string, 
    settings: { 
      theme?: string; 
      buttonStyle?: string; 
      fontStyle?: string;
      backgroundColor?: string;
      backgroundImage?: string;
    }
  ) => {
    try {
      const success = await updateProfileSettings(userId, settings);

      // Update local state if we have it
      if (success && profile && profile.userId === userId) {
        setProfile({
          ...profile,
          theme: settings.theme || profile.theme,
          buttonStyle: settings.buttonStyle || profile.buttonStyle,
          fontStyle: settings.fontStyle || profile.fontStyle,
          backgroundColor: settings.backgroundColor,
          backgroundImage: settings.backgroundImage,
          updatedAt: new Date().toISOString()
        });
      }

      return success;
    } catch (error) {
      console.error('Error updating profile settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile settings. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateSocialLinks = async (userId: string, socialLinks: SocialLink[]) => {
    try {
      // First remove all existing social links
      const { error: deleteError } = await supabase
        .from('social_links')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Only insert new links if there are any
      if (socialLinks.length > 0) {
        // Format the social links for insertion
        const linksToInsert = socialLinks.map(link => ({
          user_id: userId,
          platform: link.platform,
          url: link.url
        }));

        const { error: insertError } = await supabase
          .from('social_links')
          .insert(linksToInsert);

        if (insertError) throw insertError;
      }

      // Update local state if we have it
      if (profile && profile.userId === userId) {
        setProfile({
          ...profile,
          socialLinks,
          updatedAt: new Date().toISOString()
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating social links:', error);
      toast({
        title: 'Error',
        description: 'Failed to update social links. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const recordProfileVisit = async (profileId: string | undefined) => {
    if (!profileId) return;
    
    try {
      await supabase
        .from('profile_visits')
        .insert([{ profile_id: profileId }]);
    } catch (error) {
      console.error('Error recording profile visit:', error);
      // Don't show a toast for this operation
    }
  };

  return {
    profile,
    isLoading,
    fetchProfileByUsername,
    updateProfileSettings: updateProfileSettingsData,
    updateSocialLinks
  };
}
