
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
      
      initialized = true;
      notifyState();
      console.log('App state initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app state:', error);
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
      console.error('Error adding meal:', e);
      throw e;
    }
  },
  
  updateMeal: async (meal: MealEntry) => {
    try {
      // Обновляем в базе
      await updateMealEntry(meal);
      
      // Обновляем в состоянии
      appState = {
        ...appState,
        meals: appState.meals.map(m => m.id === meal.id ? meal : m)
      };
      notifyState();
    } catch (e) {
      console.error('Error updating meal:', e);
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
      console.error('Error deleting meal:', e);
      throw e;
    }
  },
  
  // WATER ACTIONS
  addWater: async (water: Omit<WaterEntry, "id">) => {
    try {
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
      console.error('Error adding water:', e);
      throw e;
    }
  },
  
  updateWater: async (water: WaterEntry) => {
    try {
      // Обновляем в базе
      await updateWaterEntry(water);
      
      // Обновляем в состоянии
      appState = {
        ...appState,
        water: appState.water.map(w => w.id === water.id ? water : w)
      };
      notifyState();
    } catch (e) {
      console.error('Error updating water:', e);
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
      console.error('Error deleting water:', e);
      throw e;
    }
  },
  
  // WEIGHT ACTIONS
  addWeight: async (weight: Omit<WeightMetric, "id">) => {
    try {
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
      console.error('Error adding weight:', e);
      throw e;
    }
  },
  
  updateWeight: async (weight: WeightMetric) => {
    try {
      // Обновляем в базе
      await updateWeightEntry(weight);
      
      // Обновляем в состоянии
      appState = {
        ...appState,
        weights: appState.weights.map(w => w.id === weight.id ? weight : w)
      };
      notifyState();
    } catch (e) {
      console.error('Error updating weight:', e);
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
      console.error('Error deleting weight:', e);
      throw e;
    }
  },
  
  // SETTINGS ACTIONS
  updateSettings: async (settings: Partial<Settings>) => {
    try {
      // Обновляем настройки
      const newSettings = { ...appState.settings, ...settings };
      
      // Сохраняем в базу
      await saveSettings(newSettings);
      
      // Обновляем состояние
      appState = {
        ...appState,
        settings: newSettings
      };
      notifyState();
    } catch (e) {
      console.error('Error updating settings:', e);
      throw e;
    }
  }
};

// Экспортируем обновление настроек для обратной совместимости
export const updateSettings = appActions.updateSettings;

// Экспортируем установку состояния для обратной совместимости
export function setAppState(newState: Partial<AppData>) {
  appState = { ...appState, ...newState };
  notifyState();
}
