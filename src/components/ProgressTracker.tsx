import { useState, useEffect, useCallback, type ReactElement } from 'react';
import { CheckCircle, XCircle, Plus, AlertCircle, GraduationCap } from 'lucide-react';
import {
  AUT_NURSING_COURSE_REQUIREMENTS,
  TOTAL_GRADUATION_POINTS,
  type Course
} from '../constants/courses';

// Constants for grade parsing
const PASSING_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'P'];
const FAILING_GRADES = ['D', 'D+', 'E', 'F', 'D-', 'E+', 'E-', 'F+', 'F-', 'U'];

// Type for course status
type CourseStatus = 'passed' | 'failed' | 'not-started';

interface CourseStatusType {
  code: string;
  status: CourseStatus;
  attempts: number;
}

interface CustomCourse extends Omit<Course, 'level' | 'pathway'> {
  status: CourseStatus;
  attempts: number;
  isCustom: boolean;
}

const ProgressTracker = (): ReactElement => {
  // State for tracking status of pre-defined AUT courses
  const [courseStatuses, setCourseStatuses] = useState<CourseStatusType[]>(() =>
    AUT_NURSING_COURSE_REQUIREMENTS.map(course => ({
      code: course.code,
      status: 'not-started' as const,
      attempts: 0
    }))
  );

  // State for manually added custom courses
  const [customCourses, setCustomCourses] = useState<CustomCourse[]>(() => {
    const saved = localStorage.getItem('customCourses');
    return saved ? JSON.parse(saved) : [];
  });

  const [manualCourseCode, setManualCourseCode] = useState('');
  const [manualCourseName, setManualCourseName] = useState('');
  const [manualCoursePoints, setManualCoursePoints] = useState('');

  // State for overall progress display
  const [currentTotalPoints, setCurrentTotalPoints] = useState(0);
  const [graduationStatus, setGraduationStatus] = useState('');

  // Save to localStorage when customCourses changes
  useEffect(() => {
    localStorage.setItem('customCourses', JSON.stringify(customCourses));
  }, [customCourses]);

  /**
   * Updates the status of a specific course in the courseStatuses array.
   * Implements toggle functionality: clicking the same status button resets to 'not-started'.
   * @param {string} courseCode - The code of the course to update.
   * @param {'passed' | 'failed'} actionType - The status action triggered by the button.
   */
  const updateCourseStatus = useCallback((courseCode: string, actionType: 'passed' | 'failed') => {
    setCourseStatuses(prevStatuses =>
      prevStatuses.map(course => {
        if (course.code === courseCode) {
          const currentStatus = course.status;
          const currentAttempts = course.attempts;

          // If the action is the same as the current status, reset it to 'not-started'
          if (actionType === currentStatus) {
            return { ...course, status: 'not-started', attempts: 0 }; // Reset
          } else {
            // If changing status or setting for the first time, increment attempts
            const newAttempts = (currentStatus === 'not-started' || currentStatus !== actionType)
              ? currentAttempts + 1
              : currentAttempts; // Don't increment if already in the new status

            return { ...course, status: actionType, attempts: newAttempts };
          }
        }
        return course;
      })
    );
  }, []);

  /**
   * Adds a manually entered course to the customCourses state.
   * Clears the input fields after adding.
   */
  const handleAddCustomCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const points = Number(manualCoursePoints);

    if (manualCourseCode && manualCourseName && points > 0) {
      const existingCustomCourseIndex = customCourses.findIndex(
        (course) => course.code === manualCourseCode
      );

      if (existingCustomCourseIndex !== -1) {
        // Update existing custom course
        setCustomCourses((prevCourses) =>
          prevCourses.map((course, index) =>
            index === existingCustomCourseIndex
              ? {
                ...course,
                name: manualCourseName,
                points: points,
                // Do not change status or attempts here, as this is for adding/updating course info, not progress
              }
              : course
          )
        );
      } else {
        // Add new custom course
        setCustomCourses((prevCourses) => [
          ...prevCourses,
          {
            code: manualCourseCode,
            name: manualCourseName,
            points: points,
            status: 'not-started', // Default status for new custom courses
            attempts: 0,
            isCustom: true,
          },
        ]);
      }

      // Clear the form
      setManualCourseCode('');
      setManualCourseName('');
      setManualCoursePoints('');
    } else {
      alert('Please enter a valid course code, course name, and points (points must be greater than 0).');
    }
  };


  /**
   * Removes a manually added course from the customCourses state.
   * @param {number} index - The index of the custom course to remove.
   */
  const handleRemoveCustomCourse = (index: number): void => {
    setCustomCourses(prevCourses => prevCourses.filter((_, i) => i !== index));
  };

  // Helper function to get course status icon
  const getCourseStatusIcon = useCallback((status: CourseStatus, attempts: number): JSX.Element | null => {
    if (status === 'passed') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'failed') {
      return attempts >= 3
        ? <XCircle className="w-5 h-5 text-red-500" />
        : <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    return null;
  }, []);

  // Helper function to get course row color
  const getCourseRowColor = useCallback((status: CourseStatus, attempts: number): string => {
    if (status === 'passed') return 'bg-green-50 border-green-200';
    if (status === 'failed') {
      return attempts >= 3
        ? 'bg-red-50 border-red-200'
        : 'bg-yellow-50 border-yellow-200';
    }
    return 'bg-gray-50 border-gray-200';
  }, []);

  /**
   * Calculates the total points obtained from both standard and custom courses,
   * and updates the graduation status.
   */
  useEffect(() => {
    let totalPoints = 0;

    // Calculate points from required courses
    AUT_NURSING_COURSE_REQUIREMENTS.forEach(course => {
      const status = courseStatuses.find(s => s.code === course.code);
      if (status?.status === 'passed') {
        totalPoints += course.points;
      }
    });

    // Add points from custom courses
    customCourses.forEach(course => {
      if (course.status === 'passed') {
        totalPoints += course.points;
      }
    });

    setCurrentTotalPoints(totalPoints);

    if (totalPoints >= TOTAL_GRADUATION_POINTS) {
      setGraduationStatus('🎉 You are eligible to graduate!');
    } else {
      setGraduationStatus(`You need ${TOTAL_GRADUATION_POINTS - totalPoints} more points to graduate.`);
    }
  }, [courseStatuses, customCourses]);

  /**
   * Resets all course statuses to 'not-started' and clears custom courses.
   */
  const resetSheet = (): void => {
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      setCourseStatuses(
        AUT_NURSING_COURSE_REQUIREMENTS.map((course) => ({
          code: course.code,
          status: 'not-started' as const,
          attempts: 0
        }))
      );
      setCustomCourses([]);
      setCurrentTotalPoints(0);
      setGraduationStatus('');
    }
  };


  /**
   * Pastes data from clipboard to update course statuses or add custom courses.
   * Expected format: Code | Course Name | Grade | Points
   */
  const pasteData = (event: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    try {
      const pastedText = event.clipboardData.getData('text');
      const rows = pastedText.split('\n').filter((row: string) => row.trim() !== '');

      const updatedCourseStatuses = [...courseStatuses];
      const updatedCustomCourses = [...customCourses];

      rows.forEach((row: string) => {
        const [code, courseName, grade, pointsStr] = row.split('\t').map((s: string) => s.trim());
        if (!code || !grade) return;

        const points = Number(pointsStr) || 0;
        const status = PASSING_GRADES.includes(grade)
          ? 'passed' as const
          : FAILING_GRADES.includes(grade)
            ? 'failed' as const
            : 'not-started' as const;

        // Check if it's a predefined course
        const courseIndex = updatedCourseStatuses.findIndex(cs => cs.code === code);
        if (courseIndex !== -1) {
          updatedCourseStatuses[courseIndex] = {
            ...updatedCourseStatuses[courseIndex],
            status,
            attempts: updatedCourseStatuses[courseIndex].attempts + 1
          };
        } else {
          // Handle custom course
          const customCourseIndex = updatedCustomCourses.findIndex(c => c.code === code);
          if (customCourseIndex !== -1) {
            // Update existing custom course
            updatedCustomCourses[customCourseIndex] = {
              ...updatedCustomCourses[customCourseIndex],
              status,
              attempts: updatedCustomCourses[customCourseIndex].attempts + 1,
              ...(courseName && { name: courseName }),
              ...(points > 0 && { points })
            };
          } else if (courseName && points > 0) {
            // Add new custom course
            updatedCustomCourses.push({
              code,
              name: courseName,
              points,
              status,
              attempts: 1,
              isCustom: true
            });
          }
        }
      });

      setCourseStatuses(updatedCourseStatuses);
      setCustomCourses(updatedCustomCourses);
    } catch (err) {
      console.error("Error pasting data:", err);
      alert('Could not paste data. Please check clipboard permissions and ensure your data is in the correct format (tab-separated): Code | Course Name | Grade | Points');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AUT Nursing Graduation Progress Tracker</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={resetSheet}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200"
            >
              Reset All Progress
            </button>
            <textarea
              placeholder="Paste course data here (tab-separated: Code | Name | Grade | Points)"
              onPaste={pasteData}
              rows={1}
              className="w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Progress Summary Section */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress Summary</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Total Points Achieved:</span>
              <span className="text-blue-600 text-xl font-bold">{currentTotalPoints} / {TOTAL_GRADUATION_POINTS}</span>
            </div>
            <p className={`text-lg font-semibold ${currentTotalPoints >= TOTAL_GRADUATION_POINTS ? 'text-green-600' : 'text-orange-500'}`}>
              {graduationStatus}
            </p>
          </div>

          {/* Add Custom Course Section */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Custom Course</h2>
            <form onSubmit={handleAddCustomCourse}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-4">
                <div>
                  <label htmlFor="manualCourseCode" className="block text-sm font-medium text-gray-700">Course Code</label>
                  <input type="text" id="manualCourseCode" value={manualCourseCode} onChange={(e) => setManualCourseCode(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., ALTCUSTOM101" />
                </div>
                <div>
                  <label htmlFor="manualCourseName" className="block text-sm font-medium text-gray-700">Course Name</label>
                  <input type="text" id="manualCourseName" value={manualCourseName} onChange={(e) => setManualCourseName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Alternative Nursing Studies" />
                </div>
                <div>
                  <label htmlFor="manualCoursePoints" className="block text-sm font-medium text-gray-700">Points</label>
                  <input type="number" id="manualCoursePoints" value={manualCoursePoints} onChange={(e) => setManualCoursePoints(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., 15" min="0" />
                </div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 sm:col-span-2 lg:col-span-1 self-end">
                  <Plus className="w-4 h-4" />
                  Add Course
                </button>
              </div>
            </form>
            {customCourses.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Added Custom Courses:</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scroll">
                  {customCourses.map((course, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg border border-gray-200">
                      <span className="text-sm font-medium">{course.code} - {course.name} ({course.points} pts)</span>
                      <button onClick={() => handleRemoveCustomCourse(index)} className="text-red-500 hover:text-red-700 text-xs font-medium ml-4">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Course Requirements Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 flex-grow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AUT Nursing Curriculum Courses</h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto custom-scroll">
            {AUT_NURSING_COURSE_REQUIREMENTS.map((course) => {
              const statusEntry = courseStatuses.find(s => s.code === course.code) || { status: 'not-started', attempts: 0 };
              const { status, attempts } = statusEntry;

              return (
                <div
                  key={course.code}
                  className={`p-3 rounded-lg border ${getCourseRowColor(status, attempts)}`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <div className="flex-grow">
                      <h3 className="font-semibold text-sm sm:text-base">{course.code} - {course.name}</h3>
                      <p className="text-xs text-gray-600">
                        {course.pathway} • Level {course.level} • {course.points} points
                        {status === 'passed' && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Completed
                          </span>
                        )}
                      </p>
                      {status === 'failed' && attempts > 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          {attempts} {attempts > 1 ? 'attempts' : 'attempt'}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 mt-2 sm:mt-0">
                      {getCourseStatusIcon(status, attempts)}
                      <button
                        onClick={() => updateCourseStatus(course.code, 'passed')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                          ${status === 'passed'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}
                        `}
                        aria-label="Mark as Passed"
                      >
                        Pass
                      </button>
                      <button
                        onClick={() => updateCourseStatus(course.code, 'failed')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                          ${status === 'failed'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'}
                        `}
                        aria-label="Mark as Failed"
                      >
                        Fail
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;