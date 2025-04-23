
import React from "react";
import { Card } from "@/components/ui/card";
import { Sun, Moon, Laptop } from "lucide-react";

type ThemeType = "light" | "dark" | "system";

interface ThemeSelectorProps {
  value: ThemeType;
  onChange: (theme: ThemeType) => void;
}

export const ThemeSelector = ({ value, onChange }: ThemeSelectorProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">⚙️ Основные</h3>
      
      <div className="space-y-4">
        <div>
          <label className="flex justify-between items-center">
            <span>🌓 Тема</span>
            <select
              value={value}
              onChange={(e) => onChange(e.target.value as ThemeType)}
              className="border border-gray-300 rounded p-2 bg-background"
            >
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
              <option value="system">Системная</option>
            </select>
          </label>
        </div>
        
        <div className="flex justify-center gap-4 mt-2">
          <ThemeButton 
            icon={Sun} 
            label="Светлая" 
            isActive={value === "light"} 
            onClick={() => onChange("light")} 
          />
          <ThemeButton 
            icon={Moon} 
            label="Тёмная" 
            isActive={value === "dark"} 
            onClick={() => onChange("dark")} 
          />
          <ThemeButton 
            icon={Laptop} 
            label="Системная" 
            isActive={value === "system"} 
            onClick={() => onChange("system")} 
          />
        </div>
      </div>
    </Card>
  );
};

interface ThemeButtonProps {
  icon: React.FC<any>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const ThemeButton = ({ icon: Icon, label, isActive, onClick }: ThemeButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
        isActive 
          ? "bg-primary/20 border border-primary/30" 
          : "bg-secondary hover:bg-secondary/80 border border-border"
      }`}
    >
      <Icon className={`h-5 w-5 mb-1 ${isActive ? "text-primary" : ""}`} />
      <span className="text-xs">{label}</span>
    </button>
  );
};
