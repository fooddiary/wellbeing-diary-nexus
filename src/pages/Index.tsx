
import { WaterIndicator } from "@/components/widgets/WaterIndicator";
import { MealCounter } from "@/components/widgets/MealCounter";
import { WeightIndicator } from "@/components/widgets/WeightIndicator";
import { AddEntryButton } from "@/components/AddEntryButton";
import { useAppStore } from "@/store/useAppStore";

const Index = () => {
  const [appState] = useAppStore();
  const { waterWidget, mealCountWidget, weightWidget } = appState.settings;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Виджеты</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {waterWidget && (
          <div className="col-span-1">
            <WaterIndicator />
          </div>
        )}
        
        {mealCountWidget && (
          <div className="col-span-1">
            <MealCounter />
          </div>
        )}
        
        {weightWidget && (
          <div className="col-span-1">
            <WeightIndicator />
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-500 mt-6">
        {(!waterWidget && !mealCountWidget && !weightWidget) && (
          <p>Включите виджеты в настройках приложения</p>
        )}
      </div>
      
      <AddEntryButton />
    </div>
  );
};

export default Index;
