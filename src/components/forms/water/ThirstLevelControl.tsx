
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface ThirstLevelControlProps {
  thirstLevel: number;
  onThirstLevelChange: (level: number) => void;
}

export const ThirstLevelControl = ({ thirstLevel, onThirstLevelChange }: ThirstLevelControlProps) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">
        Уровень жажды: {thirstLevel}
      </label>
      <Slider 
        min={1} 
        max={10} 
        step={1} 
        value={[thirstLevel]} 
        onValueChange={(values) => onThirstLevelChange(values[0])}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Не хочу пить (1)</span>
        <span>Сильная жажда (10)</span>
      </div>
    </div>
  );
};
