
import { initDatabase } from "./sqliteClient";

export async function setupDatabase() {
  const db = await initDatabase();
  // Основные таблицы
  await db?.execute(`
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      mealType TEXT,
      time TEXT,
      description TEXT,
      photoPath TEXT,
      hungerLevel INTEGER,
      fullnessLevel INTEGER,
      emotionBefore TEXT,
      emotionAfter TEXT
    );
    CREATE TABLE IF NOT EXISTS water (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      time TEXT,
      amount INTEGER
    );
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      theme TEXT,
      waterWidget INTEGER,
      mealCountWidget INTEGER,
      weightWidget INTEGER,
      height INTEGER,
      weight INTEGER
    );
    CREATE TABLE IF NOT EXISTS weights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      weight INTEGER
    );
  `);
  return db;
}
