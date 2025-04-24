import { MealEntry, WaterEntry, WeightMetric, Settings, AppData } from "@/types/AppData";
import { 
  addMealEntry, updateMealEntry, deleteMealEntry,
  addWaterEntry, updateWaterEntry, deleteWaterEntry,
  addWeightEntry, updateWeightEntry, deleteWeightEntry,
  saveSettings
} from "@/lib/sqliteClient";
import { validateMeal, validateWater, validateWeight, validateSettings } from "@/lib/validation";
import { toast } from "@/components/ui/sonner";
import { logError } from "@/lib/errorLogger";
import { setAppState } from "./useAppStore";
import { appState } from "./useAppStore";

// Все actions вынесены для сокращения файла useAppStore.ts
// ...структура такая же как была в useAppStore.ts, импортировать в useAppStore...

export const appActions = {
  // MEAL ACTIONS
  addMeal: async (meal: Omit<MealEntry, "id">) => {
    try {
      // Валидируем данные перед сохранением
      const validation = validateMeal(meal);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return null;
      }
      
      // Добавляем в базу
      const id = await addMealEntry({...meal, id: 0});
      
      // Обновляем состояние
      const newMeal = {...meal, id: id as number};
      return newMeal;
    } catch (e) {
      logError('Ошибка при добавлении приёма пищи', e);
      toast.error("Не удалось сохранить приём пищи");
      throw e;
    }
  },
  
  updateMeal: async (meal: MealEntry) => {
    try {
      // Валидируем данные перед обновлением
      const validation = validateMeal(meal);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return;
      }
      
      // Обновляем в базе
      await updateMealEntry(meal);
      
    } catch (e) {
      logError('Ошибка при обновлении приёма пищи', e);
      toast.error("Не удалось обновить приём пищи");
      throw e;
    }
  },
  
  deleteMeal: async (id: number) => {
    try {
      // Удаляем из базы
      await deleteMealEntry(id);
      
    } catch (e) {
      logError('Ошибка при удалении приёма пищи', e);
      toast.error("Не удалось удалить приём пищи");
      throw e;
    }
  },
  
  // WATER ACTIONS
  addWater: async (water: Omit<WaterEntry, "id">) => {
    try {
      // Валидируем данные перед сохранением
      const validation = validateWater(water);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return null;
      }
      
      // Добавляем в базу
      const id = await addWaterEntry({...water, id: 0});
      
      // Обновляем состояние
      const newWater = {...water, id: id as number};
      return newWater;
    } catch (e) {
      logError('Ошибка при добавлении записи о воде', e);
      toast.error("Не удалось сохранить запись о воде");
      throw e;
    }
  },
  
  updateWater: async (water: WaterEntry) => {
    try {
      // Валидируем данные перед обновлением
      const validation = validateWater(water);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return;
      }
      
      // Обновляем в базе
      await updateWaterEntry(water);
      
    } catch (e) {
      logError('Ошибка при обновлении записи о воде', e);
      toast.error("Не удалось обновить запись о воде");
      throw e;
    }
  },
  
  deleteWater: async (id: number) => {
    try {
      // Удаляем из базы
      await deleteWaterEntry(id);
      
    } catch (e) {
      logError('Ошибка при удалении записи о воде', e);
      toast.error("Не удалось удалить запись о воде");
      throw e;
    }
  },
  
  // WEIGHT ACTIONS
  addWeight: async (weight: Omit<WeightMetric, "id">) => {
    try {
      // Валидируем данные перед сохранением
      const validation = validateWeight(weight);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return null;
      }
      
      // Добавляем в базу
      const id = await addWeightEntry({...weight, id: 0});
      
      // Обновляем состояние
      const newWeight = {...weight, id: id as number};
      return newWeight;
    } catch (e) {
      logError('Ошибка при добавлении веса', e);
      toast.error("Не удалось сохранить вес");
      throw e;
    }
  },
  
  updateWeight: async (weight: WeightMetric) => {
    try {
      // Валидируем данные перед обновлением
      const validation = validateWeight(weight);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return;
      }
      
      // Обновляем в базе
      await updateWeightEntry(weight);
      
    } catch (e) {
      logError('Ошибка при обновлении веса', e);
      toast.error("Не удалось обновить вес");
      throw e;
    }
  },
  
  deleteWeight: async (id: number) => {
    try {
      // Удаляем из базы
      await deleteWeightEntry(id);
      
    } catch (e) {
      logError('Ошибка при удалении веса', e);
      toast.error("Не удалось удалить вес");
      throw e;
    }
  },
  
  // SETTINGS ACTIONS
  updateSettings: async (settings: Partial<Settings>) => {
    try {
      // Получаем текущее состояние из appState
      const currentSettings = appState.settings;
      
      // Объединяем текущие настройки с новыми
      const updatedSettings = {
        ...currentSettings,
        ...settings
      };
      
      // Сохраняем в базу
      await saveSettings(updatedSettings);
      
      // Обновляем состояние приложения
      setAppState({
        ...appState,
        settings: updatedSettings
      });
      
      // Дублируем в localStorage для отказоустойчивости
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
