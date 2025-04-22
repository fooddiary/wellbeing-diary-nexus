
import { MealEntry, WaterEntry, WeightMetric, Settings } from "@/types/AppData";
import { logWarning } from "./errorLogger";

// Валидация записи о еде
export function validateMeal(meal: Omit<MealEntry, "id">): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  // Проверка наличия обязательных полей
  if (!meal.date) errors.push("Дата не указана");
  if (!meal.mealType) errors.push("Тип приема пищи не указан");
  if (!meal.time) errors.push("Время не указано");
  
  // Проверка форматов
  if (meal.date && !/^\d{4}-\d{2}-\d{2}$/.test(meal.date)) {
    errors.push("Неверный формат даты (должен быть YYYY-MM-DD)");
  }
  if (meal.time && !/^\d{2}:\d{2}(:\d{2})?$/.test(meal.time)) {
    errors.push("Неверный формат времени (должен быть HH:MM или HH:MM:SS)");
  }
  
  // Проверка числовых значений
  if (meal.hungerLevel !== undefined && (meal.hungerLevel < 0 || meal.hungerLevel > 10)) {
    errors.push("Уровень голода должен быть от 0 до 10");
  }
  if (meal.fullnessLevel !== undefined && (meal.fullnessLevel < 0 || meal.fullnessLevel > 10)) {
    errors.push("Уровень сытости должен быть от 0 до 10");
  }
  
  if (errors.length > 0) {
    logWarning("Ошибка валидации приема пищи", { meal, errors });
    return { valid: false, errors };
  }
  
  return { valid: true };
}

// Валидация записи о воде
export function validateWater(water: Omit<WaterEntry, "id">): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  // Проверка наличия обязательных полей
  if (!water.date) errors.push("Дата не указана");
  if (!water.time) errors.push("Время не указано");
  if (water.amount === undefined) errors.push("Количество воды не указано");
  
  // Проверка форматов
  if (water.date && !/^\d{4}-\d{2}-\d{2}$/.test(water.date)) {
    errors.push("Неверный формат даты (должен быть YYYY-MM-DD)");
  }
  if (water.time && !/^\d{2}:\d{2}(:\d{2})?$/.test(water.time)) {
    errors.push("Неверный формат времени (должен быть HH:MM или HH:MM:SS)");
  }
  
  // Проверка значения количества воды
  if (water.amount !== undefined && (water.amount <= 0 || water.amount > 3000)) {
    errors.push("Количество воды должно быть от 1 до 3000 мл");
  }
  
  if (errors.length > 0) {
    logWarning("Ошибка валидации записи о воде", { water, errors });
    return { valid: false, errors };
  }
  
  return { valid: true };
}

// Валидация записи о весе
export function validateWeight(weight: Omit<WeightMetric, "id">): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  // Проверка наличия обязательных полей
  if (!weight.date) errors.push("Дата не указана");
  if (weight.weight === undefined) errors.push("Вес не указан");
  
  // Проверка форматов
  if (weight.date && !/^\d{4}-\d{2}-\d{2}$/.test(weight.date)) {
    errors.push("Неверный формат даты (должен быть YYYY-MM-DD)");
  }
  
  // Проверка значения веса (обычно от 20 до 500 кг - широкий диапазон для различных случаев)
  if (weight.weight !== undefined && (weight.weight < 20 || weight.weight > 500)) {
    errors.push("Вес должен быть от 20 до 500 кг");
  }
  
  if (errors.length > 0) {
    logWarning("Ошибка валидации записи о весе", { weight, errors });
    return { valid: false, errors };
  }
  
  return { valid: true };
}

// Валидация настроек
export function validateSettings(settings: Settings): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  // Проверка темы
  if (settings.theme !== "light" && settings.theme !== "dark" && settings.theme !== "system") {
    errors.push("Неверная тема (должна быть light, dark или system)");
  }
  
  // Проверка числовых значений
  if (settings.height !== undefined && (settings.height < 50 || settings.height > 250)) {
    errors.push("Рост должен быть от 50 до 250 см");
  }
  if (settings.weight !== undefined && (settings.weight < 20 || settings.weight > 500)) {
    errors.push("Вес должен быть от 20 до 500 кг");
  }
  
  if (errors.length > 0) {
    logWarning("Ошибка валидации настроек", { settings, errors });
    return { valid: false, errors };
  }
  
  return { valid: true };
}
