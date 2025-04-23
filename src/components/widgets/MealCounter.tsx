
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { Utensils } from "lucide-react";
import { AddMealForm } from "@/components/forms/AddMealForm";
import { format } from "date-fns";

export const MealCounter = () => {
  const [appState] = useAppStore();
  const [openMealForm, setOpenMealForm] = useState(false);
  
  // Получаем текущую дату в формате yyyy-MM-dd
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Получаем все записи о приемах пищи за текущий день
  const todayMealEntries = appState.meals.filter(entry => entry.date === today);
  
  // Количество приемов пищи за сегодня
  const mealCount = todayMealEntries.length;
  
  // Группировка по типам приемов пищи
  const mealTypes = todayMealEntries.reduce((types, meal) => {
    const type = meal.mealType;
    types[type] = (types[type] || 0) + 1;
    return types;
  }, {} as Record<string, number>);
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Приёмы пищи</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{mealCount}</div>
        <p className="text-xs text-muted-foreground">Сегодня</p>
        
        {/* Показываем типы приемов пищи */}
        <div className="mt-3 space-y-1">
          {Object.entries(mealTypes).map(([type, count]) => (
            <div key={type} className="flex justify-between text-xs">
              <span>{type}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setOpenMealForm(true)}
        >
          + Добавить приём пищи
        </Button>
      </CardFooter>
      
      {/* Модальное окно для добавления приема пищи */}
      <AddMealForm 
        open={openMealForm} 
        onOpenChange={setOpenMealForm} 
      />
    </Card>
  );
};
