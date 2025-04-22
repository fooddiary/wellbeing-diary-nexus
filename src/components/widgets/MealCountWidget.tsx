
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";

export const MealCountWidget = () => {
  const [state] = useAppStore();
  const [mealCount, setMealCount] = useState(0);
  const [lastMealTime, setLastMealTime] = useState<string | null>(null);

  // Получаем приемы пищи за сегодня
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayMeals = state.meals.filter(meal => meal.date === today);
    
    setMealCount(todayMeals.length);
    
    // Находим последний прием пищи
    if (todayMeals.length > 0) {
      const sortedMeals = [...todayMeals].sort((a, b) => 
        b.time.localeCompare(a.time)
      );
      setLastMealTime(sortedMeals[0].time);
    } else {
      setLastMealTime(null);
    }
  }, [state.meals]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-medium mb-3">🍽️ Приёмы пищи сегодня</h3>
      
      <div className="flex items-baseline justify-center">
        <span className="text-4xl font-bold text-primary">{mealCount}</span>
        <span className="text-sm text-gray-500 ml-2">записей</span>
      </div>
      
      <div className="mt-3 text-center text-sm text-gray-500">
        {mealCount === 0 
          ? "Нет записей за сегодня" 
          : `Последний приём: ${lastMealTime}`}
      </div>
    </div>
  );
};
