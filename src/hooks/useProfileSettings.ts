
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types';
import { updateProfileSettings } from '@/services/supabaseService';

export function useProfileSettings(initialProfile: Profile | null) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateTheme = async (themeId: string) => {
    if (!profile?.userId) return false;
    
    setIsUpdating(true);
    try {
      const success = await updateProfileSettings(profile.userId, { theme: themeId });
      
      if (success) {
        // Update local state
        setProfile(prev => prev ? {
          ...prev,
          theme: themeId,
          updatedAt: new Date().toISOString()
        } : null);
        
        toast({
          title: 'Theme updated',
          description: 'Your profile theme has been updated',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error updating theme:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update theme. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateButtonStyle = async (styleId: string) => {
    if (!profile?.userId) return false;
    
    setIsUpdating(true);
    try {
      const success = await updateProfileSettings(profile.userId, { buttonStyle: styleId });
      
      if (success) {
        // Update local state
        setProfile(prev => prev ? {
          ...prev,
          buttonStyle: styleId,
          updatedAt: new Date().toISOString()
        } : null);
        
        toast({
          title: 'Button style updated',
          description: 'Your profile button style has been updated',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error updating button style:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update button style. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateFontStyle = async (fontId: string) => {
    if (!profile?.userId) return false;
    
    setIsUpdating(true);
    try {
      const success = await updateProfileSettings(profile.userId, { fontStyle: fontId });
      
      if (success) {
        // Update local state
        setProfile(prev => prev ? {
          ...prev,
          fontStyle: fontId,
          updatedAt: new Date().toISOString()
        } : null);
        
        toast({
          title: 'Font style updated',
          description: 'Your profile font style has been updated',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error updating font style:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update font style. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    setProfile,
    isUpdating,
    updateTheme,
    updateButtonStyle,
    updateFontStyle
  };
}
