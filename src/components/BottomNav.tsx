
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { AddMealForm } from "./forms/AddMealForm";
import { AddWaterForm } from "./forms/AddWaterForm";

export const BottomNav = () => {
  const location = useLocation();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [openMealForm, setOpenMealForm] = useState(false);
  const [openWaterForm, setOpenWaterForm] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleAddMenu = () => {
    setShowAddMenu(!showAddMenu);
  };

  const handleAddMeal = () => {
    setOpenMealForm(true);
    setShowAddMenu(false);
  };
  
  const handleAddWater = () => {
    setOpenWaterForm(true);
    setShowAddMenu(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] dark:bg-gray-800">
      {showAddMenu && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 w-48">
          <div className="flex flex-col space-y-2">
            <button
              className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleAddMeal}
            >
              <span className="mr-2">🍲</span>
              <span>Приём пищи</span>
            </button>
            <button
              className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleAddWater}
            >
              <span className="mr-2">💧</span>
              <span>Вода</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/") ? "text-primary" : "text-gray-500"}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-xs">Стартовая</span>
        </Link>

        <Link 
          to="/diary" 
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/diary") ? "text-primary" : "text-gray-500"}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M8 7h6" />
            <path d="M8 11h8" />
            <path d="M8 15h5" />
          </svg>
          <span className="text-xs">Дневник</span>
        </Link>

        <button 
          onClick={toggleAddMenu}
          className="add-button flex flex-col items-center justify-center w-16 h-16 rounded-full -mt-5"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          <span className="text-xs">Добавить</span>
        </button>

        <Link 
          to="/share" 
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/share") ? "text-primary" : "text-gray-500"}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
          <span className="text-xs">Поделиться</span>
        </Link>

        <Link 
          to="/settings" 
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/settings") ? "text-primary" : "text-gray-500"}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="text-xs">Настройки</span>
        </Link>
      </div>
      
      {/* Модальное окно для добавления приема пищи */}
      <AddMealForm 
        open={openMealForm} 
        onOpenChange={setOpenMealForm} 
      />
      
      {/* Модальное окно для добавления воды */}
      <AddWaterForm 
        open={openWaterForm} 
        onOpenChange={setOpenWaterForm} 
      />
    </div>
  );
};
