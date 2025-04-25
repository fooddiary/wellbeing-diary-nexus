
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";

type ThemeType = "light" | "dark" | "system";

interface ThemeSelectorProps {
  value: ThemeType;
  onChange: (theme: ThemeType) => void;
}

export const ThemeSelector = ({ value, onChange }: ThemeSelectorProps) => {
  const { theme, setTheme } = useTheme();
  
  // Синхронизируем внутреннее состояние с внешним
  useEffect(() => {
    if (value !== theme) {
      onChange(theme);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    onChange(newTheme);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">⚙️ Основные</h3>
      <div className="space-y-4">
        <div>
          <label className="flex justify-between items-center">
            <span>🌓 Тема</span>
            <select
              value={value}
              onChange={(e) => handleThemeChange(e.target.value as ThemeType)}
              className="border border-gray-300 rounded p-2 bg-background"
            >
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
              <option value="system">Системная</option>
            </select>
          </label>
        </div>
      </div>
    </Card>
  );
};
