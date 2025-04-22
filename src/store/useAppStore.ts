
import { useSyncExternalStore } from "react";
import { AppData, MealEntry, WaterEntry, WeightMetric, Settings } from "@/types/AppData";
import { eventBus } from "./eventBus";
import { 
  initDatabase, 
  getAllMeals, 
  addMealEntry, 
  updateMealEntry,
  deleteMealEntry,
  getAllWater, 
  addWaterEntry,
  updateWaterEntry,
  deleteWaterEntry,
  getAllWeights,
  addWeightEntry,
  updateWeightEntry,
  deleteWeightEntry,
  getSettings,
  saveSettings
} from "@/lib/sqliteClient";
import { setupDatabase } from "@/lib/initDb";
import { initPhotoDirectory } from "@/lib/photoFileSystem";
import { validateMeal, validateWater, validateWeight, validateSettings } from "@/lib/validation";
import { logError, logInfo } from "@/lib/errorLogger";
import { toast } from "@/components/ui/sonner";

// Начальное состояние
let appState: AppData = {
  meals: [],
  water: [],
  settings: {
    theme: "system",
    waterWidget: true,
    mealCountWidget: true,
    weightWidget: true,
    height: 170,
    weight: 70,
  },
  weights: [],
};

let listeners: (() => void)[] = [];
let initialized = false;

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
}

function notifyState() {
  for (const l of listeners) l();
  eventBus.emit('appStateChange', appState);
}

// Загрузка всех данных из SQLite
export async function initializeAppState() {
  if (!initialized) {
    try {
      logInfo("Инициализация состояния приложения");
      
      // Инициализация базы данных
      await setupDatabase();
      await initPhotoDirectory();
      
      // Загрузка данных из SQLite
      const meals = await getAllMeals();
      const water = await getAllWater();
      const weights = await getAllWeights();
      const settings = await getSettings();
      
      // Обновление состояния
      appState = {
        ...appState,
        meals: meals || [],
        water: water || [],
        weights: weights || [],
      };

      // Если настройки существуют, обновляем их
      if (settings) {
        appState.settings = settings;
      } else {
        // Иначе сохраняем дефолтные в базу
        await saveSettings(appState.settings);
      }
      
      // Дублируем настройки в localStorage для случая сбоя SQLite
      try {
        localStorage.setItem('appSettings', JSON.stringify(appState.settings));
      } catch (e) {
        console.warn('Не удалось сохранить настройки в localStorage', e);
      }
      
      initialized = true;
      notifyState();
      logInfo('Состояние приложения инициализировано успешно');
    } catch (error) {
      logError('Ошибка при инициализации состояния приложения', error);
      
      // Попытка восстановления из localStorage
      try {
        const storedSettings = localStorage.getItem('appSettings');
        if (storedSettings) {
          appState.settings = JSON.parse(storedSettings);
          logInfo('Настройки восстановлены из localStorage');
        }
      } catch (e) {
        logError('Не удалось восстановить настройки из localStorage', e);
      }
      
      // Показываем уведомление пользователю
      toast.error("Произошла ошибка при инициализации приложения");
    }
  }
  return appState;
}

// Хук для работы с хранилищем
export function useAppStore(): [AppData, typeof appActions] {
  const state = useSyncExternalStore(subscribe, () => appState);
  return [state, appActions];
}

// Методы для работы с приёмами пищи
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
      appState = {
        ...appState,
        meals: [newMeal, ...appState.meals]
      };
      notifyState();
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
      
      // Обновляем в состоянии
      appState = {
        ...appState,
        meals: appState.meals.map(m => m.id === meal.id ? meal : m)
      };
      notifyState();
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
      
      // Удаляем из состояния
      appState = {
        ...appState,
        meals: appState.meals.filter(m => m.id !== id)
      };
      notifyState();
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
      appState = {
        ...appState,
        water: [newWater, ...appState.water]
      };
      notifyState();
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
      
      // Обновляем в состоянии
      appState = {
        ...appState,
        water: appState.water.map(w => w.id === water.id ? water : w)
      };
      notifyState();
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
      
      // Удаляем из состояния
      appState = {
        ...appState,
        water: appState.water.filter(w => w.id !== id)
      };
      notifyState();
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
      appState = {
        ...appState,
        weights: [newWeight, ...appState.weights]
      };
      notifyState();
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
      
      // Обновляем в состоянии
      appState = {
        ...appState,
        weights: appState.weights.map(w => w.id === weight.id ? weight : w)
      };
      notifyState();
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
      
      // Удаляем из состояния
      appState = {
        ...appState,
        weights: appState.weights.filter(w => w.id !== id)
      };
      notifyState();
    } catch (e) {
      logError('Ошибка при удалении веса', e);
      toast.error("Не удалось удалить вес");
      throw e;
    }
  },
  
  // SETTINGS ACTIONS
  updateSettings: async (settings: Partial<Settings>) => {
    try {
      // Объединяем с текущими настройками
      const newSettings = { ...appState.settings, ...settings };
      
      // Валидируем новые настройки
      const validation = validateSettings(newSettings);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return;
      }
      
      // Сохраняем в базу
      await saveSettings(newSettings);
      
      // Дублируем в localStorage для отказоустойчивости
      try {
        localStorage.setItem('appSettings', JSON.stringify(newSettings));
      } catch (e) {
        console.warn('Не удалось сохранить настройки в localStorage', e);
      }
      
      // Обновляем состояние
      appState = {
        ...appState,
        settings: newSettings
      };
      notifyState();
    } catch (e) {
      logError('Ошибка при обновлении настроек', e);
      toast.error("Не удалось обновить настройки");
      throw e;
    }
  }
};

// Экспортируем обновление настроек для обратной совместимости
export const updateSettings = appActions.updateSettings;

// Экспортируем установку состояния для обратной совместимости
export function setAppState(newState: Partial<AppData>) {
  try {
    appState = { ...appState, ...newState };
    notifyState();
  } catch (e) {
    logError('Ошибка при обновлении состояния приложения', e);
  }
}
