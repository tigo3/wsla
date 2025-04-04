
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { buttonStyles } from '@/services/mockDataService';

interface ButtonStyleSelectorProps {
  currentStyle: string;
  onStyleChange: (styleId: string) => void;
  themeColor: string;
}

const ButtonStyleSelector: React.FC<ButtonStyleSelectorProps> = ({
  currentStyle,
  onStyleChange,
  themeColor,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Button Style</h3>
        <RadioGroup
          value={currentStyle}
          onValueChange={onStyleChange}
          className="grid grid-cols-2 gap-2"
        >
          {buttonStyles.map((style) => (
            <div
              key={style.id}
              className={`relative border rounded-lg p-2 cursor-pointer hover:bg-accent transition-colors ${
                currentStyle === style.id ? 'border-ring ring-2 ring-ring ring-offset-2' : 'border-input'
              }`}
              onClick={() => onStyleChange(style.id)}
            >
              <div className="absolute top-2 left-2">
                <RadioGroupItem value={style.id} id={`style-${style.id}`} className="sr-only" />
              </div>
              <div className="flex flex-col items-center space-y-2 pt-2">
                <div
                  className={`w-full py-2 px-4 rounded-lg text-center text-sm ${style.className}`}
                  style={{ 
                    color: style.className.includes('text-current') ? themeColor : '',
                    backgroundColor: style.className.includes('bg-current') ? themeColor : '',
                    borderColor: style.className.includes('border-current') ? themeColor : '',
                  }}
                >
                  {style.name}
                </div>
                <Label htmlFor={`style-${style.id}`} className="text-center">
                  {style.name}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ButtonStyleSelector;
