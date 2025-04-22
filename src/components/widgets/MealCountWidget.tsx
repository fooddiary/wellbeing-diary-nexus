
import { useState } from "react";

export const MealCountWidget = () => {
  // Dummy data - in a real app this would come from actual entries
  const [mealCount, setMealCount] = useState(2);

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
          : `Последний приём: ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`}
      </div>
    </div>
  );
};
