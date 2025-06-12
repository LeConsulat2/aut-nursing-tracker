// src/components/ProgressSummary.tsx
import React from 'react';

interface ProgressSummaryProps {
  currentTotalPoints: number;
  graduationStatus: string;
  totalGraduationPoints: number;
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({ 
  currentTotalPoints, 
  graduationStatus,
  totalGraduationPoints 
}) => (
  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress Summary</h2>
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-700 font-medium">Total Points Achieved:</span>
      <span className="text-blue-600 text-xl font-bold">
        {currentTotalPoints} / {totalGraduationPoints}
      </span>
    </div>
    <p className={`text-lg font-semibold ${
      currentTotalPoints >= totalGraduationPoints ? 'text-green-600' : 'text-orange-500'
    }`}>
      {graduationStatus}
    </p>
  </div>
);