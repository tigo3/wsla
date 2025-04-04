
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { fontStyles } from '@/services/mockDataService';

interface FontStyleSelectorProps {
  currentFont: string;
  onFontChange: (fontId: string) => void;
}

const FontStyleSelector: React.FC<FontStyleSelectorProps> = ({
  currentFont,
  onFontChange,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Font Style</h3>
        <RadioGroup
          value={currentFont}
          onValueChange={onFontChange}
          className="grid grid-cols-3 gap-2"
        >
          {fontStyles.map((font) => (
            <div
              key={font.id}
              className={`relative border rounded-lg p-2 cursor-pointer hover:bg-accent transition-colors ${
                currentFont === font.id ? 'border-ring ring-2 ring-ring ring-offset-2' : 'border-input'
              }`}
              onClick={() => onFontChange(font.id)}
            >
              <div className="absolute top-2 left-2">
                <RadioGroupItem value={font.id} id={`font-${font.id}`} className="sr-only" />
              </div>
              <div className="flex flex-col items-center space-y-2 pt-2">
                <div
                  className="w-full py-2 px-4 text-center"
                  style={{ fontFamily: font.fontFamily }}
                >
                  Aa
                </div>
                <Label htmlFor={`font-${font.id}`} className="text-center">
                  {font.name}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default FontStyleSelector;
