import React from "react";

export default function Header() {
  return (
    <header className="bg-primary-color sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center">
          <span className="material-icons text-neutral-color mr-2">local_bar</span>
          <h1 className="text-xl font-bold text-neutral-color app-heading">Whisky Goggles</h1>
        </div>
        <div>
          <button className="p-2 rounded-full hover:bg-primary-dark transition-colors">
            <span className="material-icons text-neutral-color">help_outline</span>
          </button>
        </div>
      </div>
    </header>
  );
}
