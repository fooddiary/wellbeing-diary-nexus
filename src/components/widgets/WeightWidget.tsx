
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";

export const WeightWidget = () => {
  const [state, appActions] = useAppStore();
  const [weight, setWeight] = useState("");
  const [savedWeight, setSavedWeight] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Получаем последнюю запись о весе
  useEffect(() => {
    if (state.weights.length > 0) {
      const sortedWeights = [...state.weights].sort((a, b) => 
        b.date.localeCompare(a.date)
      );
      setSavedWeight(sortedWeights[0].weight.toString());
      setLastUpdated(new Date(sortedWeights[0].date));
    }
  }, [state.weights]);

  const handleSaveWeight = async () => {
    if (weight) {
      const weightValue = parseFloat(weight);
      if (isNaN(weightValue)) return;
      
      const today = format(new Date(), 'yyyy-MM-dd');
      
      await appActions.addWeight({
        date: today,
        weight: weightValue
      });
      
      setWeight("");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-medium mb-3">⚖️ Вес</h3>
      
      {savedWeight && (
        <div className="mb-3 text-center">
          <div className="text-2xl font-bold text-primary">{savedWeight} кг</div>
          <div className="text-xs text-gray-500">
            {lastUpdated ? `Обновлено: ${format(lastUpdated, 'dd.MM.yyyy')}` : ""}
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
