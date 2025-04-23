import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { format, parseISO, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { getPhotoUrl } from "@/lib/photoFileSystem";
import type { MealEntry, WaterEntry } from "@/types/AppData";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { AddMealForm } from "@/components/forms/AddMealForm";
import { AddWaterForm } from "@/components/forms/AddWaterForm";
import { CleanupPhotosDialog } from "@/components/CleanupPhotosDialog";
import { Search, Calendar as CalendarIcon, MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface EnrichedMealEntry extends MealEntry {
  photoUrl?: string;
}

type DiaryEntry = 
  | ({ type: "meal" } & EnrichedMealEntry)
  | ({ type: "water" } & WaterEntry);

const DiaryPage = () => {
  const [state] = useAppStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateEntries, setDateEntries] = useState<DiaryEntry[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [cleanupModalOpen, setCleanupModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | undefined>(undefined);

  useEffect(() => {
    const fetchEntries = async () => {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      const mealsForDate = state.meals.filter(meal => meal.date === dateString);
      const waterForDate = state.water.filter(water => water.date === dateString);
      
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
      
      const enrichedWater = waterForDate.map(water => ({
        ...water,
        type: 'water' as const
      }));
      
      const allEntries = [...enrichedMeals, ...enrichedWater]
        .sort((a, b) => {
          return b.time.localeCompare(a.time);
        });
      
      setDateEntries(allEntries);
    };
    
    fetchEntries();
  }, [state.meals, state.water, selectedDate]);

  const formattedDate = format(selectedDate, "EEEE, d MMMM", { locale: ru });

  const goToPreviousDay = () => {
    setSelectedDate(current => addDays(current, -1));
  };

  const goToNextDay = () => {
    setSelectedDate(current => addDays(current, 1));
  };

  const openAddMealModal = () => {
    setSelectedEntry(undefined);
    setMealModalOpen(true);
  };

  const openAddWaterModal = () => {
    setSelectedEntry(undefined);
    setWaterModalOpen(true);
  };

  const openEditEntryModal = (entry: DiaryEntry) => {
    setSelectedEntry(entry);
    if (entry.type === "meal") {
      setMealModalOpen(true);
    } else {
      setWaterModalOpen(true);
    }
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
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Календарь
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                }
              }}
              className={cn("pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Поиск
          </Button>
        </div>
      </div>

      {dateEntries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">Нет записей</h3>
          <p className="text-gray-500">
            Добавьте приём пищи или воды через кнопки выше
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
                    <div className="flex items-center">
                      <div className="text-sm text-gray-500 mr-2">{entry.time}</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditEntryModal(entry)}>
                            Редактировать
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500 mr-2">{entry.time}</div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditEntryModal(entry)}>
                          Редактировать
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AddMealForm 
        open={mealModalOpen} 
        onOpenChange={setMealModalOpen}
        existingMeal={selectedEntry?.type === "meal" ? selectedEntry : undefined}
      />
      
      <AddWaterForm 
        open={waterModalOpen} 
        onOpenChange={setWaterModalOpen}
        existingWater={selectedEntry?.type === "water" ? selectedEntry : undefined}
      />
      
      <CleanupPhotosDialog 
        open={cleanupModalOpen} 
        onOpenChange={setCleanupModalOpen}
      />
    </div>
  );
};

export default DiaryPage;
