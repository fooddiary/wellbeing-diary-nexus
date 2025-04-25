
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { Info, Droplet } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddWaterForm } from "@/components/forms/AddWaterForm";
import { format } from "date-fns";

export const WaterIndicator = () => {
  const [appState] = useAppStore();
  const [infoOpen, setInfoOpen] = useState(false);
  const [openWaterForm, setOpenWaterForm] = useState(false);
  const [totalWaterToday, setTotalWaterToday] = useState(0);
  const [waterNorm, setWaterNorm] = useState(2000);
  const [normCompletionPercentage, setNormCompletionPercentage] = useState(0);

  // Расчет данных при изменении состояния
  useEffect(() => {
    // Получаем текущую дату в формате yyyy-MM-dd
    const today = format(new Date(), "yyyy-MM-dd");

    // Получаем все записи о воде за текущий день
    const todayWaterEntries = appState.water.filter(entry => entry.date === today);

    // Считаем общее количество воды за сегодня
    const totalWater = todayWaterEntries.reduce((total, entry) => total + entry.amount, 0);
    setTotalWaterToday(totalWater);

    // Рост и вес пользователя из настроек
    const { height, weight } = appState.settings;

    // Расчет идеального веса и нормы воды
    const idealWeight = height - 100;
    const calculatedWaterNorm = weight < idealWeight 
      ? weight * 30 // Если вес меньше идеального
      : idealWeight * 30; // Если вес больше или равен идеальному
    
    setWaterNorm(calculatedWaterNorm);

    // Процент выполнения нормы
    const completion = Math.min(100, totalWater / calculatedWaterNorm * 100);
    setNormCompletionPercentage(completion);
  }, [appState.water, appState.settings]);

  // Вывод поздравления, если норма выполнена
  const isNormCompleted = totalWaterToday >= waterNorm;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 my-0 py-[10px]">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-sm font-medium">Вода</CardTitle>
          <Popover open={infoOpen} onOpenChange={setInfoOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background border-border">
              <div className="text-sm">
                <p>Необязательно строго придерживаться такого объема, если это вызывает дискомфорт. В зависимости от потребностей организма и его индивидуальных особенностей норма может меняться.</p>
                <p className="mt-2">При интенсивной физической нагрузке к расчётной норме добавляется 0,5–1 литр, чтобы компенсировать потерю жидкости через потоотделение.</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Droplet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalWaterToday} мл</div>
        <p className="text-xs text-muted-foreground">Дневная норма: {waterNorm} мл</p>
        <Progress 
          value={normCompletionPercentage} 
          className={`h-2 mt-2 ${isNormCompleted ? 'bg-green-500' : ''}`} 
        />
        {isNormCompleted && (
          <p className="text-xs text-green-500 mt-1">
            Поздравляем! Вы выполнили норму потребления воды на сегодня.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => setOpenWaterForm(true)}
        >
          + Добавить запись
        </Button>
      </CardFooter>
      
      {/* Модальное окно для добавления воды */}
      <AddWaterForm open={openWaterForm} onOpenChange={setOpenWaterForm} />
    </Card>
  );
};
