import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmojiRating, getEmotionEmoji, getEmotionLabel } from "@/components/EmojiRating";
import { DateTimePicker } from "@/components/DateTimePicker";
import { format } from "date-fns";
import { useAppStore } from "@/store/useAppStore";
import { pickPhotoFromGallery } from "@/utils/photoUtils";
import { toast } from "@/components/ui/sonner";
import { MealEntry } from "@/types/AppData";
import { Trash2 } from "lucide-react";
import { getPhotoUrl, deletePhotoFromDevice } from "@/lib/photoFileSystem";

type Emotion = "very_bad" | "bad" | "neutral" | "good" | "very_good";

interface MealFormData {
  id?: number;
  date: Date;
  mealType: string;
  photoPath?: string;
  description: string;
  emotionBefore: Emotion;
  emotionAfter: Emotion;
  hungerLevel: number;
  fullnessLevel: number;
  notes?: string;
}

interface AddMealFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingMeal?: MealEntry;
}

export const AddMealForm: React.FC<AddMealFormProps> = ({
  open,
  onOpenChange,
  existingMeal
}) => {
  const [appState, appActions] = useAppStore();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<MealFormData>({
    date: new Date(),
    mealType: "Завтрак",
    description: "",
    emotionBefore: "neutral",
    emotionAfter: "neutral",
    hungerLevel: 5,
    fullnessLevel: 5,
    notes: ""
  });
  
  useEffect(() => {
    if (existingMeal) {
      setFormData({
        id: existingMeal.id,
        date: new Date(`${existingMeal.date}T${existingMeal.time}`),
        mealType: existingMeal.mealType,
        photoPath: existingMeal.photoPath,
        description: existingMeal.description || "",
        emotionBefore: (existingMeal.emotionBefore as Emotion) || "neutral",
        emotionAfter: (existingMeal.emotionAfter as Emotion) || "neutral",
        hungerLevel: existingMeal.hungerLevel || 5,
        fullnessLevel: existingMeal.fullnessLevel || 5,
        notes: ""
      });
      
      if (existingMeal.photoPath) {
        loadPhoto(existingMeal.photoPath);
      }
    } else {
      resetForm();
    }
  }, [existingMeal, open]);
  
  const loadPhoto = async (path: string) => {
    try {
      const url = await getPhotoUrl(path);
      setPhotoUrl(url);
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
      setPhotoUrl(null);
    }
  };
  
  const resetForm = () => {
    setFormData({
      date: new Date(),
      mealType: "Завтрак",
      description: "",
      emotionBefore: "neutral",
      emotionAfter: "neutral",
      hungerLevel: 5,
      fullnessLevel: 5,
      notes: ""
    });
    setPhotoUrl(null);
  };
  
  const handlePhotoSelect = async () => {
    const photoPath = await pickPhotoFromGallery();
    if (photoPath) {
      setFormData(prev => ({ ...prev, photoPath }));
      await loadPhoto(photoPath);
    }
  };
  
  const handlePhotoDelete = async () => {
    if (formData.photoPath) {
      try {
        await deletePhotoFromDevice(formData.photoPath);
        setFormData(prev => ({ ...prev, photoPath: undefined }));
        setPhotoUrl(null);
      } catch (error) {
        toast.error("Не удалось удалить фото");
      }
    }
  };
  
  const handleSubmit = async () => {
    try {
      const mealData: Partial<MealEntry> = {
        date: format(formData.date, "yyyy-MM-dd"),
        time: format(formData.date, "HH:mm"),
        mealType: formData.mealType,
        description: formData.description,
        photoPath: formData.photoPath,
        hungerLevel: formData.hungerLevel,
        fullnessLevel: formData.fullnessLevel,
        emotionBefore: formData.emotionBefore,
        emotionAfter: formData.emotionAfter
      };
      
      if (existingMeal?.id) {
        await appActions.updateMeal({ ...mealData, id: existingMeal.id } as MealEntry);
        toast.success("Запись обновлена");
      } else {
        await appActions.addMeal(mealData as Omit<MealEntry, "id">);
        toast.success("Запись добавлена");
      }
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error("Не удалось сохранить запись");
    }
  };
  
  const handleDelete = async () => {
    if (existingMeal?.id) {
      try {
        if (existingMeal.photoPath) {
          await deletePhotoFromDevice(existingMeal.photoPath);
        }
        
        await appActions.deleteMeal(existingMeal.id);
        toast.success("Запись удалена");
        
        onOpenChange(false);
      } catch (error) {
        toast.error("Не удалось удалить запись");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh]" aria-describedby="meal-form-description">
        <DialogHeader>
          <DialogTitle>
            {existingMeal ? "Редактирование записи" : "Запишите свой приём пищи и связанные эмоции"}
          </DialogTitle>
          <DialogDescription id="meal-form-description">
            Заполните информацию о приеме пищи
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Дата и время</label>
              <DateTimePicker 
                date={formData.date} 
                setDate={(date) => setFormData(prev => ({ ...prev, date }))}
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Тип приёма пищи</label>
              <Select 
                value={formData.mealType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, mealType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип приёма пищи" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Завтрак">Завтрак</SelectItem>
                  <SelectItem value="Обед">Обед</SelectItem>
                  <SelectItem value="Ужин">Ужин</SelectItem>
                  <SelectItem value="Перекус">Перекус</SelectItem>
                  <SelectItem value="Напиток">Напиток</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Эмоции до еды</label>
              <EmojiRating 
                value={formData.emotionBefore}
                onChange={(value) => setFormData(prev => ({ ...prev, emotionBefore: value }))}
              />
              <Textarea 
                placeholder="Ваши ощущения и эмоции до еды"
                value={formData.emotionBefore ? getEmotionLabel(formData.emotionBefore) : ""}
                onChange={(e) => {}}
                className="mt-2"
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Шкала голода: {formData.hungerLevel}
              </label>
              <Slider 
                min={1} 
                max={10} 
                step={1} 
                value={[formData.hungerLevel]} 
                onValueChange={(values) => setFormData(prev => ({ ...prev, hungerLevel: values[0] }))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Не голоден (1)</span>
                <span>Очень голоден (10)</span>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Фото блюда</label>
              {photoUrl ? (
                <div className="relative">
                  <img 
                    src={photoUrl} 
                    alt="Фото блюда" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handlePhotoDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={handlePhotoSelect} className="h-48">
                  Выбрать из галереи
                </Button>
              )}
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Описание блюда</label>
              <Textarea 
                placeholder="Что съели?"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Эмоции после еды</label>
              <EmojiRating 
                value={formData.emotionAfter}
                onChange={(value) => setFormData(prev => ({ ...prev, emotionAfter: value }))}
              />
              <Textarea 
                placeholder="Ваши ощущения и эмоции после еды"
                value={formData.emotionAfter ? getEmotionLabel(formData.emotionAfter) : ""}
                onChange={(e) => {}}
                className="mt-2"
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Шкала сытости: {formData.fullnessLevel}
              </label>
              <Slider 
                min={1} 
                max={10} 
                step={1} 
                value={[formData.fullnessLevel]} 
                onValueChange={(values) => setFormData(prev => ({ ...prev, fullnessLevel: values[0] }))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Голоден (1)</span>
                <span>Полностью сыт (10)</span>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Дополнительные заметки</label>
              <Textarea 
                placeholder="Любые дополнительные заметки..."
                value={formData.notes || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          {existingMeal && (
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
              {existingMeal ? "Сохранить изменения" : "Сохранить запись"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
