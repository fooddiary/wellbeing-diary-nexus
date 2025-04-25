
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/DateTimePicker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/ui/sonner";
import { WaterEntry } from "@/types/AppData";
import { WaterAmountControl } from "./water/WaterAmountControl";
import { ThirstLevelControl } from "./water/ThirstLevelControl";

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
  
  const [formData, setFormData] = useState<WaterFormData>({
    date: new Date(),
    amount: 250,
    thirstLevel: 5,
    notes: ""
  });
  
  useEffect(() => {
    if (existingWater) {
      setFormData({
        id: existingWater.id,
        date: new Date(`${existingWater.date}T${existingWater.time}`),
        amount: existingWater.amount,
        thirstLevel: 5,
        notes: ""
      });
    } else {
      setFormData({
        date: new Date(),
        amount: 250,
        thirstLevel: 5,
        notes: ""
      });
    }
  }, [existingWater, open]);

  const handleSubmit = async () => {
    try {
      const waterData: Partial<WaterEntry> = {
        date: format(formData.date, "yyyy-MM-dd"),
        time: format(formData.date, "HH:mm"),
        amount: formData.amount
      };
      
      if (existingWater?.id) {
        await appActions.updateWater({ ...waterData, id: existingWater.id } as WaterEntry);
        toast.success("Запись обновлена");
      } else {
        await appActions.addWater(waterData as Omit<WaterEntry, "id">);
        toast.success("Запись добавлена");
      }
      
      onOpenChange(false);
    } catch (error) {
      toast.error("Не удалось сохранить запись");
    }
  };

  const handleDelete = async () => {
    if (existingWater?.id) {
      try {
        await appActions.deleteWater(existingWater.id);
        toast.success("Запись удалена");
        onOpenChange(false);
      } catch (error) {
        toast.error("Не удалось удалить запись");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {existingWater ? "Редактирование записи" : "Запишите сколько вы выпили воды"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-10rem)] pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Дата и время</label>
              <DateTimePicker 
                date={formData.date} 
                setDate={(date) => setFormData(prev => ({ ...prev, date }))}
              />
            </div>
            
            <WaterAmountControl 
              amount={formData.amount}
              onAmountChange={(amount) => setFormData(prev => ({ ...prev, amount }))}
            />
            
            <ThirstLevelControl
              thirstLevel={formData.thirstLevel}
              onThirstLevelChange={(thirstLevel) => setFormData(prev => ({ ...prev, thirstLevel }))}
            />
            
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
        </ScrollArea>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
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
