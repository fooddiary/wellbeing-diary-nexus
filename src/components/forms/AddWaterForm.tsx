
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { DateTimePicker } from "@/components/DateTimePicker";
import { format } from "date-fns";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/ui/sonner";
import { WaterEntry } from "@/types/AppData";
import { Droplet } from "lucide-react";

interface WaterFormData {
  id?: number;
  date: Date;
  amount: number;
  thirstLevel: number;
  notes: string;
}

interface AddWaterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingWater?: WaterEntry;
}

export const AddWaterForm: React.FC<AddWaterFormProps> = ({
  open,
  onOpenChange,
  existingWater
}) => {
  const [appState, appActions] = useAppStore();
  
  // Состояния для формы
  const [formData, setFormData] = useState<WaterFormData>({
    date: new Date(),
    amount: 250,
    thirstLevel: 5,
    notes: ""
  });
  
  // При открытии формы с существующей записью
  useEffect(() => {
    if (existingWater) {
      // Преобразуем данные существующей записи для формы
      setFormData({
        id: existingWater.id,
        date: new Date(`${existingWater.date}T${existingWater.time}`),
        amount: existingWater.amount,
        // Дополнительные поля могут потребоваться расширить тип WaterEntry
        thirstLevel: 5, // Значение по умолчанию
        notes: ""
      });
    } else {
      // Сбрасываем форму при новом добавлении
      resetForm();
    }
  }, [existingWater, open]);
  
  // Сброс формы
  const resetForm = () => {
    setFormData({
      date: new Date(),
      amount: 250,
      thirstLevel: 5,
      notes: ""
    });
  };
  
  // Функция для увеличения/уменьшения объема на 50мл
  const adjustAmount = (change: number) => {
    setFormData(prev => ({ 
      ...prev, 
      amount: Math.max(50, Math.min(2000, prev.amount + change))
    }));
  };
  
  // Обработчик сохранения формы
  const handleSubmit = async () => {
    try {
      // Формируем данные для сохранения
      const waterData: Partial<WaterEntry> = {
        date: format(formData.date, "yyyy-MM-dd"),
        time: format(formData.date, "HH:mm"),
        amount: formData.amount
      };
      
      // Обновляем существующую запись или создаем новую
      if (existingWater?.id) {
        await appActions.updateWater({ ...waterData, id: existingWater.id } as WaterEntry);
        toast.success("Запись обновлена");
      } else {
        await appActions.addWater(waterData as Omit<WaterEntry, "id">);
        toast.success("Запись добавлена");
      }
      
      // Закрываем форму
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error("Не удалось сохранить запись");
    }
  };
  
  // Обработчик удаления записи
  const handleDelete = async () => {
    if (existingWater?.id) {
      try {
        await appActions.deleteWater(existingWater.id);
        toast.success("Запись удалена");
        
        // Закрываем форму
        onOpenChange(false);
      } catch (error) {
        toast.error("Не удалось удалить запись");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {existingWater ? "Редактирование записи" : "Запишите сколько вы выпили воды"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Дата и время */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Дата и время</label>
            <DateTimePicker 
              date={formData.date} 
              setDate={(date) => setFormData(prev => ({ ...prev, date }))}
            />
          </div>
          
          {/* Объем воды */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Объем воды: {formData.amount} мл</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustAmount(-50)}
                  disabled={formData.amount <= 50}
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustAmount(50)}
                  disabled={formData.amount >= 2000}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="relative">
              <Slider 
                min={50} 
                max={2000} 
                step={50} 
                value={[formData.amount]} 
                onValueChange={(values) => setFormData(prev => ({ ...prev, amount: values[0] }))}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>50 мл</span>
                <span>2000 мл</span>
              </div>
              
              <div className="mt-4 flex items-center justify-center space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setFormData(prev => ({ ...prev, amount: 100 }))}
                  className="flex-1"
                >
                  <Droplet className="h-4 w-4 mr-2" />
                  100 мл
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setFormData(prev => ({ ...prev, amount: 250 }))}
                  className="flex-1"
                >
                  <Droplet className="h-4 w-4 mr-2" />
                  250 мл
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setFormData(prev => ({ ...prev, amount: 500 }))}
                  className="flex-1"
                >
                  <Droplet className="h-4 w-4 mr-2" />
                  500 мл
                </Button>
              </div>
            </div>
          </div>
          
          {/* Шкала жажды */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Уровень жажды: {formData.thirstLevel}
            </label>
            <Slider 
              min={1} 
              max={10} 
              step={1} 
              value={[formData.thirstLevel]} 
              onValueChange={(values) => setFormData(prev => ({ ...prev, thirstLevel: values[0] }))}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Не хочу пить (1)</span>
              <span>Сильная жажда (10)</span>
            </div>
          </div>
          
          {/* Заметки */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Заметки</label>
            <Textarea 
              placeholder="Дополнительные заметки..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="min-h-24"
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {existingWater && (
            <Button 
              variant="destructive"
              onClick={handleDelete}
              type="button"
              className="w-full sm:w-auto"
            >
              Удалить
            </Button>
          )}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              type="button"
              className="flex-1"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit}
              type="button"
              className="flex-1"
            >
              {existingWater ? "Сохранить изменения" : "Сохранить запись"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
