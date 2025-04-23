
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/useAppStore";
import { Weight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";

export const WeightIndicator = () => {
  const [appState, appActions] = useAppStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [weightValue, setWeightValue] = useState(appState.settings.weight.toString());
  
  // Получаем текущий вес пользователя
  const currentWeight = appState.settings.weight;
  
  // Получаем вес пользователя, записанный сегодня (если есть)
  const today = format(new Date(), "yyyy-MM-dd");
  const todayWeightEntry = appState.weights.find(entry => entry.date === today);
  
  // Функция для сохранения веса
  const saveWeight = async () => {
    try {
      const weight = parseFloat(weightValue);
      
      if (isNaN(weight) || weight <= 0 || weight > 500) {
        toast.error("Пожалуйста, укажите корректный вес");
        return;
      }
      
      // Обновляем настройки пользователя
      await appActions.updateSettings({ weight });
      
      // Если у нас уже есть запись веса на сегодняшний день, обновляем её
      if (todayWeightEntry) {
        await appActions.updateWeight({
          id: todayWeightEntry.id,
          date: today,
          weight
        });
      } else {
        // Иначе создаем новую запись
        await appActions.addWeight({
          date: today,
          weight
        });
      }
      
      toast.success("Вес успешно сохранен");
      setOpenDialog(false);
    } catch (error) {
      toast.error("Не удалось сохранить вес");
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Вес</CardTitle>
          <Weight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentWeight} кг</div>
          <p className="text-xs text-muted-foreground">
            {todayWeightEntry 
              ? "Записано сегодня" 
              : "Не записано сегодня"}
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setOpenDialog(true)}
          >
            {todayWeightEntry ? "Обновить вес" : "Записать вес"}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Запишите свой вес</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                type="number"
                step="0.1"
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                className="col-span-3"
                placeholder="Введите вес в кг"
              />
              <span className="text-sm">кг</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Отмена
            </Button>
            <Button onClick={saveWeight}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
