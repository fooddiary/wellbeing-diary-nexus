
import { WeightMetric } from "@/types/AppData";
import { addWeightEntry, updateWeightEntry, deleteWeightEntry, getAllWeights } from "@/lib/sqliteClient";
import { validateWeight } from "@/lib/validation";
import { toast } from "@/components/ui/sonner";
import { logError } from "@/lib/errorLogger";
import { setAppState } from "../useAppStore";

export const weightActions = {
  addWeight: async (weight: Omit<WeightMetric, "id">) => {
    try {
      const validation = validateWeight(weight);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return null;
      }
      
      const id = await addWeightEntry({...weight, id: 0});
      const newWeight = {...weight, id: id as number};
      
      const weights = await getAllWeights();
      setAppState({ weights });
      
      return newWeight;
    } catch (e) {
      logError('Ошибка при добавлении веса', e);
      toast.error("Не удалось сохранить вес");
      throw e;
    }
  },
  
  updateWeight: async (weight: WeightMetric) => {
    try {
      const validation = validateWeight(weight);
      if (!validation.valid) {
        toast.error(`Ошибка: ${validation.errors?.join(", ")}`);
        return;
      }
      
      await updateWeightEntry(weight);
      const weights = await getAllWeights();
      setAppState({ weights });
      
    } catch (e) {
      logError('Ошибка при обновлении веса', e);
      toast.error("Не удалось обновить вес");
      throw e;
    }
  },
  
  deleteWeight: async (id: number) => {
    try {
      await deleteWeightEntry(id);
      const weights = await getAllWeights();
      setAppState({ weights });
    } catch (e) {
      logError('Ошибка при удалении веса', e);
      toast.error("Не удалось удалить вес");
      throw e;
    }
  }
};
