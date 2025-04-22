
import { useState } from "react";

// Example diary entries - in a real app, this would come from a database or local storage
const dummyEntries = [
  {
    id: 1,
    type: "meal",
    mealType: "Завтрак",
    time: "08:30",
    description: "Овсянка с фруктами и йогурт",
    hasImage: true,
    date: new Date().toISOString(),
  },
  {
    id: 2,
    type: "water",
    amount: 300,
    time: "10:15",
    date: new Date().toISOString(),
  },
  {
    id: 3,
    type: "meal",
    mealType: "Обед",
    time: "13:00",
    description: "Салат с курицей и цельнозерновой хлеб",
    hasImage: false,
    date: new Date().toISOString(),
  },
];

const DiaryPage = () => {
  const [entries, setEntries] = useState(dummyEntries);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format the date for display
  const formattedDate = new Intl.DateTimeFormat("ru", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={goToPreviousDay}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <h2 className="text-lg font-medium capitalize">{formattedDate}</h2>

        <button 
          onClick={goToNextDay}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow flex items-center">
          <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          Календарь
        </button>
        
        <button className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow flex items-center">
          <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          Поиск
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">Нет записей</h3>
          <p className="text-gray-500">
            Добавьте приём пищи или воды через кнопку "+"
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            >
              {entry.type === "meal" ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{entry.mealType}</div>
                    <div className="text-sm text-gray-500">{entry.time}</div>
                  </div>
                  
                  {entry.hasImage && (
                    <div className="h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-gray-500">Фото блюда</span>
                    </div>
                  )}
                  
                  <p className="text-sm">{entry.description}</p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">💧</span>
                    <div>
                      <div className="font-medium">{entry.amount} мл воды</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{entry.time}</div>
                </div>
              )}
              
              <div className="mt-3 flex justify-end">
                <button className="text-gray-500 hover:text-gray-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiaryPage;
