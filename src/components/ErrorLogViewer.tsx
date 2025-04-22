
import { useState, useEffect } from "react";
import { LogEntry, getLogs, clearLogs, exportLogs } from "@/lib/errorLogger";
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

export const ErrorLogViewer = ({ isOpen, onClose }: Props) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const allLogs = await getLogs();
      setLogs(allLogs);
    } catch (error) {
      toast.error("Не удалось загрузить журнал ошибок");
      console.error("Ошибка при загрузке журнала:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (confirm("Вы уверены, что хотите очистить журнал ошибок?")) {
      try {
        await clearLogs();
        setLogs([]);
        toast.success("Журнал ошибок очищен");
      } catch (error) {
        toast.error("Не удалось очистить журнал ошибок");
      }
    }
  };

  const handleExportLogs = async () => {
    try {
      const result = await exportLogs();
      if (result) {
        toast.success("Журнал ошибок успешно экспортирован");
      } else {
        toast.info("Журнал ошибок пуст");
      }
    } catch (error) {
      toast.error("Не удалось экспортировать журнал ошибок");
    }
  };

  function getLevelColor(level: string): string {
    switch (level) {
      case 'error': return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      case 'warn': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
      case 'info': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      default: return 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Журнал ошибок</DialogTitle>
          <DialogDescription>
            Список всех ошибок и предупреждений, возникших в приложении
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="text-center py-12">
              <p>Загрузка журнала...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <p>Журнал ошибок пуст</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.slice().reverse().map((log, index) => (
                <div key={index} className={`p-3 rounded-lg ${getLevelColor(log.level)}`}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium capitalize">{log.level}</span>
                    <span className="text-sm opacity-70">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="font-mono text-sm">{log.message}</p>
                  
                  {log.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs">Детали</summary>
                      <pre className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded overflow-auto text-xs">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />
        
        <DialogFooter className="flex-row justify-between gap-3 sm:gap-0">
          <div>
            <Button variant="destructive" onClick={handleClearLogs} disabled={logs.length === 0}>
              Очистить журнал
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportLogs} disabled={logs.length === 0}>
              Экспорт
            </Button>
            <Button onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
