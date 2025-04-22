
import { useState } from "react";

const SharePage = () => {
  const [exportType, setExportType] = useState("day");
  const [format, setFormat] = useState("clipboard");
  const [isSharing, setIsSharing] = useState(false);

  const handleExport = () => {
    setIsSharing(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsSharing(false);
      alert("Данные экспортированы!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Поделиться данными</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Что экспортировать?</h3>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="entry"
                checked={exportType === "entry"}
                onChange={() => setExportType("entry")}
                className="mr-2"
              />
              <span>Одну запись</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="day"
                checked={exportType === "day"}
                onChange={() => setExportType("day")}
                className="mr-2"
              />
              <span>Данные за день</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="period"
                checked={exportType === "period"}
                onChange={() => setExportType("period")}
                className="mr-2"
              />
              <span>Данные за период</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="all"
                checked={exportType === "all"}
                onChange={() => setExportType("all")}
                className="mr-2"
              />
              <span>Все данные</span>
            </label>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Формат</h3>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="clipboard"
                checked={format === "clipboard"}
                onChange={() => setFormat("clipboard")}
                className="mr-2"
              />
              <span>Скопировать в буфер обмена</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="share"
                checked={format === "share"}
                onChange={() => setFormat("share")}
                className="mr-2"
              />
              <span>Поделиться (email, мессенджеры)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                value="excel"
                checked={format === "excel"}
                onChange={() => setFormat("excel")}
                className="mr-2"
              />
              <span>Excel (.xlsx)</span>
            </label>
          </div>
        </div>
        
        {exportType === "period" && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Выберите период</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Начало</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Конец</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={handleExport}
          disabled={isSharing}
          className="w-full bg-primary text-white py-3 rounded font-medium flex items-center justify-center"
        >
          {isSharing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Экспортируем...
            </>
          ) : "Экспортировать"}
        </button>
      </div>
    </div>
  );
};

export default SharePage;
