
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { 
  savePhotoToDevice, 
  deletePhotoFromDevice,
  getPhotoUrl 
} from '@/lib/photoFileSystem';
import { toast } from '@/components/ui/sonner';
import { logError } from '@/lib/errorLogger';
import { format, subMonths, parseISO } from 'date-fns';
import { MealEntry } from '@/types/AppData';
import { getAllMeals } from '@/lib/sqliteClient';

// Функция для сжатия фотографии
const compressPhoto = async (base64Photo: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Максимальные размеры для сжатой фотографии
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;

      // Рассчитываем новые размеры, сохраняя пропорции
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      // Создаем канвас для сжатия
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Photo); // Если не можем получить контекст, возвращаем оригинал
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Возвращаем сжатое изображение в формате base64
      // Используем качество JPEG 0.7 для дополнительного сжатия
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    
    img.src = base64Photo;
  });
};

// Функция выбора фото из галереи
export const pickPhotoFromGallery = async (): Promise<string | null> => {
  try {
    // Проверяем, запущено ли приложение на мобильном устройстве
    if (Capacitor.isNativePlatform()) {
      const result = await Camera.getPhoto({
        quality: 70, // Снижаем качество для сжатия
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
      
      if (result.dataUrl) {
        // Дополнительно сжимаем фото
        const compressedPhoto = await compressPhoto(result.dataUrl);
        
        // Сохраняем в файловой системе устройства
        const fileName = `meal_${Date.now()}.jpg`;
        const path = await savePhotoToDevice(
          await (await fetch(compressedPhoto)).blob(), 
          fileName
        );
        return path;
      }
    } else {
      // Веб-версия (если нужно тестировать в браузере)
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      return new Promise((resolve) => {
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            resolve(null);
            return;
          }
          
          const reader = new FileReader();
          reader.onload = async () => {
            if (typeof reader.result === 'string') {
              // Сжимаем фото
              const compressedPhoto = await compressPhoto(reader.result);
              
              // Сохраняем в файловой системе устройства
              const fileName = `meal_${Date.now()}.jpg`;
              const path = await savePhotoToDevice(
                await (await fetch(compressedPhoto)).blob(),
                fileName
              );
              resolve(path);
            } else {
              resolve(null);
            }
          };
          reader.readAsDataURL(file);
        };
        input.click();
      });
    }
  } catch (error) {
    logError('Ошибка при выборе фото', error);
    toast.error('Не удалось загрузить фото');
    return null;
  }
  
  return null;
};

// Функция для очистки старых фото (оставить только за последние 3 месяца)
export const cleanupOldPhotos = async (keepMonths: number = 3): Promise<number> => {
  try {
    // Получаем все записи о приемах пищи
    const allMeals = await getAllMeals();
    
    // Вычисляем дату, старее которой будем удалять фото
    const cutoffDate = subMonths(new Date(), keepMonths);
    
    // Собираем все фото для удаления
    const photosToDelete: string[] = [];
    
    // Фильтруем записи, старее указанной даты и с фотографиями
    const oldMealsWithPhotos = allMeals.filter(meal => {
      const mealDate = parseISO(meal.date);
      return mealDate < cutoffDate && meal.photoPath;
    });
    
    // Собираем пути к фото для удаления
    oldMealsWithPhotos.forEach(meal => {
      if (meal.photoPath) {
        photosToDelete.push(meal.photoPath);
      }
    });
    
    // Удаляем каждое фото
    for (const photoPath of photosToDelete) {
      await deletePhotoFromDevice(photoPath);
    }
    
    return photosToDelete.length; // Возвращаем количество удаленных фото
  } catch (error) {
    logError('Ошибка при очистке старых фото', error);
    throw error;
  }
};
