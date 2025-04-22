
import { useState } from "react";

const SettingsPage = () => {
  const [theme, setTheme] = useState("light");
  const [waterWidget, setWaterWidget] = useState(true);
  const [mealCountWidget, setMealCountWidget] = useState(true);
  const [weightWidget, setWeightWidget] = useState(true);
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  
  const handleSaveSettings = () => {
    // Here we would save settings to local storage or a database
    alert("Настройки сохранены!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Настройки</h2>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">⚙️ Основные</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex justify-between items-center">
                <span>🌓 Тема</span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="border border-gray-300 rounded p-2"
                >
                  <option value="light">Светлая</option>
                  <option value="dark">Тёмная</option>
                  <option value="system">Системная</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">📊 Управление виджетами</h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>💧 Индикатор воды</span>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                <input
                  type="checkbox"
                  id="waterWidget"
                  checked={waterWidget}
                  onChange={(e) => setWaterWidget(e.target.checked)}
                  className="absolute w-0 h-0 opacity-0"
                />
                <label
                  htmlFor="waterWidget"
                  className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                    waterWidget ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${
                      waterWidget ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </label>
              </div>
            </label>
            
            <label className="flex items-center justify-between">
              <span>🍽️ Счётчик приёмов пищи</span>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                <input
                  type="checkbox"
                  id="mealCountWidget"
                  checked={mealCountWidget}
                  onChange={(e) => setMealCountWidget(e.target.checked)}
                  className="absolute w-0 h-0 opacity-0"
                />
                <label
                  htmlFor="mealCountWidget"
                  className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                    mealCountWidget ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${
                      mealCountWidget ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </label>
              </div>
            </label>
            
            <label className="flex items-center justify-between">
              <span>⚖️ Вес</span>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                <input
                  type="checkbox"
                  id="weightWidget"
                  checked={weightWidget}
                  onChange={(e) => setWeightWidget(e.target.checked)}
                  className="absolute w-0 h-0 opacity-0"
                />
                <label
                  htmlFor="weightWidget"
                  className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                    weightWidget ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${
                      weightWidget ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </label>
              </div>
            </label>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">📦 Личные данные</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Рост (см)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Вес (кг)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Используется для расчёта рекомендаций по воде
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">🔒 Безопасность</h3>
          
          <div className="space-y-4">
            <button className="w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 py-2 rounded">
              Создать резервную копию
            </button>
            
            <div className="flex items-center justify-between">
              <span>Очистка старых фото</span>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                <input
                  type="checkbox"
                  id="autoCleanup"
                  className="absolute w-0 h-0 opacity-0"
                />
                <label
                  htmlFor="autoCleanup"
                  className="block h-6 overflow-hidden rounded-full bg-gray-300 cursor-pointer"
                >
                  <span className="block h-6 w-6 rounded-full bg-white transform transition-transform duration-200"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSaveSettings}
          className="w-full bg-primary text-white py-3 rounded font-medium"
        >
          Сохранить настройки
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
