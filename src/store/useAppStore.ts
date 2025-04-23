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
import { appActions } from "./appActions";

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

// --- ВНИМАНИЕ ---
// Файл становится слишком длинным! После этого изменения желательно провести подробный рефакторинг — вынести actions и utils в отдельные файлы и разбить логику по модулям. 
