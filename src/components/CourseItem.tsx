// src/components/CourseItem.tsx
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { CourseStatus } from '../types/courseTypes';

interface CourseItemProps {
  course: {
    code: string;
    name: string;
    points: number;
  };
  status: CourseStatus;
  attempts: number;
  isCustom?: boolean;
  onUpdateStatus: (code: string, status: 'passed' | 'failed') => void;
  onRemove?: (code: string) => void;
}

export const CourseItem = ({
  course,
  status,
  attempts,
  isCustom = false,
  onUpdateStatus,
  onRemove
}: CourseItemProps) => {
  const getCourseStatusIcon = (status: CourseStatus, attempts: number) => {
    if (status === 'passed') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'failed') {
      return attempts >= 3
        ? <XCircle className="w-5 h-5 text-red-500" />
        : <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    return null;
  };

  const getCourseRowColor = (status: CourseStatus, attempts: number) => {
    if (status === 'passed') return 'bg-green-50 border-green-200';
    if (status === 'failed') {
      return attempts >= 3
        ? 'bg-red-50 border-red-200'
        : 'bg-yellow-50 border-yellow-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div 
      className={`flex items-center p-4 border rounded-lg mb-2 ${getCourseRowColor(status, attempts)}`}
    >
      <div className="flex-1">
        <div className="flex items-center">
          <span className="font-mono font-semibold text-gray-800 w-24">{course.code}</span>
          <span className="text-gray-700">
            {course.name} ({course.points} pts)
            {isCustom && <span className="ml-2 text-xs text-gray-500">(Custom)</span>}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {getCourseStatusIcon(status, attempts)}
        {attempts > 0 && (
          <span className="text-xs text-gray-500">
            {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
          </span>
        )}
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onUpdateStatus(course.code, 'passed')}
            className={`px-3 py-1 text-sm rounded ${
              status === 'passed' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
            aria-label="Mark as passed"
          >
            Pass
          </button>
          <button
            onClick={() => onUpdateStatus(course.code, 'failed')}
            className={`px-3 py-1 text-sm rounded ${
              status === 'failed'
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
            aria-label="Mark as failed"
          >
            Fail
          </button>
          {isCustom && onRemove && (
            <button
              onClick={() => onRemove(course.code)}
              className="ml-2 text-red-500 hover:text-red-700"
              aria-label="Remove course"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
