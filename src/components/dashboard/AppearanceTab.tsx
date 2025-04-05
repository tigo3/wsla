
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ThemeSelector from '@/components/dashboard/ThemeSelector';
import ButtonStyleSelector from '@/components/dashboard/ButtonStyleSelector';
import FontStyleSelector from '@/components/dashboard/FontStyleSelector';
import { Profile } from '@/types';

interface AppearanceTabProps {
  profile: Profile | null;
  isUpdating: boolean;
  themeColor: string;
  onThemeChange: (themeId: string) => Promise<boolean>;
  onButtonStyleChange: (styleId: string) => Promise<boolean>;
  onFontStyleChange: (fontId: string) => Promise<boolean>;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({
  profile,
  isUpdating,
  themeColor,
  onThemeChange,
  onButtonStyleChange,
  onFontStyleChange
}) => {
  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto grid gap-8">
        <h2 className="text-2xl font-bold">Customize Appearance</h2>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto grid gap-8">
      <h2 className="text-2xl font-bold">Customize Appearance</h2>
      
      <ThemeSelector 
        currentTheme={profile.theme} 
        onThemeChange={onThemeChange}
        isLoading={isUpdating}
      />
      
      <ButtonStyleSelector 
        currentStyle={profile.buttonStyle} 
        onStyleChange={onButtonStyleChange} 
        themeColor={themeColor}
        isLoading={isUpdating}
      />
      
      <FontStyleSelector 
        currentFont={profile.fontStyle} 
        onFontChange={onFontStyleChange}
        isLoading={isUpdating} 
      />
    </div>
  );
};

export default AppearanceTab;
