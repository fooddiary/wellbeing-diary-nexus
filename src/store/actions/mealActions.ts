
import { MealEntry } from "@/types/AppData";
import { addMealEntry, updateMealEntry, deleteMealEntry, getAllMeals } from "@/lib/sqliteClient";
import { validateMeal } from "@/lib/validation";
import { toast } from "@/components/ui/sonner";
import { logError } from "@/lib/errorLogger";
import { setAppState } from "../useAppStore";

export const mealActions = {
  addMeal: async (meal: Omit<MealEntry, "id">) => {
    try {
      const validation = validateMeal(meal);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return null;
      }
      
      const id = await addMealEntry({...meal, id: 0});
      const newMeal = {...meal, id: id as number};
      
      const meals = await getAllMeals();
      setAppState({ meals });
      
      return newMeal;
    } catch (e) {
      logError('Ошибка при добавлении приёма пищи', e);
      toast.error("Не удалось сохранить приём пищи");
      throw e;
    }
  },
  
  updateMeal: async (meal: MealEntry) => {
    try {
      const validation = validateMeal(meal);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return;
      }
      
      await updateMealEntry(meal);
      const meals = await getAllMeals();
      setAppState({ meals });
      
    } catch (e) {
      logError('Ошибка при обновлении приёма пищи', e);
      toast.error("Не удалось обновить приём пищи");
      throw e;
    }
  },
  
  deleteMeal: async (id: number) => {
    try {
      await deleteMealEntry(id);
      const meals = await getAllMeals();
      setAppState({ meals });
    } catch (e) {
      logError('Ошибка при удалении приёма пищи', e);
      toast.error("Не удалось удалить приём пищи");
      throw e;
    }
  }
};
