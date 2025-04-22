
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { AppData, MealEntry, WaterEntry, WeightMetric, Settings } from "@/types/AppData";

let db: SQLiteDBConnection | null = null;
const sqlite = new SQLiteConnection(CapacitorSQLite);

export async function initDatabase() {
  if (!db) {
    // Fix: Adding the missing 5th argument (version number) to createConnection
    db = await sqlite.createConnection("wellbeing_db", false, "no-encryption", 1, false);
    await db.open();
  }
  // Schema, see below for detailed SQL
  return db;
}

export async function closeDatabase() {
  if (db) {
    await sqlite.closeConnection("wellbeing_db", false);
    db = null;
  }
}

// Пример операций CRUD для еды:
export async function addMealEntry(entry: MealEntry) {
  if (!db) await initDatabase();
  await db?.run(
    `INSERT INTO meals 
      (date, mealType, time, description, photoPath, hungerLevel, fullnessLevel, emotionBefore, emotionAfter)
        VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      entry.date, entry.mealType, entry.time, entry.description,
      entry.photoPath || null,
      entry.hungerLevel, entry.fullnessLevel,
      entry.emotionBefore, entry.emotionAfter
    ]
  );
}

export async function getMealsByDate(date: string): Promise<MealEntry[]> {
  if (!db) await initDatabase();
  const res = await db?.query(`SELECT * FROM meals WHERE date = ?`, [date]);
  return (res?.values as MealEntry[]) || [];
}

// ...другие CRUD по аналогии...

