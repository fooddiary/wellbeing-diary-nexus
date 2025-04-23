
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Условия использования</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none mb-6 text-sm text-gray-700 dark:text-gray-200">
            <p>
              Используя приложение "Дневник благополучия", вы соглашаетесь с условиями:
            </p>
            <ol className="list-decimal ml-5 mb-4">
              <li>Ваши данные хранятся только на вашем устройстве.</li>
              <li>Разработчики не несут ответственности за потерю данных, если вы не сделали резервную копию.</li>
              <li>Приложение не передает ваши личные данные третьим лицам.</li>
              <li>Ознакомьтесь с разделом "О приложении" для связи и поддержки.</li>
              <li>Используйте только при согласии с этими условиями.</li>
            </ol>
          </div>
          <Button variant="default" onClick={() => navigate(-1)}>Назад</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;
