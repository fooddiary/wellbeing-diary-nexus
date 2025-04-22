
import { useSyncExternalStore } from "react";
import { AppData, MealEntry, WaterEntry, WeightMetric, Settings } from "@/types/AppData";
import { eventBus } from "./eventBus";
import { initDatabase, addMealEntry, getMealsByDate } from "@/lib/sqliteClient";
import { setupDatabase } from "@/lib/initDb";

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

export async function initializeAppState() {
  if (!initialized) {
    await setupDatabase();
    initialized = true;
    // Тут можно загрузить meals/settings/water из базы и проставить в appState
    notifyState();
  }
}

export function useAppStore(): [AppData, typeof setAppState, typeof updateSettings] {
  const state = useSyncExternalStore(subscribe, () => appState);

  return [state, setAppState, updateSettings];
}

export function setAppState(newState: Partial<AppData>) {
  appState = { ...appState, ...newState };
  // Можно сохранять в БД, если надо
  // Например, update settings in SQLite
  notifyState();
}

export function updateSettings(settings: Partial<Settings>) {
  appState = { ...appState, settings: { ...appState.settings, ...settings } };
  notifyState();
  // тут можно обновлять также persistent storage через SQLite
}
