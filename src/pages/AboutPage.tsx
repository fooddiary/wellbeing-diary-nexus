import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorLogViewer } from "@/components/ErrorLogViewer";
import { BackupManager } from "@/components/BackupManager";
import { BugReportDialog } from "@/components/BugReportDialog";
import { AppInfoDialog } from "@/components/about/AppInfoDialog";
import { PrivacyPolicyDialog } from "@/components/about/PrivacyPolicyDialog";
import { TermsOfUseDialog } from "@/components/about/TermsOfUseDialog";
const AboutPage = () => {
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [backupManagerOpen, setBackupManagerOpen] = useState(false);
  const [bugReportOpen, setBugReportOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  return <div className="space-y-6 max-w-2xl mx-auto px-1 sm:px-2">
      <Card>
        <CardHeader>
          {/* Логотип */}
          <div className="flex flex-col items-center justify-center gap-2 mb-2">
            <img src="/lovable-uploads/7e6409d3-afbe-4ee4-9423-53b0cfc43bd9.png" alt="Дневник питания логотип" className="h-16 w-16" />
            <span className="text-xl font-bold mt-2">Дневник питания</span>
          </div>
          <CardDescription className="text-center">
            Версия 1.0.0
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Блок "Дневник питания" с описанием */}
          <div className="bg-muted rounded-lg px-4 py-4 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-center">Ведение дневника питания — это мощный инструмент для улучшения здоровья и осознанного отношения к еде</h2>
            <ul className="list-disc pl-6 mb-2 text-sm">
              <li>Контроль веса и похудение</li>
              <li>Анализ связи «еда — самочувствие»</li>
              <li>Формирование осознанности</li>
              <li>Медицинские показания (диабет, аллергии и др.)</li>
              <li>Спортивные цели</li>
              <li>Контроль детского рациона</li>
            </ul>
            <div className="text-sm my-2">
              Если вы хотите узнать больше о теле, здоровье и психологии,<br />
              переходите в Telegram-канал <a href="https://t.me/ktelu_nezhno" className="text-primary underline" target="_blank" rel="noopener noreferrer">@ktelu_nezhno</a>
            </div>
            <div className="text-xs text-gray-500 mt-2 mb-2">
              Контакт для предложений: <a href="mailto:mobil2008@inbox.ru" className="underline text-primary">mobil2008@inbox.ru</a>
            </div>
            {/* Открытие модалок, только ссылки */}
            <div className="flex gap-2">
              
              
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <AppInfoDialog />
            </div>

            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Связаться и поддержка</h3>
              <ul className="text-gray-600 dark:text-gray-300 mt-1 space-y-1 text-sm">
                <li>Email: <a href="mailto:mobil2008@inbox.ru" className="underline text-primary">mobil2008@inbox.ru</a></li>
                <li>Telegram: <a href="https://t.me/ktelu_nezhno" className="underline text-primary" target="_blank" rel="noopener noreferrer">@ktelu_nezhno</a></li>
              </ul>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-medium">Правовая информация</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setInfoOpen("privacy")}>
                  Политика конфиденциальности
                </Button>
                <Button variant="outline" onClick={() => setInfoOpen("terms")}>
                  Условия использования
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Системные инструменты</h3>
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
              <h3 className="text-lg font-medium mb-2">Сообщить об ошибке</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Если вы обнаружили ошибку, пожалуйста, отправьте нам баг-репорт.</p>
              <Button className="mt-2" variant="destructive" onClick={() => setBugReportOpen(true)}>
                Отправить отчёт об ошибке
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap">
          <div className="text-sm text-gray-500">© 2025 Дневник питания. Все права защищены.</div>
        </CardFooter>
      </Card>

      {/* Модальные окна */}
      <ErrorLogViewer isOpen={logViewerOpen} onClose={() => setLogViewerOpen(false)} />
      <BackupManager isOpen={backupManagerOpen} onClose={() => setBackupManagerOpen(false)} />
      <BugReportDialog isOpen={bugReportOpen} onClose={() => setBugReportOpen(false)} />

      {/* Правовые модалки */}
      {infoOpen === "privacy" && <PrivacyPolicyDialog open={true} onOpenChange={() => setInfoOpen(false)} />}
      {infoOpen === "terms" && <TermsOfUseDialog open={true} onOpenChange={() => setInfoOpen(false)} />}
    </div>;
};
export default AboutPage;