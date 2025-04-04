
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { themes } from '@/services/mockDataService';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Theme</h3>
        <RadioGroup
          value={currentTheme}
          onValueChange={onThemeChange}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative border rounded-lg p-2 cursor-pointer hover:bg-accent transition-colors ${
                currentTheme === theme.id ? 'border-ring ring-2 ring-ring ring-offset-2' : 'border-input'
              }`}
              onClick={() => onThemeChange(theme.id)}
            >
              <div className="absolute top-2 left-2">
                <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} className="sr-only" />
              </div>
              <div className="flex flex-col items-center space-y-2 pt-2">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <Label htmlFor={`theme-${theme.id}`} className="text-center">
                  {theme.name}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
