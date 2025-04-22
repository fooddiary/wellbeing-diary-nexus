
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { AppData, MealEntry, WaterEntry, WeightMetric, Settings } from "@/types/AppData";

let db: SQLiteDBConnection | null = null;
const sqlite = new SQLiteConnection(CapacitorSQLite);

export async function initDatabase() {
  if (!db) {
    db = await sqlite.createConnection("wellbeing_db", false, "no-encryption", 1, false);
    await db.open();
  }
  return db;
}

export async function closeDatabase() {
  if (db) {
    await sqlite.closeConnection("wellbeing_db", false);
    db = null;
  }
}

// MEALS OPERATIONS
export async function addMealEntry(entry: MealEntry) {
  if (!db) await initDatabase();
  const result = await db?.run(
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
  return result?.changes?.lastId;
}

export async function getMealsByDate(date: string): Promise<MealEntry[]> {
  if (!db) await initDatabase();
  const res = await db?.query(`SELECT * FROM meals WHERE date = ?`, [date]);
  return (res?.values as MealEntry[]) || [];
}

export async function getAllMeals(): Promise<MealEntry[]> {
  if (!db) await initDatabase();
  const res = await db?.query(`SELECT * FROM meals ORDER BY date DESC, time DESC`);
  return (res?.values as MealEntry[]) || [];
}

export async function updateMealEntry(entry: MealEntry) {
  if (!db) await initDatabase();
  await db?.run(
    `UPDATE meals SET 
      date = ?, mealType = ?, time = ?, description = ?, photoPath = ?,
      hungerLevel = ?, fullnessLevel = ?, emotionBefore = ?, emotionAfter = ?
    WHERE id = ?`,
    [
      entry.date, entry.mealType, entry.time, entry.description,
      entry.photoPath || null,
      entry.hungerLevel, entry.fullnessLevel,
      entry.emotionBefore, entry.emotionAfter,
      entry.id
    ]
  );
}

export async function deleteMealEntry(id: number) {
  if (!db) await initDatabase();
  await db?.run(`DELETE FROM meals WHERE id = ?`, [id]);
}

// WATER OPERATIONS
export async function addWaterEntry(entry: WaterEntry) {
  if (!db) await initDatabase();
  const result = await db?.run(
    `INSERT INTO water (date, time, amount) VALUES (?,?,?)`,
    [entry.date, entry.time, entry.amount]
  );
  return result?.changes?.lastId;
}

export async function getWaterByDate(date: string): Promise<WaterEntry[]> {
  if (!db) await initDatabase();
  const res = await db?.query(`SELECT * FROM water WHERE date = ? ORDER BY time DESC`, [date]);
  return (res?.values as WaterEntry[]) || [];
}

export async function getAllWater(): Promise<WaterEntry[]> {
  if (!db) await initDatabase();
  const res = await db?.query(`SELECT * FROM water ORDER BY date DESC, time DESC`);
  return (res?.values as WaterEntry[]) || [];
}

export async function updateWaterEntry(entry: WaterEntry) {
  if (!db) await initDatabase();
  await db?.run(
    `UPDATE water SET date = ?, time = ?, amount = ? WHERE id = ?`,
    [entry.date, entry.time, entry.amount, entry.id]
  );
}

export async function deleteWaterEntry(id: number) {
  if (!db) await initDatabase();
  await db?.run(`DELETE FROM water WHERE id = ?`, [id]);
}

// WEIGHT OPERATIONS
export async function addWeightEntry(entry: WeightMetric) {
  if (!db) await initDatabase();
  const result = await db?.run(
    `INSERT INTO weights (date, weight) VALUES (?,?)`,
    [entry.date, entry.weight]
  );
  return result?.changes?.lastId;
}

export async function getWeightsByDate(date: string): Promise<WeightMetric[]> {
  if (!db) await initDatabase();
  const res = await db?.query(`SELECT * FROM weights WHERE date = ?`, [date]);
  return (res?.values as WeightMetric[]) || [];
}

export async function getAllWeights(): Promise<WeightMetric[]> {
  if (!db) await initDatabase();
  const res = await db?.query(`SELECT * FROM weights ORDER BY date DESC`);
  return (res?.values as WeightMetric[]) || [];
}

export async function updateWeightEntry(entry: WeightMetric) {
  if (!db) await initDatabase();
  await db?.run(
    `UPDATE weights SET date = ?, weight = ? WHERE id = ?`,
    [entry.date, entry.weight, entry.id]
  );
}

export async function deleteWeightEntry(id: number) {
  if (!db) await initDatabase();
  await db?.run(`DELETE FROM weights WHERE id = ?`, [id]);
}

// SETTINGS OPERATIONS
export async function getSettings(): Promise<Settings | null> {
  if (!db) await initDatabase();
  const res = await db?.query(`SELECT * FROM settings WHERE id = 1`);
  if (res?.values && res.values.length > 0) {
    const rawSettings = res.values[0];
    return {
      theme: rawSettings.theme as "light" | "dark" | "system",
      waterWidget: Boolean(rawSettings.waterWidget),
      mealCountWidget: Boolean(rawSettings.mealCountWidget),
      weightWidget: Boolean(rawSettings.weightWidget),
      height: rawSettings.height,
      weight: rawSettings.weight
    };
  }
  return null;
}

export async function saveSettings(settings: Settings) {
  if (!db) await initDatabase();
  // Проверяем, существуют ли настройки
  const existing = await getSettings();
  
  if (existing) {
    await db?.run(
      `UPDATE settings SET 
        theme = ?, waterWidget = ?, mealCountWidget = ?, weightWidget = ?, height = ?, weight = ?
        WHERE id = 1`,
      [
        settings.theme, 
        settings.waterWidget ? 1 : 0, 
        settings.mealCountWidget ? 1 : 0, 
        settings.weightWidget ? 1 : 0,
        settings.height,
        settings.weight
      ]
    );
  } else {
    await db?.run(
      `INSERT INTO settings 
        (id, theme, waterWidget, mealCountWidget, weightWidget, height, weight)
        VALUES (1, ?, ?, ?, ?, ?, ?)`,
      [
        settings.theme, 
        settings.waterWidget ? 1 : 0, 
        settings.mealCountWidget ? 1 : 0, 
        settings.weightWidget ? 1 : 0,
        settings.height,
        settings.weight
      ]
    );
  }
}
