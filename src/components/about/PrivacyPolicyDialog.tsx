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
import { Shield } from "lucide-react";

interface PrivacyPolicyDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const PrivacyPolicyDialog = ({ trigger, open, onOpenChange }: PrivacyPolicyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Shield className="mr-2 h-4 w-4" />
            Политика конфиденциальности
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Политика конфиденциальности</DialogTitle>
          <DialogDescription>
            Последнее обновление: 23 апреля 2025 г.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <p>
            Настоящая Политика конфиденциальности описывает, как приложение "Дневник питания" собирает, использует и раскрывает вашу информацию при использовании нашего мобильного приложения.
          </p>
          
          <h3 className="text-lg font-medium">1. Собираемая информация</h3>
          <p>
            Приложение "Дневник питания" собирает следующие типы данных:
          </p>
          <ul className="list-disc pl-5">
            <li>Информацию о приемах пищи, включая фотографии блюд</li>
            <li>Данные о потреблении воды</li>
            <li>Информацию о физических показателях (вес, рост и т.д.)</li>
            <li>Заметки и комментарии, которые вы добавляете</li>
            <li>Информацию о настройках приложения</li>
          </ul>
          
          <h3 className="text-lg font-medium">2. Использование информации</h3>
          <p>
            Мы используем собранную информацию для:
          </p>
          <ul className="list-disc pl-5">
            <li>Предоставления функций приложения</li>
            <li>Улучшения и персонализации вашего опыта</li>
            <li>Разработки новых продуктов и функций</li>
            <li>Анализа использования приложения</li>
          </ul>
          
          <h3 className="text-lg font-medium">3. Хранение данных</h3>
          <p>
            Ваши данные хранятся локально на вашем устройстве. Вы можете создавать резервные копии данных, которые будут храниться в зашифрованном виде.
          </p>
          
          <h3 className="text-lg font-medium">4. Передача данных третьим лицам</h3>
          <p>
            Мы не продаем и не передаем ваши данные третьим лицам, за исключением случаев, когда:
          </p>
          <ul className="list-disc pl-5">
            <li>Вы дали на это явное согласие</li>
            <li>Это требуется по закону или необходимо для защиты наших прав</li>
          </ul>
          
          <h3 className="text-lg font-medium">5. Безопасность</h3>
          <p>
            Мы принимаем разумные меры для защиты ваших данных от несанкционированного доступа, изменения, раскрытия или уничтожения.
          </p>
          
          <h3 className="text-lg font-medium">6. Ваши права</h3>
          <p>
            Вы имеете право:
          </p>
          <ul className="list-disc pl-5">
            <li>Получать доступ к своим данным</li>
            <li>Исправлять неточные данные</li>
            <li>Удалять свои данные</li>
            <li>Экспортировать свои данные</li>
          </ul>
          
          <h3 className="text-lg font-medium">7. Изменения в политике конфиденциальности</h3>
          <p>
            Мы можем обновлять нашу Политику конфиденциальности время от времени. Мы уведомим вас о любых изменениях, разместив новую Политику конфиденциальности на этой странице.
          </p>
          
          <h3 className="text-lg font-medium">8. Контакты</h3>
          <p>
            Если у вас есть вопросы или предложения относительно нашей Политики конфиденциальности, пожалуйста, свяжитесь с нами по адресу: <a href="mailto:mobil2008@inbox.ru" className="text-primary hover:underline">mobil2008@inbox.ru</a>
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={() => { if(onOpenChange) onOpenChange(false); }}>Понятно</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
