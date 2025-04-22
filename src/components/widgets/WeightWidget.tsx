
import { useState } from "react";

export const WeightWidget = () => {
  const [weight, setWeight] = useState("");
  const [savedWeight, setSavedWeight] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleSaveWeight = () => {
    if (weight) {
      setSavedWeight(weight);
      setLastUpdated(new Date());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-medium mb-3">⚖️ Вес</h3>
      
      {savedWeight && (
        <div className="mb-3 text-center">
          <div className="text-2xl font-bold text-primary">{savedWeight} кг</div>
          <div className="text-xs text-gray-500">
            {lastUpdated ? `Обновлено: ${lastUpdated.toLocaleDateString()}` : ""}
          </div>
        </div>
      )}
      
      <div className="flex">
        <input
          type="number"
          placeholder="Ваш вес (кг)"
          className="flex-1 rounded-l border border-gray-300 px-3 py-2 text-sm"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button
          onClick={handleSaveWeight}
          className="bg-primary text-white px-3 py-2 rounded-r text-sm"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};
