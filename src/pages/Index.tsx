
import { WaterWidget } from "@/components/widgets/WaterWidget";
import { MealCountWidget } from "@/components/widgets/MealCountWidget";
import { WeightWidget } from "@/components/widgets/WeightWidget";

const Index = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Виджеты</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <WaterWidget />
        <MealCountWidget />
        <WeightWidget />
      </div>

      <div className="text-center text-sm text-gray-500 mt-6">
        Добавляйте записи с помощью кнопки <span className="text-primary">+</span> внизу
      </div>
    </div>
  );
};

export default Index;
