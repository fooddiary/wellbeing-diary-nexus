
export interface MealEntry {
  id: number;
  date: string;
  mealType: string;
  time: string;
  description: string;
  photoPath?: string;
  hungerLevel?: number;
  fullnessLevel?: number;
  emotionBefore?: string;
  emotionAfter?: string;
  notes?: string;
}

export interface WaterEntry {
  id: number;
  date: string;
  time: string;
  amount: number;
  thirstLevel?: number;
  notes?: string;
}

export interface Settings {
  theme: "light" | "dark" | "system";
  waterWidget: boolean;
  mealCountWidget: boolean;
  weightWidget: boolean;
  height: number;
  weight: number;
  keepPhotosMonths?: number; // Настройка для хранения фото (в месяцах)
}

export interface WeightMetric {
  id: number;
  date: string;
  weight: number;
}

export interface AppData {
  meals: MealEntry[];
  water: WaterEntry[];
  settings: Settings;
  weights: WeightMetric[];
}
