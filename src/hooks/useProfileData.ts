
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Profile, SocialLink } from '@/types';
import { updateProfileSettings } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';

export function useProfileData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfileByUsername = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        
        // Handle the specific case where the profile is not found
        if (profileError.code === 'PGRST116') {
          setError(`Profile not found for username: ${username}`);
          setIsLoading(false);
          return null;
        }
        
        throw profileError;
      }

      // Continue with fetching related data
      const { data: settingsData, error: settingsError } = await supabase
        .from('profile_settings')
        .select('*')
        .eq('user_id', profileData.id)
        .single();

      if (settingsError) throw settingsError;

      // Get the user's social links
      const { data: socialData, error: socialError } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', profileData.id);

      if (socialError) throw socialError;

      // Get the user's links
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', profileData.id)
        .order('order_number', { ascending: true });

      if (linksError) throw linksError;

      // Get the auth user to retrieve the email
      const { data: authData } = await supabase.auth.getUser();
      const userEmail = authData?.user?.email || '';

      // Format the social links
      const socialLinks: SocialLink[] = socialData?.map(link => ({
        platform: link.platform,
        url: link.url
      })) || [];

      // Format the profile data
      const formattedProfile: Profile = {
        id: profileData.id,
        userId: profileData.id,
        theme: settingsData?.theme || 'purple',
        backgroundColor: settingsData?.background_color,
        backgroundImage: settingsData?.background_image,
        buttonStyle: settingsData?.button_style || 'filled',
        fontStyle: settingsData?.font_style || 'sans',
        socialLinks,
        createdAt: profileData.created_at,
        updatedAt: profileData.updated_at
      };

      setProfile(formattedProfile);
      
      // Record a profile visit
      await recordProfileVisit(profileData.id);
      
      return {
        profile: formattedProfile,
        userData: {
          id: profileData.id,
          email: userEmail,
          username: profileData.username,
          displayName: profileData.display_name,
          bio: profileData.bio,
          profileImage: profileData.profile_image,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at
        },
        links: linksData?.map(link => ({
          id: link.id,
          userId: link.user_id,
          title: link.title,
          url: link.url,
          order: link.order_number,
          clicks: link.clicks,
          createdAt: link.created_at,
          updatedAt: link.updated_at
        })) || []
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfileSettingsData = useCallback(async (
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
          backgroundColor: settings.backgroundColor || profile.backgroundColor,
          backgroundImage: settings.backgroundImage || profile.backgroundImage,
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
  }, [profile, toast]);

  const updateSocialLinks = useCallback(async (userId: string, socialLinks: SocialLink[]) => {
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
  }, [profile, toast]);

  const recordProfileVisit = useCallback(async (profileId: string | undefined) => {
    if (!profileId) return;
    
    try {
      await supabase
        .from('profile_visits')
        .insert([{ profile_id: profileId }]);
    } catch (error) {
      console.error('Error recording profile visit:', error);
      // Don't show a toast for this operation
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    fetchProfileByUsername,
    updateProfileSettings: updateProfileSettingsData,
    updateSocialLinks
  };
}
