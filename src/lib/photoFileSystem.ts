
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

// Сохраняет фото на устройство и возвращает путь
export async function savePhotoToDevice(file: Blob, fileName: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const path = `photos/${fileName}`;
  await Filesystem.writeFile({
    path,
    data: base64,
    directory: Directory.Data,
    encoding: Encoding.UTF8  // Используем UTF8 для сохранения base64-кодированных данных
  });
  return path;
}

// Получить фото (base64)
export async function readPhotoFromDevice(path: string): Promise<string> {
  const file = await Filesystem.readFile({
    path,
    directory: Directory.Data,
    encoding: Encoding.UTF8  // Используем UTF8 для чтения base64-кодированных данных
  });
  return file.data as string;  // Возвращаем base64-строку
}

// Создание директории для фото при инициализации
export async function initPhotoDirectory() {
  try {
    await Filesystem.mkdir({
      path: 'photos',
      directory: Directory.Data,
      recursive: true
    });
  } catch (e) {
    // Директория уже может существовать - игнорируем ошибку
    console.log('Photo directory already exists or error:', e);
  }
}

// Удалить фото с устройства
export async function deletePhotoFromDevice(path: string): Promise<void> {
  try {
    await Filesystem.deleteFile({
      path,
      directory: Directory.Data
    });
  } catch (e) {
    console.error('Error deleting photo:', e);
  }
}

// Получить URL для фото (можно использовать в src для <img>)
export async function getPhotoUrl(path: string): Promise<string> {
  try {
    const base64Data = await readPhotoFromDevice(path);
    return `data:image/jpeg;base64,${base64Data}`;
  } catch (e) {
    console.error('Error getting photo URL:', e);
    return '';
  }
}
