
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
import { FileText } from "lucide-react";

interface TermsOfUseDialogProps {
  trigger?: React.ReactNode;
}

export const TermsOfUseDialog = ({ trigger }: TermsOfUseDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Условия использования
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Условия использования</DialogTitle>
          <DialogDescription>
            Последнее обновление: 23 апреля 2025 г.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <p>
            Пожалуйста, внимательно прочитайте данные условия использования перед использованием приложения "Дневник питания".
          </p>
          
          <h3 className="text-lg font-medium">1. Принятие условий</h3>
          <p>
            Используя приложение "Дневник питания", вы соглашаетесь с настоящими условиями использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наше приложение.
          </p>
          
          <h3 className="text-lg font-medium">2. Изменения условий</h3>
          <p>
            Мы оставляем за собой право изменять или заменять эти условия по нашему усмотрению. Если изменения существенны, мы постараемся уведомить вас за 30 дней до введения новых условий.
          </p>
          
          <h3 className="text-lg font-medium">3. Использование приложения</h3>
          <p>
            Приложение "Дневник питания" предназначено для отслеживания приема пищи, воды и других параметров здоровья. Вы соглашаетесь не использовать приложение для незаконных целей или в нарушение каких-либо законов в вашей юрисдикции.
          </p>
          
          <h3 className="text-lg font-medium">4. Медицинская оговорка</h3>
          <p>
            Приложение "Дневник питания" не предоставляет медицинские советы или диагностику. Информация в приложении предназначена только для информационных целей. Всегда консультируйтесь с квалифицированным медицинским специалистом перед началом любой диеты или программы упражнений.
          </p>
          
          <h3 className="text-lg font-medium">5. Ваша учетная запись</h3>
          <p>
            Вы несете ответственность за сохранность ваших данных и за все действия, которые происходят с вашим приложением.
          </p>
          
          <h3 className="text-lg font-medium">6. Интеллектуальная собственность</h3>
          <p>
            Приложение "Дневник питания" и его оригинальный контент, функции и функциональность являются собственностью разработчиков приложения и защищены международными законами об авторском праве и товарных знаках.
          </p>
          
          <h3 className="text-lg font-medium">7. Ограничение ответственности</h3>
          <p>
            Приложение "Дневник питания" предоставляется "как есть", без каких-либо гарантий, явных или подразумеваемых. Мы не несем ответственности за какие-либо убытки, возникшие в результате использования нашего приложения.
          </p>
          
          <h3 className="text-lg font-medium">8. Прекращение действия</h3>
          <p>
            Мы можем прекратить или приостановить ваш доступ к нашему приложению немедленно, без предварительного уведомления или ответственности, по любой причине, включая, без ограничений, нарушение условий использования.
          </p>
          
          <h3 className="text-lg font-medium">9. Контакты</h3>
          <p>
            Если у вас есть вопросы об этих условиях, пожалуйста, свяжитесь с нами по адресу: <a href="mailto:mobil2008@inbox.ru" className="text-primary hover:underline">mobil2008@inbox.ru</a>
          </p>
        </div>
        
        <DialogFooter>
          <Button>Согласен</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
