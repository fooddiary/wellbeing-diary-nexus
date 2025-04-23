
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface AppInfoDialogProps {
  trigger?: React.ReactNode;
}

export const AppInfoDialog = ({ trigger }: AppInfoDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Info className="mr-2 h-4 w-4" />
            Информация о приложении
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Дневник питания</DialogTitle>
          <DialogDescription>
            Ведение дневника питания — это мощный инструмент для улучшения здоровья и осознанного отношения к еде
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <img 
            src="/lovable-uploads/7e6409d3-afbe-4ee4-9423-53b0cfc43bd9.png" 
            alt="Дневник питания" 
            className="w-24 h-24 mx-auto"
          />
          
          <div className="space-y-2">
            <h3 className="font-medium">Преимущества ведения дневника:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Контроль веса и похудение</li>
              <li>Анализ связи «еда — самочувствие»</li>
              <li>Формирование осознанности</li>
              <li>Медицинские показания (диабет, аллергии и др.)</li>
              <li>Спортивные цели</li>
              <li>Контроль детского рациона</li>
            </ul>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">
              Если вы хотите узнать больше о теле, здоровье и психологии, переходите 
              в Telegram-канал <a href="https://t.me/ktelu_nezhno" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@ktelu_nezhno</a>
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Контакт для предложений: <a href="mailto:mobil2008@inbox.ru" className="text-primary hover:underline">mobil2008@inbox.ru</a>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm">
            <a href="/terms" className="no-underline">Условия использования</a>
          </Button>
          <Button variant="secondary" size="sm">
            <a href="/privacy" className="no-underline">Политика конфиденциальности</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
