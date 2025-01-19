import React from 'react';

export default function ChartLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}