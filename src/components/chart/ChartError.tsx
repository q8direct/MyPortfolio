import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ChartErrorProps {
  message: string;
}

export default function ChartError({ message }: ChartErrorProps) {
  return (
    <div className="flex items-center justify-center h-full p-4 bg-red-50 text-red-600 rounded-lg">
      <AlertCircle className="h-5 w-5 mr-2" />
      <span>{message}</span>
    </div>
  );
}