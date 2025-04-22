
import { useState } from "react";

export const WaterWidget = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [target, setTarget] = useState(2000); // Default target: 2000ml
  const [showInfo, setShowInfo] = useState(false);

  const handleAddWater = () => {
    setWaterIntake(waterIntake + 250); // Add 250ml with each click
  };

  const percentage = Math.min((waterIntake / target) * 100, 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">💧 Вода</h3>
        <button 
          onClick={() => setShowInfo(!showInfo)} 
          className="text-gray-500 hover:text-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="16" y2="12" />
            <line x1="12" x2="12.01" y1="8" y2="8" />
          </svg>
        </button>
      </div>

      {showInfo && (
        <div className="text-xs text-gray-500 mb-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
          Норма потребления воды индивидуальна и зависит от вашего веса, активности и окружающей среды.
        </div>
      )}

      <div className="mb-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between text-sm mb-3">
        <span>{waterIntake} мл</span>
        <span>{target} мл</span>
      </div>

      <button
        onClick={handleAddWater}
        className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-primary font-medium rounded transition"
      >
        + Добавить 250 мл
      </button>
    </div>
  );
};
