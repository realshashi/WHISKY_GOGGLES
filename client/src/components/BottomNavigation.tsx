import React from "react";
import { ActiveTab } from "@/types";

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        <button 
          className={`p-3 flex flex-col items-center ${activeTab === 'scan' ? 'text-primary-color' : 'text-secondary-light'}`}
          onClick={() => onTabChange('scan')}
        >
          <span className="material-icons">photo_camera</span>
          <span className="text-xs mt-1">Scan</span>
        </button>
        <button 
          className={`p-3 flex flex-col items-center ${activeTab === 'search' ? 'text-primary-color' : 'text-secondary-light'}`}
          onClick={() => onTabChange('search')}
        >
          <span className="material-icons">search</span>
          <span className="text-xs mt-1">Search</span>
        </button>
        <button 
          className={`p-3 flex flex-col items-center ${activeTab === 'history' ? 'text-primary-color' : 'text-secondary-light'}`}
          onClick={() => onTabChange('history')}
        >
          <span className="material-icons">history</span>
          <span className="text-xs mt-1">History</span>
        </button>
        <button 
          className={`p-3 flex flex-col items-center ${activeTab === 'settings' ? 'text-primary-color' : 'text-secondary-light'}`}
          onClick={() => onTabChange('settings')}
        >
          <span className="material-icons">settings</span>
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </nav>
  );
}
