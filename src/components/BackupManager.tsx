
import { useState, useEffect } from "react";
import { 
  createBackup, 
  getBackupList,
  restoreFromBackup,
  deleteBackup 
} from "@/lib/backupRestore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupManager = ({ isOpen, onClose }: Props) => {
  const [backups, setBackups] = useState<{name: string; date: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      loadBackups();
    }
  }, [isOpen]);

  const loadBackups = async () => {
    setLoading(true);
    try {
      const list = await getBackupList();
      setBackups(list);
    } catch (error) {
      console.error("Ошибка при загрузке списка резервных копий:", error);
      toast.error("Не удалось загрузить список резервных копий");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setProcessing(true);
    try {
      const fileName = await createBackup();
      if (fileName) {
        toast.success("Резервная копия успешно создана");
        loadBackups();
      }
    } catch (error) {
      console.error("Ошибка при создании резервной копии:", error);
      toast.error("Не удалось создать резервную копию");
    } finally {
      setProcessing(false);
    }
  };

  const handleRestore = async (backupName: string) => {
    if (confirm("Вы уверены, что хотите восстановить данные из этой резервной копии? Текущие данные могут быть потеряны.")) {
      setProcessing(true);
      try {
        await restoreFromBackup(backupName);
        toast.success("Данные успешно восстановлены");
        // В реальном приложении здесь нужно обновить состояние приложения или перезагрузить страницу
      } catch (error) {
        console.error("Ошибка при восстановлении из резервной копии:", error);
        toast.error("Не удалось восстановить данные");
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleDelete = async (backupName: string) => {
    if (confirm("Вы уверены, что хотите удалить эту резервную копию?")) {
      setProcessing(true);
      try {
        await deleteBackup(backupName);
        toast.success("Резервная копия удалена");
        loadBackups();
      } catch (error) {
        console.error("Ошибка при удалении резервной копии:", error);
        toast.error("Не удалось удалить резервную копию");
      } finally {
        setProcessing(false);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Управление резервными копиями</DialogTitle>
          <DialogDescription>
            Создавайте резервные копии данных и восстанавливайте их при необходимости
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button onClick={handleCreateBackup} disabled={processing}>
            Создать резервную копию
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="text-center py-12">
              <p>Загрузка списка резервных копий...</p>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-12">
              <p>У вас еще нет резервных копий</p>
              <p className="text-sm text-gray-500 mt-2">
                Создайте резервную копию, чтобы сохранить ваши данные
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">Резервная копия</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(backup.date)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRestore(backup.name)}
                      disabled={processing}
                    >
                      Восстановить
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(backup.name)}
                      disabled={processing}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="my-4" />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
