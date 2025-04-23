
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const AgreementModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Проверяем согласие в localStorage
    const accepted = localStorage.getItem("agreementAccepted");
    if (!accepted) setOpen(true);
  }, []);

  const handleAgree = () => {
    localStorage.setItem("agreementAccepted", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Пользовательское соглашение</DialogTitle>
        </DialogHeader>
        <div className="mb-4 text-gray-700 dark:text-gray-200 text-sm">
          Перед использованием приложения вы должны принять условия пользовательского соглашения.<br/>
          Ознакомьтесь с <a href="/terms" className="underline text-primary" target="_blank">Условиями использования</a>.<br/>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleAgree} variant="default">Согласен</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
