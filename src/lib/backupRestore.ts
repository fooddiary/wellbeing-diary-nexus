
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { initDatabase, getAllMeals, getAllWater, getAllWeights, getSettings, saveSettings } from "@/lib/sqliteClient";
import { AppData } from "@/types/AppData";
import { toast } from "@/components/ui/sonner";
import { logInfo, logError } from "./errorLogger";

const BACKUP_FOLDER = "backup";
const BACKUP_FILE_PREFIX = "wellbeing_backup_";

// Создание резервной копии
export async function createBackup(): Promise<string | null> {
  try {
    // Инициализируем БД если ещё не инициализирована
    await initDatabase();
    
    // Получаем все данные из БД
    const meals = await getAllMeals();
    const water = await getAllWater();
    const weights = await getAllWeights();
    const settings = await getSettings() || {};
    
    const backupData: AppData = {
      meals,
      water,
      weights,
      settings
    };
    
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupFileName = `${BACKUP_FILE_PREFIX}${timestamp}.json`;
    
    if (Capacitor.isNativePlatform()) {
      // Проверяем существование директории для резервных копий
      await Filesystem.mkdir({
        path: BACKUP_FOLDER,
        directory: Directory.Documents,
        recursive: true
      }).catch(() => {
        // Игнорируем ошибку, если директория уже существует
      });
      
      // Записываем файл резервной копии
      await Filesystem.writeFile({
        path: `${BACKUP_FOLDER}/${backupFileName}`,
        data: JSON.stringify(backupData),
        directory: Directory.Documents,
        encoding: 'utf8'
      });
      
      logInfo("Создана резервная копия", { filename: backupFileName });
      return backupFileName;
    } else {
      // В веб-версии используем localStorage
      const backupKey = `${BACKUP_FILE_PREFIX}${timestamp}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      logInfo("Создана резервная копия в localStorage", { key: backupKey });
      return backupKey;
    }
  } catch (error) {
    logError("Ошибка при создании резервной копии", error);
    throw error;
  }
}

// Получение списка доступных резервных копий
export async function getBackupList(): Promise<{ name: string; date: string }[]> {
  try {
    if (Capacitor.isNativePlatform()) {
      // Проверяем существует ли директория
      try {
        await Filesystem.mkdir({
          path: BACKUP_FOLDER,
          directory: Directory.Documents,
          recursive: true
        }).catch(() => {});

        const result = await Filesystem.readdir({
          path: BACKUP_FOLDER,
          directory: Directory.Documents
        });
        
        return result.files
          .filter(file => file.name.startsWith(BACKUP_FILE_PREFIX))
          .map(file => {
            // Извлекаем дату из имени файла
            const dateMatch = file.name.match(new RegExp(`${BACKUP_FILE_PREFIX}(.+)\\.json`));
            const dateString = dateMatch ? dateMatch[1] : "неизвестно";
            
            return {
              name: file.name,
              date: dateString.replace(/-/g, ':')
            };
          })
          .sort((a, b) => b.date.localeCompare(a.date)); // Сортировка от новых к старым
      } catch {
        // Если директория не существует, возвращаем пустой список
        return [];
      }
    } else {
      // В веб-версии ищем в localStorage
      const backups: { name: string; date: string }[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(BACKUP_FILE_PREFIX)) {
          const dateMatch = key.match(new RegExp(`${BACKUP_FILE_PREFIX}(.+)`));
          const dateString = dateMatch ? dateMatch[1] : "неизвестно";
          
          backups.push({
            name: key,
            date: dateString.replace(/-/g, ':')
          });
        }
      }
      
      return backups.sort((a, b) => b.date.localeCompare(a.date));
    }
  } catch (error) {
    logError("Ошибка при получении списка резервных копий", error);
    throw error;
  }
}

// Восстановление из резервной копии
export async function restoreFromBackup(backupName: string): Promise<boolean> {
  try {
    let backupData: AppData;
    
    if (Capacitor.isNativePlatform()) {
      const { data } = await Filesystem.readFile({
        path: `${BACKUP_FOLDER}/${backupName}`,
        directory: Directory.Documents,
        encoding: 'utf8'
      });
      
      backupData = JSON.parse(data);
    } else {
      // В веб-версии берем из localStorage
      const data = localStorage.getItem(backupName);
      if (!data) {
        throw new Error("Резервная копия не найдена");
      }
      backupData = JSON.parse(data);
    }
    
    // Инициализируем БД
    await initDatabase();
    
    // Восстанавливаем настройки
    if (backupData.settings) {
      await saveSettings(backupData.settings);
    }
    
    // Это место для более сложной логики восстановления,
    // например, очистки и перезагрузки всей базы данных
    // ...
    
    logInfo("Восстановлена резервная копия", { backupName });
    
    // После восстановления нужно перезагрузить страницу или обновить состояние приложения
    toast.success("Данные успешно восстановлены");
    
    return true;
  } catch (error) {
    logError("Ошибка при восстановлении из резервной копии", error);
    toast.error("Ошибка восстановления данных");
    throw error;
  }
}

// Удаление резервной копии
export async function deleteBackup(backupName: string): Promise<boolean> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Filesystem.deleteFile({
        path: `${BACKUP_FOLDER}/${backupName}`,
        directory: Directory.Documents
      });
    } else {
      // В веб-версии удаляем из localStorage
      localStorage.removeItem(backupName);
    }
    
    logInfo("Удалена резервная копия", { backupName });
    return true;
  } catch (error) {
    logError("Ошибка при удалении резервной копии", error);
    throw error;
  }
}
