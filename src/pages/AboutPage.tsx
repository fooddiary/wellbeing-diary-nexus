import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorLogViewer } from "@/components/ErrorLogViewer";
import { BackupManager } from "@/components/BackupManager";
import { BugReportDialog } from "@/components/BugReportDialog";

const AboutPage = () => {
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [backupManagerOpen, setBackupManagerOpen] = useState(false);
  const [bugReportOpen, setBugReportOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-1 sm:px-2">
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
                Дневник благополучия — мобильное приложение для отслеживания приёмов пищи, питья воды и физических показателей здоровья.<br/>
                Помогает выстроить здоровые привычки и мигрировать данные с помощью резервных копий.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Версия</h3>
              <p className="text-gray-600 dark:text-gray-300">1.0.0</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Системные инструменты</h3>
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
              <h3 className="text-lg font-medium">Связаться и поддержка</h3>
              <ul className="text-gray-600 dark:text-gray-300 mt-1 space-y-1 text-sm">
                <li>Email: <a href="mailto:support@wellbeingapp.com" className="underline text-primary">support@wellbeingapp.com</a></li>
                <li>Telegram: <a href="https://t.me/wellbeing_support" className="underline text-primary" target="_blank" rel="noopener noreferrer">@wellbeing_support</a></li>
                <li>Discord: <a href="https://discord.gg/yourinvite" className="underline text-primary" target="_blank" rel="noopener noreferrer">discord.gg/yourinvite</a></li>
              </ul>
              <Button className="mt-2" asChild variant="secondary">
                <a href="mailto:support@wellbeingapp.com">Отправить предложение</a>
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Сообщить об ошибке</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Если вы обнаружили ошибку, пожалуйста, отправьте нам баг-репорт.</p>
              <Button className="mt-2" variant="destructive" onClick={() => setBugReportOpen(true)}>
                Отправить отчёт об ошибке
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap">
          <div className="text-sm text-gray-500">© 2025 Дневник благополучия. Все права защищены.</div>
        </CardFooter>
      </Card>

      {/* Модальные окна */}
      <ErrorLogViewer isOpen={logViewerOpen} onClose={() => setLogViewerOpen(false)} />
      <BackupManager isOpen={backupManagerOpen} onClose={() => setBackupManagerOpen(false)} />
      <BugReportDialog isOpen={bugReportOpen} onClose={() => setBugReportOpen(false)} />
    </div>
  );
};

export default AboutPage;
