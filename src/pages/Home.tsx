// src/pages/Home.tsx
import { useState, useCallback, type ReactElement } from 'react';
import { GraduationCap, UploadCloud, RotateCcw, CheckCircle, Clock, XCircle, Trophy, Target, Plus, Minus, ChevronRight, ChevronDown } from 'lucide-react';
import { ProgressSummary } from '../components/ProgressSummary';
import { CourseItem } from '../components/CourseItem';
import { AddCustomCourseForm } from '../components/AddCustomCourseForm';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { AUT_NURSING_COURSE_REQUIREMENTS, TOTAL_GRADUATION_POINTS } from '../constants/autCourses';

const Home = (): ReactElement => {
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
  const [showPassedCourses, setShowPassedCourses] = useState(true);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);

  const handlePasteClick = useCallback(() => {
    if (pastedText.trim()) {
      pasteData(pastedText);
      setPastedText('');
    }
  }, [pastedText, pasteData]);

  // Get passed courses
  const passedCourses = [
    ...AUT_NURSING_COURSE_REQUIREMENTS.filter(course => {
      const status = courseStatuses.find(s => s.code === course.code);
      return status && ['passed', 'completed'].includes(status.status);
    }).map(course => ({
      ...course,
      status: courseStatuses.find(s => s.code === course.code)?.status || 'not-started',
      attempts: courseStatuses.find(s => s.code === course.code)?.attempts || 0,
      isCustom: false
    })),
    ...customCourses.filter(course => ['passed', 'completed'].includes(course.status))
  ];

  // Get remaining courses (not passed)
  const remainingCourses = [
    ...AUT_NURSING_COURSE_REQUIREMENTS.filter(course => {
      const status = courseStatuses.find(s => s.code === course.code);
      return !status || !['passed', 'completed'].includes(status.status);
    }),
    ...customCourses.filter(course => !['passed', 'completed'].includes(course.status))
  ];

  const progressPercentage = Math.min((currentTotalPoints / TOTAL_GRADUATION_POINTS) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Top Progress Bar - Full Width */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center mb-2 sm:mb-0">
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-blue-700 mr-3" />
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                  AUT Nursing Tracker
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Track your academic progress
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{currentTotalPoints}</div>
                <div className="text-xs sm:text-sm text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">{passedCourses.length}</div>
                <div className="text-xs sm:text-sm text-gray-500">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">{remainingCourses.length}</div>
                <div className="text-xs sm:text-sm text-gray-500">Remaining</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Graduation</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 points</span>
              <span>{TOTAL_GRADUATION_POINTS} points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Grid */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full">
          
          {/* Left Side - Courses to Complete (Mobile: full width, Desktop: 8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Action Buttons - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowAddCourse(!showAddCourse)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Custom Course</span>
                <span className="sm:hidden">Add Course</span>
              </button>
              
              <button
                onClick={() => setShowBulkUpdate(!showBulkUpdate)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <UploadCloud className="w-5 h-5" />
                <span className="hidden sm:inline">Bulk Update</span>
                <span className="sm:hidden">Bulk</span>
              </button>
              
              <button
                onClick={resetAllProgress}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="hidden sm:inline">Reset All</span>
                <span className="sm:hidden">Reset</span>
              </button>
            </div>

            {/* Add Custom Course Form - Collapsible */}
            {showAddCourse && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-in slide-in-from-top-2 duration-300">
                <AddCustomCourseForm
                  onAddCourse={addOrUpdateCustomCourse}
                  onUpdateCourseStatus={updateCourseStatus}
                  onRemoveCourse={removeCustomCourse}
                  customCourses={customCourses}
                />
              </div>
            )}

            {/* Bulk Update Form - Collapsible */}
            {showBulkUpdate && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-in slide-in-from-top-2 duration-300">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <UploadCloud className="w-6 h-6 text-purple-600" />
                  Bulk Update Courses
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Paste course data in "CourseCode TAB Grade" format. Each line is one course.
                  <br />
                  <span className="font-semibold">Example:</span> NURS501 A+
                </p>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all duration-200 resize-y min-h-[100px]"
                  rows={4}
                  placeholder="Paste course data here..."
                />
                <button
                  onClick={handlePasteClick}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  disabled={!pastedText.trim()}
                >
                  <UploadCloud className="w-5 h-5" />
                  Apply Pasted Data
                </button>
              </div>
            )}

            {/* Remaining Courses */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Target className="w-6 h-6 text-orange-600" />
                  Courses to Complete
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({remainingCourses.length} remaining)
                  </span>
                </h2>
              </div>
              
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Required Courses */}
                {AUT_NURSING_COURSE_REQUIREMENTS.filter(course => {
                  const status = courseStatuses.find(s => s.code === course.code);
                  return !status || !['passed', 'completed'].includes(status.status);
                }).map((course) => {
                  const statusInfo = courseStatuses.find(s => s.code === course.code) || {
                    status: 'not-started',
                    attempts: 0
                  };

                  return (
                    <CourseItem
                      key={course.code}
                      course={course}
                      status={statusInfo.status}
                      attempts={statusInfo.attempts}
                      onUpdateStatus={updateCourseStatus}
                      isCustom={false}
                    />
                  );
                })}

                {/* Custom Courses */}
                {customCourses.filter(course => !['passed', 'completed'].includes(course.status)).map((course) => (
                  <CourseItem
                    key={course.code}
                    course={course}
                    status={course.status}
                    attempts={course.attempts}
                    onUpdateStatus={updateCourseStatus}
                    isCustom={true}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Passed Courses (Mobile: full width, Desktop: 4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Passed Courses */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-green-600" />
                  Completed Courses
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({passedCourses.length})
                  </span>
                </h2>
                <button
                  onClick={() => setShowPassedCourses(!showPassedCourses)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  {showPassedCourses ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>

              {showPassedCourses && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {passedCourses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No completed courses yet</p>
                      <p className="text-sm">Keep going, you've got this! 💪</p>
                    </div>
                  ) : (
                    passedCourses.map((course) => (
                      <div
                        key={course.code}
                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl transform transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              {course.code}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{course.name}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                {course.points} points
                              </span>
                              {course.attempts > 1 && (
                                <span className="text-xs text-gray-500">
                                  {course.attempts} attempts
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        @keyframes slide-in-from-top-2 {
          from {
            transform: translateY(-8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-in {
          animation: slide-in-from-top-2 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;