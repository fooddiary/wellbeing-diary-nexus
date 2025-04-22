
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorLogViewer } from "@/components/ErrorLogViewer";
import { BackupManager } from "@/components/BackupManager";

const AboutPage = () => {
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [backupManagerOpen, setBackupManagerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>О приложении</CardTitle>
          <CardDescription>
            Информация о приложении Дневник благополучия
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Описание</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Дневник благополучия - это приложение для отслеживания приемов пищи, питья воды и физических показателей. 
                Оно поможет вам вести здоровый образ жизни и следить за своим питанием.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Версия</h3>
              <p className="text-gray-600 dark:text-gray-300">1.0.0</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Инструменты системы</h3>
              <div className="flex flex-col gap-2 mt-2">
                <Button onClick={() => setBackupManagerOpen(true)} variant="outline">
                  Управление резервными копиями
                </Button>
                <Button onClick={() => setLogViewerOpen(true)} variant="outline">
                  Просмотр журнала ошибок
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Контакты для предложений</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Email: support@wellbeingapp.com
              </p>
              <Button className="mt-2" variant="secondary">
                Отправить предложение
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Сообщить об ошибке</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Если вы обнаружили ошибку в приложении, пожалуйста, сообщите нам об этом.
              </p>
              <Button className="mt-2" variant="destructive">
                Отправить отчёт об ошибке
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap">
          <div className="text-sm text-gray-500">
            © 2025 Дневник благополучия. Все права защищены.
          </div>
        </CardFooter>
      </Card>

      {/* Модальные окна */}
      <ErrorLogViewer isOpen={logViewerOpen} onClose={() => setLogViewerOpen(false)} />
      <BackupManager isOpen={backupManagerOpen} onClose={() => setBackupManagerOpen(false)} />
    </div>
  );
};

export default AboutPage;
