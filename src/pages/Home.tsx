import { useState, useCallback } from 'react';
import { GraduationCap } from 'lucide-react';
import { ProgressSummary } from '../components/ProgressSummary';
import { CourseItem } from '../components/CourseItem';
import { AddCustomCourseForm } from '../components/AddCustomCourseForm';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { AUT_NURSING_COURSE_REQUIREMENTS, TOTAL_GRADUATION_POINTS } from '../constants/autCourses';

const Home = () => {
  const {
    courseStatuses,
    customCourses,
    currentTotalPoints,
    graduationStatus,
    updateCourseStatus,
    addOrUpdateCustomCourse,
    removeCustomCourse,
    resetAllProgress,
    pasteData
  } = useCourseProgress();

  const [pastedText, setPastedText] = useState('');

  const handlePaste = useCallback(() => {
    if (pastedText.trim()) {
      pasteData(pastedText);
      setPastedText('');
    }
  }, [pastedText, pasteData]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <GraduationCap className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">AUT Nursing Progress Tracker</h1>
          </div>
          <p className="text-gray-600">
            Track your progress through the AUT Nursing program
          </p>
        </div>

        {/* Progress Summary */}
        <div className="mb-8">
          <ProgressSummary 
            currentTotalPoints={currentTotalPoints} 
            graduationStatus={graduationStatus}
            totalGraduationPoints={TOTAL_GRADUATION_POINTS}
          />
        </div>

        {/* Paste Data Section */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Bulk Update from Clipboard</h2>
          <p className="text-sm text-gray-600 mb-3">
            Paste course codes and grades (tab-separated) to update multiple courses at once.
            Example: HEAL504\tA\nHEAL505\tB
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Paste course codes and grades here..."
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handlePaste}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                disabled={!pastedText.trim()}
              >
                Update Courses
              </button>
              <button
                onClick={resetAllProgress}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 whitespace-nowrap"
              >
                Reset All Progress
              </button>
            </div>
          </div>
        </div>

        {/* Required Courses */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Required Courses</h2>
          <div className="space-y-3">
            {AUT_NURSING_COURSE_REQUIREMENTS.map((course) => {
              const statusInfo = courseStatuses.find(s => s.code === course.code) || {
                status: 'not-started' as const,
                attempts: 0
              };
              
              return (
                <CourseItem
                  key={course.code}
                  course={course}
                  status={statusInfo.status}
                  attempts={statusInfo.attempts}
                  onUpdateStatus={updateCourseStatus}
                />
              );
            })}
          </div>
        </div>

        {/* Custom Courses */}
        <AddCustomCourseForm
          onAddCourse={addOrUpdateCustomCourse}
          onUpdateCourseStatus={updateCourseStatus}
          onRemoveCourse={removeCustomCourse}
          customCourses={customCourses}
        />
      </div>
    </div>
  );
};

export default Home;