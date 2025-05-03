import React from "react";

export default function Processing() {
  return (
    <section className="mb-8">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-color mb-4"></div>
            <h3 className="text-lg font-medium text-secondary-color mb-2">Processing Image</h3>
            <p className="text-sm text-secondary-light text-center">Analyzing label and matching to our database...</p>
          </div>
        </div>
      </div>
    </section>
  );
}
