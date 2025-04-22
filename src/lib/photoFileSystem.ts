
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
    encoding: Encoding.BASE64
  });
  return path;
}

// Получить фото (base64)
export async function readPhotoFromDevice(path: string): Promise<string> {
  const file = await Filesystem.readFile({
    path,
    directory: Directory.Data,
    encoding: Encoding.BASE64
  });
  return file.data;
}
