
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { format, parseISO, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { getPhotoUrl } from "@/lib/photoFileSystem";
import type { MealEntry } from "@/types/AppData";

interface EnrichedMealEntry extends MealEntry {
  photoUrl?: string;
}

const DiaryPage = () => {
  const [state] = useAppStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateEntries, setDateEntries] = useState<Array<
    | ({ type: "meal" } & EnrichedMealEntry)
    | ({ type: "water"; amount: number; time: string; date: string; id: number })
  >>([]);

  // Загружаем записи для выбранной даты
  useEffect(() => {
    const fetchEntries = async () => {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      // Фильтруем записи за выбранную дату
      const mealsForDate = state.meals.filter(meal => meal.date === dateString);
      const waterForDate = state.water.filter(water => water.date === dateString);
      
      // Загружаем URL фотографий для приёмов пищи
      const enrichedMeals = await Promise.all(
        mealsForDate.map(async (meal) => {
          let photoUrl = undefined;
          if (meal.photoPath) {
            try {
              photoUrl = await getPhotoUrl(meal.photoPath);
            } catch (e) {
              console.error('Failed to load photo for meal:', meal.id);
            }
          }
          return { 
            ...meal, 
            type: 'meal' as const, 
            photoUrl 
          };
        })
      );
      
      // Преобразуем записи о воде
      const enrichedWater = waterForDate.map(water => ({
        ...water,
        type: 'water' as const
      }));
      
      // Объединяем и сортируем по времени
      const allEntries = [...enrichedMeals, ...enrichedWater]
        .sort((a, b) => {
          return b.time.localeCompare(a.time); // Сортировка от более поздних к ранним
        });
      
      setDateEntries(allEntries);
    };
    
    fetchEntries();
  }, [state.meals, state.water, selectedDate]);

  // Форматируем дату для отображения
  const formattedDate = format(selectedDate, "EEEE, d MMMM", { locale: ru });

  // Переход на предыдущий день
  const goToPreviousDay = () => {
    setSelectedDate(current => addDays(current, -1));
  };

  // Переход на следующий день
  const goToNextDay = () => {
    setSelectedDate(current => addDays(current, 1));
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

      {dateEntries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">Нет записей</h3>
          <p className="text-gray-500">
            Добавьте приём пищи или воды через кнопку "+"
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {dateEntries.map((entry) => (
            <div 
              key={`${entry.type}-${entry.id}`} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            >
              {entry.type === "meal" ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{entry.mealType}</div>
                    <div className="text-sm text-gray-500">{entry.time}</div>
                  </div>
                  
                  {entry.photoUrl ? (
                    <div className="h-32 bg-gray-200 rounded mb-2 flex items-center justify-center overflow-hidden">
                      <img 
                        src={entry.photoUrl} 
                        alt={`Фото: ${entry.description}`} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : entry.photoPath && (
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
