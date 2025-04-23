
import * as React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  showTime?: boolean;
}

export function DateTimePicker({ date, setDate, showTime = true }: DateTimePickerProps) {
  // Обработчик изменения времени
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    const [hours, minutes] = timeValue.split(":").map(Number);
    
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    setDate(newDate);
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd MMMM yyyy", { locale: ru }) : <span>Выберите дату</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(new Date(newDate))}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      {showTime && (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            type="time"
            value={format(date, "HH:mm")}
            onChange={handleTimeChange}
            className="w-24"
          />
        </div>
      )}
    </div>
  );
}
