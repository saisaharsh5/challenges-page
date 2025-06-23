import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-gray-700"></div>
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-terminal-green border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};