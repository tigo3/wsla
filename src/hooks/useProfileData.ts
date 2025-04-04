
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Profile, SocialLink } from '@/types';

export function useProfileData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfileByUsername = async (username: string) => {
    setIsLoading(true);
    try {
      // Fetch the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;

      // Fetch the user's profile settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('profile_settings')
        .select('*')
        .eq('user_id', profileData.id)
        .single();

      if (settingsError) throw settingsError;

      // Fetch the user's social links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', profileData.id);

      if (socialError) throw socialError;

      // Transform the social links data
      const socialLinks: SocialLink[] = socialData.map(link => ({
        platform: link.platform,
        url: link.url
      }));

      // Combine all data into a Profile object
      const fullProfile: Profile = {
        id: profileData.id,
        userId: profileData.id,
        theme: settingsData.theme,
        backgroundColor: settingsData.background_color || undefined,
        backgroundImage: settingsData.background_image || undefined,
        buttonStyle: settingsData.button_style,
        fontStyle: settingsData.font_style,
        socialLinks: socialLinks,
        createdAt: profileData.created_at,
        updatedAt: profileData.updated_at
      };

      setProfile(fullProfile);
      
      // Record a profile visit
      await recordProfileVisit(profileData.id);
      
      return {
        profile: fullProfile,
        userData: {
          id: profileData.id,
          username: profileData.username,
          displayName: profileData.display_name,
          bio: profileData.bio,
          profileImage: profileData.profile_image,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at
        }
      };
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

  const updateProfileSettings = async (
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
      const { error } = await supabase
        .from('profile_settings')
        .update({
          theme: settings.theme,
          button_style: settings.buttonStyle,
          font_style: settings.fontStyle,
          background_color: settings.backgroundColor,
          background_image: settings.backgroundImage,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state if we have it
      if (profile && profile.userId === userId) {
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

      return true;
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

  const recordProfileVisit = async (profileId: string) => {
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
    updateProfileSettings,
    updateSocialLinks
  };
}
