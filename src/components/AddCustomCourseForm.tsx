// src/components/AddCustomCourseForm.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { CourseStatus } from '../types/courseTypes';

interface AddCustomCourseFormProps {
  onAddCourse: (course: {
    code: string;
    name: string;
    points: number;
  }) => void;
  onUpdateCourseStatus: (code: string, status: 'passed' | 'failed') => void;
  onRemoveCourse: (code: string) => void;
  customCourses: Array<{
    code: string;
    name: string;
    points: number;
    status: CourseStatus;
    attempts: number;
    isCustom: boolean;
  }>;
}

export const AddCustomCourseForm = ({
  onAddCourse,
  onUpdateCourseStatus,
  onRemoveCourse,
  customCourses
}: AddCustomCourseFormProps) => {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [coursePoints, setCoursePoints] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const points = Number(coursePoints);
    
    if (courseCode && courseName && !isNaN(points) && points > 0) {
      onAddCourse({
        code: courseCode.trim().toUpperCase(),
        name: courseName.trim(),
        points: points
      });
      
      // Reset form
      setCourseCode('');
      setCourseName('');
      setCoursePoints('');
      setShowForm(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Custom Courses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          {showForm ? 'Cancel' : 'Add Custom Course'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
                Course Code
              </label>
              <input
                type="text"
                id="courseCode"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CUST101"
                required
              />
            </div>
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                Course Name
              </label>
              <input
                type="text"
                id="courseName"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Custom Course"
                required
              />
            </div>
            <div>
              <label htmlFor="coursePoints" className="block text-sm font-medium text-gray-700 mb-1">
                Points
              </label>
              <input
                type="number"
                id="coursePoints"
                min="1"
                step="1"
                value={coursePoints}
                onChange={(e) => setCoursePoints(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 15"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Course
            </button>
          </div>
        </form>
      )}

      {customCourses.length > 0 && (
        <div className="space-y-3">
          {customCourses.map((course) => (
            <div key={course.code} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-semibold">{course.code}</span>
                  <span className="ml-2 text-gray-700">
                    {course.name} ({course.points} pts)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onUpdateCourseStatus(course.code, 'passed')}
                      className={`px-2 py-1 text-xs rounded ${
                        course.status === 'passed'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      Pass
                    </button>
                    <button
                      onClick={() => onUpdateCourseStatus(course.code, 'failed')}
                      className={`px-2 py-1 text-xs rounded ${
                        course.status === 'failed'
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      Fail
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveCourse(course.code)}
                    className="p-1 text-red-500 hover:text-red-700"
                    aria-label="Remove course"
                  >
                    ×
                  </button>
                </div>
              </div>
              {course.attempts > 0 && (
                <div className="mt-1 text-xs text-gray-500">
                  {course.attempts} {course.attempts === 1 ? 'attempt' : 'attempts'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddCustomCourseForm;
