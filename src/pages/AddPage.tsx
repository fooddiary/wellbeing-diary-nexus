
import { useParams, Navigate } from "react-router-dom";
import { useState } from "react";

// Meal form component
const MealForm = () => {
  const [mealType, setMealType] = useState("Завтрак");
  const [emotionBefore, setEmotionBefore] = useState("");
  const [emotionAfter, setEmotionAfter] = useState("");
  const [hungerLevel, setHungerLevel] = useState(5);
  const [fullnessLevel, setFullnessLevel] = useState(5);
  const [description, setDescription] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      mealType,
      emotionBefore,
      emotionAfter,
      hungerLevel,
      fullnessLevel,
      description
    });
    // Here we would save the meal entry
    alert("Запись о приёме пищи сохранена!");
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">🍲 Добавить приём пищи</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Тип приёма пищи</label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="w-full rounded border border-gray-300 p-2"
        >
          <option value="Завтрак">Завтрак</option>
          <option value="Обед">Обед</option>
          <option value="Ужин">Ужин</option>
          <option value="Перекус">Перекус</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Эмоции до</label>
          <input
            type="text"
            placeholder="Как вы себя чувствовали?"
            value={emotionBefore}
            onChange={(e) => setEmotionBefore(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Эмоции после</label>
          <input
            type="text"
            placeholder="Как вы себя чувствуете?"
            value={emotionAfter}
            onChange={(e) => setEmotionAfter(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Уровень голода (1-10): {hungerLevel}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={hungerLevel}
          onChange={(e) => setHungerLevel(Number(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Уровень сытости (1-10): {fullnessLevel}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={fullnessLevel}
          onChange={(e) => setFullnessLevel(Number(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Фотография</label>
        <button
          type="button"
          className="w-full border-2 border-dashed border-gray-300 rounded p-4 text-center"
        >
          Добавить фото
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Описание блюда</label>
        <textarea
          placeholder="Опишите, что вы ели..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 h-24"
        ></textarea>
      </div>
      
      <button
        type="submit"
        className="w-full bg-primary text-white py-3 rounded font-medium"
      >
        Сохранить
      </button>
    </form>
  );
};

// Water form component
const WaterForm = () => {
  const [volume, setVolume] = useState(250);
  const [thirstLevel, setThirstLevel] = useState(5);
  const [notes, setNotes] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      volume,
      thirstLevel,
      notes
    });
    // Here we would save the water entry
    alert("Запись о воде сохранена!");
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">💧 Добавить воду</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Объём (мл): {volume} мл
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>50 мл</span>
          <span>1000 мл</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Уровень жажды (1-10): {thirstLevel}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={thirstLevel}
          onChange={(e) => setThirstLevel(Number(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Заметки</label>
        <textarea
          placeholder="Дополнительные заметки..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 h-24"
        ></textarea>
      </div>
      
      <button
        type="submit"
        className="w-full bg-primary text-white py-3 rounded font-medium"
      >
        Сохранить
      </button>
    </form>
  );
};

// Main AddPage component
const AddPage = () => {
  const { type } = useParams<{ type: string }>();
  
  if (type === "meal") {
    return <MealForm />;
  } else if (type === "water") {
    return <WaterForm />;
  }
  
  // Redirect to home if no valid type
  return <Navigate to="/" />;
};

export default AddPage;
