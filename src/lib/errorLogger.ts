
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";

export interface LogEntry {
  timestamp: string;
  level: "error" | "warn" | "info";
  message: string;
  data?: any;
}

// Хранилище логов в памяти
let inMemoryLogs: LogEntry[] = [];
let isInitialized = false;
const LOG_FILE = "error_logs.json";

// Инициализация логгера
export async function initLogger(): Promise<void> {
  if (isInitialized) return;
  
  try {
    // Проверяем существует ли файл логов
    if (Capacitor.isNativePlatform()) {
      const { data } = await Filesystem.readFile({
        path: LOG_FILE,
        directory: Directory.Data,
        encoding: 'utf8',
      }).catch(() => ({ data: '[]' }));
      
      inMemoryLogs = JSON.parse(data);
    } else {
      // В веб-версии используем localStorage
      const savedLogs = localStorage.getItem('error_logs');
      if (savedLogs) {
        inMemoryLogs = JSON.parse(savedLogs);
      }
    }
    
    isInitialized = true;
  } catch (error) {
    console.error("Ошибка при инициализации логгера:", error);
    inMemoryLogs = [];
  }
}

// Общая функция для записи логов
async function writeToLog(entry: LogEntry): Promise<void> {
  if (!isInitialized) await initLogger();
  
  // Добавляем запись в память
  inMemoryLogs.push(entry);
  
  // Ограничиваем количество логов в памяти
  if (inMemoryLogs.length > 500) {
    inMemoryLogs = inMemoryLogs.slice(-500);
  }
  
  try {
    if (Capacitor.isNativePlatform()) {
      // Записываем в файл на устройстве
      await Filesystem.writeFile({
        path: LOG_FILE,
        data: JSON.stringify(inMemoryLogs),
        directory: Directory.Data,
        encoding: 'utf8',
        recursive: true
      });
    } else {
      // В веб-версии используем localStorage
      localStorage.setItem('error_logs', JSON.stringify(inMemoryLogs));
    }
  } catch (error) {
    console.error("Ошибка при записи в журнал:", error);
  }
}

// Логирование ошибок
export async function logError(message: string, data?: any): Promise<void> {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "error",
    message,
    data
  };
  
  // Выводим в консоль для отладки
  console.error(message, data);
  
  // Записываем в журнал
  await writeToLog(entry);
}

// Логирование предупреждений
export async function logWarning(message: string, data?: any): Promise<void> {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "warn",
    message,
    data
  };
  
  console.warn(message, data);
  await writeToLog(entry);
}

// Логирование информации
export async function logInfo(message: string, data?: any): Promise<void> {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: "info",
    message,
    data
  };
  
  console.info(message, data);
  await writeToLog(entry);
}

// Получение всех логов
export async function getLogs(): Promise<LogEntry[]> {
  if (!isInitialized) await initLogger();
  return [...inMemoryLogs]; // Возвращаем копию для безопасности
}

// Очистка логов
export async function clearLogs(): Promise<void> {
  inMemoryLogs = [];
  
  try {
    if (Capacitor.isNativePlatform()) {
      await Filesystem.writeFile({
        path: LOG_FILE,
        data: '[]',
        directory: Directory.Data,
        encoding: 'utf8'
      });
    } else {
      localStorage.setItem('error_logs', '[]');
    }
  } catch (error) {
    console.error("Ошибка при очистке журнала:", error);
  }
}

// Экспорт логов в файл
export async function exportLogs(): Promise<string | null> {
  if (!isInitialized) await initLogger();
  
  if (inMemoryLogs.length === 0) {
    return null;
  }
  
  const logContent = JSON.stringify(inMemoryLogs, null, 2);
  
  if (Capacitor.isNativePlatform()) {
    const fileName = `logs_${new Date().toISOString().replace(/:/g, '-')}.json`;
    await Filesystem.writeFile({
      path: fileName,
      data: logContent,
      directory: Directory.Documents,
      encoding: 'utf8'
    });
    
    return `Logs exported to Documents/${fileName}`;
  } else {
    // В веб-версии просто возвращаем содержимое
    return logContent;
  }
}
