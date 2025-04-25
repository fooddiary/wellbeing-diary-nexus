
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/ui/sonner";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { WidgetControls } from "@/components/settings/WidgetControls";
import { PersonalDataSettings } from "@/components/settings/PersonalDataSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ScrollArea } from "@/components/ui/scroll-area";

const SettingsPage = () => {
  const [appState, appActions] = useAppStore();
  const [settings, setSettings] = useState({
    theme: appState.settings.theme || "light",
    waterWidget: appState.settings.waterWidget !== undefined ? appState.settings.waterWidget : true,
    mealCountWidget: appState.settings.mealCountWidget !== undefined ? appState.settings.mealCountWidget : true,
    weightWidget: appState.settings.weightWidget !== undefined ? appState.settings.weightWidget : true,
    height: appState.settings.height || 170,
    weight: appState.settings.weight || 70,
  });
  
  // Загружаем актуальные настройки при монтировании компонента
  useEffect(() => {
    // Ниже синхронизируем локальное состояние при изменении глобального
    setSettings({
      theme: appState.settings.theme || "light",
      waterWidget: appState.settings.waterWidget !== undefined ? appState.settings.waterWidget : true,
      mealCountWidget: appState.settings.mealCountWidget !== undefined ? appState.settings.mealCountWidget : true,
      weightWidget: appState.settings.weightWidget !== undefined ? appState.settings.weightWidget : true,
      height: appState.settings.height || 170,
      weight: appState.settings.weight || 70,
    });
  }, [appState.settings]);
  
  // Немедленно примененяем изменения при обновлении настроек
  const handleSettingChange = async (change: Partial<typeof settings>) => {
    const newSettings = { ...settings, ...change };
    setSettings(newSettings);
    
    // Применяем изменения сразу
    try {
      await appActions.updateSettings(change);
    } catch (error) {
      console.error("Ошибка при обновлении настроек:", error);
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      await appActions.updateSettings(settings);
      toast.success("Настройки сохранены!");
    } catch (error) {
      toast.error("Не удалось сохранить настройки");
      console.error("Ошибка при сохранении настроек:", error);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-6 px-2 sm:px-4 pb-6">
        <h2 className="text-2xl font-bold mb-6">Настройки</h2>
        
        <div className="space-y-6">
          <ThemeSelector 
            value={settings.theme} 
            onChange={(theme) => handleSettingChange({theme})} 
          />
          
          <WidgetControls 
            waterWidget={settings.waterWidget}
            mealCountWidget={settings.mealCountWidget}
            weightWidget={settings.weightWidget}
            onChange={(key, value) => {
              handleSettingChange({[key]: value});
            }}
          />
          
          <PersonalDataSettings 
            height={settings.height}
            weight={settings.weight}
            onChange={(key, value) => {
              handleSettingChange({[key]: value});
            }}
          />
          
          <SecuritySettings />
          
          <Button
            onClick={handleSaveSettings}
            className="w-full bg-primary text-white py-3 rounded font-medium"
          >
            Сохранить настройки
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SettingsPage;
