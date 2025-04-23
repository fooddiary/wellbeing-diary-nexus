
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

interface BugReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BugReportDialog = ({ isOpen, onClose }: BugReportDialogProps) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      toast.error("Заполните описание проблемы");
      return;
    }
    // Открываем почтовый клиент с заполненными полями
    window.open(
      `mailto:support@wellbeingapp.com?subject=Баг-репорт&body=Email:%20${encodeURIComponent(email)}%0AОписание:%0A${encodeURIComponent(message)}`,
      "_blank"
    );
    onClose();
    toast.success("Письмо для отчёта об ошибке подготовлено!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Сообщить об ошибке</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            placeholder="Ваш email (необязательно)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            className="min-h-[80px]"
            placeholder="Опишите проблему или сбой..."
            value={message}
            required
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit">Отправить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
