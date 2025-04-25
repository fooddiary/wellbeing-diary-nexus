
import { Settings } from "@/types/AppData";
import { saveSettings } from "@/lib/sqliteClient";
import { logError } from "@/lib/errorLogger";
import { toast } from "@/components/ui/sonner";
import { setAppState } from "../useAppStore";
import { appState } from "../useAppStore";

export const settingsActions = {
  updateSettings: async (settings: Partial<Settings>) => {
    try {
      const currentSettings = appState.settings;
      const updatedSettings = {
        ...currentSettings,
        ...settings
      };
      
      await saveSettings(updatedSettings);
      setAppState({
        settings: updatedSettings
      });
      
      try {
        localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      } catch (e) {
        console.warn('Не удалось сохранить настройки в localStorage', e);
      }
      
      return updatedSettings;
    } catch (e) {
      logError('Ошибка при обновлении настроек', e);
      toast.error("Не удалось обновить настройки");
      throw e;
    }
  }
};
