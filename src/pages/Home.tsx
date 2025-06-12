// src/pages/Home.tsx
import { useState, useCallback, type ReactElement } from 'react';
import { GraduationCap, UploadCloud, RotateCcw } from 'lucide-react'; // Added icons
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

  const handlePasteClick = useCallback(() => { // Renamed for clarity with button click
    if (pastedText.trim()) {
      pasteData(pastedText);
      setPastedText('');
    }
  }, [pastedText, pasteData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 sm:p-8 lg:p-10">
      <header className="max-w-6xl mx-auto mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start mb-3">
          <GraduationCap className="w-10 h-10 text-blue-700 mr-3" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            AUT Nursing Progress Tracker
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto sm:mx-0">
          Visualize and manage your academic journey towards graduation requirements.
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Left, wider) */}
        <div className="lg:col-span-2 space-y-8">
          <ProgressSummary
            currentTotalPoints={currentTotalPoints}
            graduationStatus={graduationStatus}
            totalGraduationPoints={TOTAL_GRADUATION_POINTS}
          />

          {/* Required Courses Section */}
          <section className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Required AUT Nursing Courses</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar */}
              {AUT_NURSING_COURSE_REQUIREMENTS.map((course) => {
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
                    isCustom={false} // Explicitly set for required courses
                  />
                );
              })}
            </div>
          </section>

          {/* Custom Courses List */}
          {customCourses.length > 0 && (
            <section className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">Your Custom Courses</h2>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar */}
                {customCourses.map((course) => (
                  <CourseItem
                    key={course.code}
                    course={course}
                    status={course.status}
                    attempts={course.attempts}
                    onUpdateStatus={updateCourseStatus} // Use updateCourseStatus as it handles both
                    isCustom={true} // Explicitly set for custom courses
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Side Panel Area (Right, narrower) */}
        <aside className="lg:col-span-1 space-y-8">
          {/* Add Custom Course Form */}
          <AddCustomCourseForm
            onAddCourse={addOrUpdateCustomCourse}
            onUpdateCourseStatus={updateCourseStatus} // This prop might not be needed if CourseItem is used internally
            onRemoveCourse={removeCustomCourse}
            customCourses={customCourses} // Keeping this here if the form itself shows added custom courses
          />

          {/* Bulk Update Section */}
          <section className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-purple-600" /> Bulk Update Courses
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Paste course data from your clipboard (e.g., spreadsheet column) in "CourseCode TAB Grade" format. Each line is one course.
              <br/>
              <span className="font-semibold">Example:</span> `NURS501 A` <br/> `HEAL603 B+`
            </p>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 resize-y min-h-[100px]"
              rows={5}
              placeholder="Paste course data here (e.g., &#10;NURS501&#09;A+&#10;HEAL603&#09;P)"
            />
            <button
              onClick={handlePasteClick}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              disabled={!pastedText.trim()}
            >
              <UploadCloud className="w-5 h-5" /> Apply Pasted Data
            </button>
            <button
              onClick={resetAllProgress}
              className="w-full mt-3 flex items-center justify-center gap-2 px-5 py-3 bg-red-50 text-red-700 font-semibold rounded-lg hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
            >
              <RotateCcw className="w-5 h-5" /> Reset All Progress
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Home;