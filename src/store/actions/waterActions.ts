
import { WaterEntry } from "@/types/AppData";
import { addWaterEntry, updateWaterEntry, deleteWaterEntry, getAllWater } from "@/lib/sqliteClient";
import { validateWater } from "@/lib/validation";
import { toast } from "@/components/ui/sonner";
import { logError } from "@/lib/errorLogger";
import { setAppState } from "../useAppStore";

export const waterActions = {
  addWater: async (water: Omit<WaterEntry, "id">) => {
    try {
      const validation = validateWater(water);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return null;
      }
      
      const id = await addWaterEntry({...water, id: 0});
      const newWater = {...water, id: id as number};
      
      const waterEntries = await getAllWater();
      setAppState({ water: waterEntries });
      
      return newWater;
    } catch (e) {
      logError('Ошибка при добавлении записи о воде', e);
      toast.error("Не удалось сохранить запись о воде");
      throw e;
    }
  },
  
  updateWater: async (water: WaterEntry) => {
    try {
      const validation = validateWater(water);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return;
      }
      
      await updateWaterEntry(water);
      const waterEntries = await getAllWater();
      setAppState({ water: waterEntries });
      
    } catch (e) {
      logError('Ошибка при обновлении записи о воде', e);
      toast.error("Не удалось обновить запись о воде");
      throw e;
    }
  },
  
  deleteWater: async (id: number) => {
    try {
      await deleteWaterEntry(id);
      const waterEntries = await getAllWater();
      setAppState({ water: waterEntries });
    } catch (e) {
      logError('Ошибка при удалении записи о воде', e);
      toast.error("Не удалось удалить запись о воде");
      throw e;
    }
  }
};
