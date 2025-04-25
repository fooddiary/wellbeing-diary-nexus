
import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface WidgetControlsProps {
  waterWidget: boolean;
  mealCountWidget: boolean;
  weightWidget: boolean;
  onChange: (key: string, value: boolean) => void;
}

export const WidgetControls = ({ 
  waterWidget, 
  mealCountWidget, 
  weightWidget, 
  onChange 
}: WidgetControlsProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">📊 Управление виджетами</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="pr-2">💧 Индикатор воды</span>
          <Switch 
            checked={waterWidget}
            onCheckedChange={(checked) => onChange("waterWidget", checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="pr-2">🍽️ Счётчик приёмов пищи</span>
          <Switch 
            checked={mealCountWidget}
            onCheckedChange={(checked) => onChange("mealCountWidget", checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="pr-2">⚖️ Вес</span>
          <Switch 
            checked={weightWidget}
            onCheckedChange={(checked) => onChange("weightWidget", checked)}
          />
        </div>
      </div>
    </Card>
  );
};
