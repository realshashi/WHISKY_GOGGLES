import React from "react";
import { ActiveTab } from "@/types";

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-neutral-dark z-40">
      <div className="max-w-md mx-auto flex items-center justify-around">
        <button 
          className={`p-3 flex flex-col items-center justify-center w-1/4 transition-colors ${
            activeTab === 'scan' 
              ? 'text-primary-color' 
              : 'text-secondary-light hover:text-secondary-color'
          }`}
          onClick={() => onTabChange('scan')}
          aria-label="Scan tab"
        >
          <span className="material-icons text-2xl">photo_camera</span>
          <span className="text-xs mt-1 font-medium">Scan</span>
          {activeTab === 'scan' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-color"></div>
          )}
        </button>
        <button 
          className={`p-3 flex flex-col items-center justify-center w-1/4 transition-colors ${
            activeTab === 'search' 
              ? 'text-primary-color' 
              : 'text-secondary-light hover:text-secondary-color'
          }`}
          onClick={() => onTabChange('search')}
          aria-label="Search tab"
        >
          <span className="material-icons text-2xl">search</span>
          <span className="text-xs mt-1 font-medium">Search</span>
          {activeTab === 'search' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-color"></div>
          )}
        </button>
        <button 
          className={`p-3 flex flex-col items-center justify-center w-1/4 transition-colors ${
            activeTab === 'history' 
              ? 'text-primary-color' 
              : 'text-secondary-light hover:text-secondary-color'
          }`}
          onClick={() => onTabChange('history')}
          aria-label="History tab"
        >
          <span className="material-icons text-2xl">history</span>
          <span className="text-xs mt-1 font-medium">History</span>
          {activeTab === 'history' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-color"></div>
          )}
        </button>
        <button 
          className={`p-3 flex flex-col items-center justify-center w-1/4 transition-colors ${
            activeTab === 'settings' 
              ? 'text-primary-color' 
              : 'text-secondary-light hover:text-secondary-color'
          }`}
          onClick={() => onTabChange('settings')}
          aria-label="Settings tab"
        >
          <span className="material-icons text-2xl">settings</span>
          <span className="text-xs mt-1 font-medium">Settings</span>
          {activeTab === 'settings' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-color"></div>
          )}
        </button>
      </div>
    </nav>
  );
}
