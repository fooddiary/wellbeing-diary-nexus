
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddMealForm } from "./forms/AddMealForm";
import { AddWaterForm } from "./forms/AddWaterForm";

export const AddEntryButton = () => {
  const [openMealForm, setOpenMealForm] = useState(false);
  const [openWaterForm, setOpenWaterForm] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  
  const handleAddMeal = () => {
    setOpenMealForm(true);
    setOpenPopover(false);
  };
  
  const handleAddWater = () => {
    setOpenWaterForm(true);
    setOpenPopover(false);
  };
  
  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button 
            className="rounded-full h-14 w-14 shadow-lg fixed bottom-20 right-4 z-10"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" side="top">
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="justify-start text-left"
              onClick={handleAddMeal}
            >
              🍽️ Приём пищи
            </Button>
            <Button 
              variant="outline" 
              className="justify-start text-left"
              onClick={handleAddWater}
            >
              💧 Вода
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Модальное окно для добавления приема пищи */}
      <AddMealForm 
        open={openMealForm} 
        onOpenChange={setOpenMealForm} 
      />
      
      {/* Модальное окно для добавления воды */}
      <AddWaterForm 
        open={openWaterForm} 
        onOpenChange={setOpenWaterForm} 
      />
    </>
  );
};
