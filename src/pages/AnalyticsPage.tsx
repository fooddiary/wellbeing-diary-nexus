
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AnalyticsPage = () => {
  const [period, setPeriod] = useState("week");
  
  // Dummy data for charts
  const waterData = [
    { day: "Пн", amount: 1800 },
    { day: "Вт", amount: 2200 },
    { day: "Ср", amount: 1600 },
    { day: "Чт", amount: 2400 },
    { day: "Пт", amount: 2000 },
    { day: "Сб", amount: 1700 },
    { day: "Вс", amount: 2100 },
  ];
  
  const weightData = [
    { date: "1 апр", value: 72.5 },
    { date: "8 апр", value: 72.3 },
    { date: "15 апр", value: 71.8 },
    { date: "22 апр", value: 71.5 },
    { date: "29 апр", value: 71.2 },
  ];
  
  const mealTimesData = [
    { meal: "Завтрак", time: 8 },
    { meal: "Обед", time: 13 },
    { meal: "Полдник", time: 16 },
    { meal: "Ужин", time: 19 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Аналитика</h2>
        
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
          <option value="year">Год</option>
        </select>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4">💧 Потребление воды</h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2A9D8F" name="Вода (мл)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4">⚖️ Динамика веса</h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip />
              <Bar dataKey="value" fill="#264653" name="Вес (кг)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4">🕒 Время приёмов пищи</h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mealTimesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="meal" />
              <YAxis domain={[0, 24]} ticks={[0, 4, 8, 12, 16, 20, 24]} />
              <Tooltip />
              <Bar dataKey="time" fill="#E9C46A" name="Время (часы)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
