
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cleanupOldPhotos } from "@/utils/photoUtils";
import { toast } from "@/components/ui/sonner";
import { useAppStore } from "@/store/useAppStore";

interface CleanupPhotosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CleanupPhotosDialog = ({ open, onOpenChange }: CleanupPhotosDialogProps) => {
  const [months, setMonths] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCleanup = async () => {
    try {
      setIsLoading(true);
      const deletedCount = await cleanupOldPhotos(months);
      toast.success(`Успешно удалено ${deletedCount} фото старше ${months} месяцев`);
      onOpenChange(false);
    } catch (error) {
      toast.error('Не удалось очистить старые фото');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Очистка старых фото</DialogTitle>
          <DialogDescription>
            Удалить фотографии старше указанного периода
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium">
              Хранить фото только за последние {months} {months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}
            </div>
            <Slider 
              min={1} 
              max={12} 
              step={1} 
              value={[months]} 
              onValueChange={(val) => setMonths(val[0])} 
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 месяц</span>
              <span>12 месяцев</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Все фото, сделанные ранее указанного периода, будут безвозвратно удалены.
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleCleanup} 
            disabled={isLoading}
          >
            {isLoading ? 'Удаление...' : 'Удалить старые фото'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
