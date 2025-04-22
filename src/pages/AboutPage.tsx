
const AboutPage = () => {
  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center">
        <div className="text-5xl mb-2">📔</div>
        <h2 className="text-2xl font-bold">Дневник Благополучия</h2>
        <p className="text-gray-500 mt-1">Версия 1.0.0</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-medium mb-4">О приложении</h3>
        
        <p className="mb-4">
          Дневник Благополучия - это приложение, которое помогает вам следить за вашими привычками питания и водным балансом, чтобы способствовать здоровому образу жизни.
        </p>
        
        <p className="mb-4">
          С помощью этого приложения вы можете:
        </p>
        
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Записывать свои приёмы пищи</li>
          <li>Отслеживать эмоции, связанные с едой</li>
          <li>Следить за водным балансом</li>
          <li>Анализировать свои привычки через графики</li>
          <li>Вести заметки о своём пути к здоровью</li>
        </ul>
        
        <p>
          Приложение направлено на поддержку осознанного питания и формирование здоровых привычек, а не на строгие диеты.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-medium mb-4">Контакты</h3>
        
        <div className="space-y-4">
          <a 
            href="https://t.me/wellbeing_diary_nexus"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary hover:underline"
          >
            <span className="mr-2">📱</span>
            Telegram-канал
          </a>
          
          <a 
            href="mailto:support@wellbeing-diary-nexus.com"
            className="flex items-center text-primary hover:underline"
          >
            <span className="mr-2">📧</span>
            support@wellbeing-diary-nexus.com
          </a>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <a 
          href="#"
          className="text-sm text-gray-500 hover:text-primary hover:underline"
        >
          🔏 Политика конфиденциальности
        </a>
        
        <a 
          href="#"
          className="text-sm text-gray-500 hover:text-primary hover:underline"
        >
          📄 Условия использования
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
