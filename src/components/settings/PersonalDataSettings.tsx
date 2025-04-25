
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PersonalDataSettingsProps {
  height: number;
  weight: number;
  onChange: (key: string, value: number) => void;
}

export const PersonalDataSettings = ({ height, weight, onChange }: PersonalDataSettingsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Обработчик изменения с валидацией
  const handleChange = (key: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(key, numValue);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">📦 Личные данные</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Рост (см)</label>
            <Input
              type="number"
              value={height}
              onChange={(e) => handleChange("height", e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Вес (кг)</label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Используется для расчёта рекомендаций по воде
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
