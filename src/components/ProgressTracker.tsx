import { useState, useEffect, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, XCircle, GraduationCap, Plus } from 'lucide-react'; // Added Plus icon for manual add

// Constants for course requirements and grading
const AUT_NURSING_COURSE_REQUIREMENTS = [
  { code: 'HEAL504', name: 'Lifespan Development and Communication', level: 5, points: 15, pathway: 'Part I' },
  { code: 'HEAL505', name: 'Health and Environment', level: 5, points: 15, pathway: 'Part I' },
  { code: 'HEAL506', name: 'Human Anatomy and Physiology I', level: 5, points: 15, pathway: 'Part I' },
  { code: 'HEAL507', name: 'Knowledge, Enquiry and Communication', level: 5, points: 15, pathway: 'Part I' },
  { code: 'MAOH501', name: 'Māori Health', level: 5, points: 15, pathway: 'Part I' },
  { code: 'NURS503', name: 'Introduction to Nursing Practice', level: 5, points: 45, pathway: 'Part II' },
  { code: 'HEAL609', name: 'Human Anatomy and Physiology II', level: 6, points: 15, pathway: 'Part III' },
  { code: 'HEAL610', name: 'Pathophysiology', level: 6, points: 15, pathway: 'Part III' },
  { code: 'NURS601', name: 'Nursing Practice 1', level: 6, points: 30, pathway: 'Part III' },
  { code: 'MAOH600', name: 'Māori Health Perspectives', level: 6, points: 15, pathway: 'Part III' },
  { code: 'NURS600', name: 'Nursing Theory and Practice', level: 6, points: 15, pathway: 'Part III' },
  { code: 'NURS602', name: 'Nursing Practice 2', level: 6, points: 15, pathway: 'Part IV' },
  { code: 'NURS603', name: 'Nursing Practice 3', level: 6, points: 30, pathway: 'Part IV' },
  { code: 'PHMY701', name: 'Pharmacology', level: 7, points: 15, pathway: 'Part V' },
  { code: 'NURS701', name: 'Advanced Nursing Practice', level: 7, points: 30, pathway: 'Part V' },
  { code: 'NURS705', name: 'Nursing Leadership', level: 7, points: 30, pathway: 'Part V' },
  { code: 'NURS703', name: 'Nursing Research', level: 7, points: 45, pathway: 'Part VI' },
  { code: 'PSYC605', name: 'Psychology in Healthcare', level: 7, points: 15, pathway: 'Part VI' },
  { code: 'HEAL706', name: 'Health Assessment', level: 7, points: 15, pathway: 'Part VI' },
  { code: 'HEAL708', name: 'Evidence-Based Practice', level: 7, points: 15, pathway: 'Part VI' },
  { code: 'HLAW701', name: 'Health Law and Ethics', level: 7, points: 15, pathway: 'Part VI' },
  { code: 'HPRM706', name: 'Health Promotion', level: 7, points: 15, pathway: 'Part VI' },
  { code: 'MAOH701', name: 'Māori Health Practice', level: 7, points: 15, pathway: 'Part VI' }
];

// Graduation total points set to 360 as requested
const TOTAL_GRADUATION_POINTS = 360;

// Grade categories for paste functionality
const PASSING_GRADES_PASTE = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
const FAILING_GRADES_PASTE = ['D', 'F', 'W'];

const StudentProgressTracker = () => {
  // State for tracking status of pre-defined AUT courses
  const [courseStatuses, setCourseStatuses] = useState(() =>
    AUT_NURSING_COURSE_REQUIREMENTS.map(course => ({
      code: course.code,
      status: 'not-started', // 'passed', 'failed', 'not-started'
      attempts: 0 // Number of times status has been set to passed or failed
    }))
  );

  // State for manually added custom courses
  const [customCourses, setCustomCourses] = useState([]);
  const [manualCourseCode, setManualCourseCode] = useState('');
  const [manualCourseName, setManualCourseName] = useState('');
  const [manualCoursePoints, setManualCoursePoints] = useState('');

  // State for overall progress display
  const [currentTotalPoints, setCurrentTotalPoints] = useState(0);
  const [graduationStatus, setGraduationStatus] = useState('');

  /**
   * Updates the status of a specific course in the courseStatuses array.
   * Implements toggle functionality: clicking the same status button resets to 'not-started'.
   * @param {string} courseCode - The code of the course to update.
   * @param {'passed' | 'failed'} actionType - The status action triggered by the button.
   */
  const updateCourseStatus = useCallback((courseCode, actionType) => {
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
  const handleAddCustomCourse = () => {
    if (manualCourseCode && manualCourseName && manualCoursePoints > 0) {
      // Check if course already exists in customCourses to prevent duplicates by code
      const existingCourseIndex = customCourses.findIndex(c => c.code === manualCourseCode);
      if (existingCourseIndex === -1) {
        setCustomCourses(prevCourses => [
          ...prevCourses,
          {
            code: manualCourseCode.trim(),
            name: manualCourseName.trim(),
            points: parseInt(manualCoursePoints),
            isCustom: true // Mark as custom for clearer distinction
          }
        ]);
      } else {
        // Optionally, update existing custom course
        setCustomCourses(prevCourses =>
          prevCourses.map((course, index) =>
            index === existingCourseIndex
              ? { ...course, name: manualCourseName.trim(), points: parseInt(manualCoursePoints) }
              : course
          )
        );
      }
      // Clear input fields
      setManualCourseCode('');
      setManualCourseName('');
      setManualCoursePoints('');
    } else {
      alert('코스 코드, 코스 이름, 학점을 모두 올바르게 입력해주세요 (학점은 0보다 커야 합니다).');
    }
  };

  /**
   * Removes a manually added course from the customCourses state.
   * @param {number} index - The index of the custom course to remove.
   */
  const handleRemoveCustomCourse = (index) => {
    setCustomCourses(prevCourses => prevCourses.filter((_, i) => i !== index));
  };


  /**
   * Determines the background and border color for a course row.
   * @param {'passed' | 'failed' | 'not-started'} status - The current status of the course.
   * @param {number} attempts - The number of attempts.
   * @returns {string} Tailwind CSS classes for coloring.
   */
  const getCourseRowColor = useCallback((status, attempts) => {
    if (status === 'passed') return 'bg-green-100 border-green-300';
    if (status === 'failed') {
      return attempts >= 3 ? 'bg-red-100 border-red-300' : 'bg-yellow-100 border-yellow-300';
    }
    return 'bg-gray-50 border-gray-200';
  }, []);

  /**
   * Returns an appropriate icon based on the course status.
   * @param {'passed' | 'failed' | 'not-started'} status - The current status of the course.
   * @param {number} attempts - The number of attempts.
   * @returns {JSX.Element | null} An icon component or null.
   */
  const getCourseStatusIcon = useCallback((status, attempts) => {
    if (status === 'passed') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'failed') {
      return attempts >= 3 ? <XCircle className="w-5 h-5 text-red-500" /> : <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    return null;
  }, []);

  /**
   * Calculates the total points obtained from both standard and custom courses,
   * and updates the graduation status.
   */
  useEffect(() => {
    let pointsEarned = 0;
    const completedCourseCodes = new Set(); // To ensure points are counted once per unique passed course code

    // Calculate points from standard AUT courses
    courseStatuses.forEach(statusEntry => {
      if (statusEntry.status === 'passed') {
        const courseReq = AUT_NURSING_COURSE_REQUIREMENTS.find(req => req.code === statusEntry.code);
        if (courseReq && !completedCourseCodes.has(courseReq.code)) {
          pointsEarned += courseReq.points;
          completedCourseCodes.add(courseReq.code);
        }
      }
    });

    // Calculate points from manually added custom courses
    customCourses.forEach(customCourse => {
      // Custom courses are assumed to be "passed" if they are added
      if (!completedCourseCodes.has(customCourse.code)) { // Ensure no duplicate points if code overlaps with AUT courses
        pointsEarned += customCourse.points;
        completedCourseCodes.add(customCourse.code); // Mark as counted
      }
    });

    setCurrentTotalPoints(pointsEarned);

    // Determine missing core AUT courses for graduation status
    const missingRequiredCourses = AUT_NURSING_COURSE_REQUIREMENTS.filter(req =>
      !(courseStatuses.find(s => s.code === req.code && s.status === 'passed'))
    );

    if (pointsEarned >= TOTAL_GRADUATION_POINTS && missingRequiredCourses.length === 0) {
      setGraduationStatus('✅ 모든 졸업 요건을 충족했습니다!');
    } else {
      const pointsDeficit = TOTAL_GRADUATION_POINTS - pointsEarned;
      setGraduationStatus(
        `현재 졸업을 위해 ${pointsDeficit > 0 ? `${pointsDeficit}점` : '추가 점수 없음'}과 ${missingRequiredCourses.length}개 핵심 코스가 필요합니다.`
      );
    }
  }, [courseStatuses, customCourses]); // Recalculate when either state changes

  /**
   * Resets all course statuses to 'not-started' and clears custom courses.
   */
  const resetSheet = () => {
    setCourseStatuses(
      AUT_NURSING_COURSE_REQUIREMENTS.map(course => ({
        code: course.code,
        status: 'not-started',
        attempts: 0
      }))
    );
    setCustomCourses([]); // Clear custom courses on reset
    setCurrentTotalPoints(0);
    setGraduationStatus('');
  };

  /**
   * Pastes data from clipboard to update course statuses or add custom courses.
   * Expected format: Code | Course Name | Grade | Points (tab-separated)
   */
  const pasteData = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const rows = text.split('\n').map(row => row.split('\t'));

      const newCourseStatuses = [...courseStatuses];
      const newCustomCourses = [...customCourses];

      rows.forEach(row => {
        const courseCode = row[0] ? row[0].trim() : '';
        const courseName = row[1] ? row[1].trim() : '';
        const grade = row[2] ? row[2].trim() : '';
        const points = parseInt(row[3]) || 0; // Points from pasted data

        const autCourseIndex = newCourseStatuses.findIndex(c => c.code === courseCode);

        if (autCourseIndex !== -1) {
          // If it's a pre-defined AUT course, update its status
          let status = 'not-started';
          if (PASSING_GRADES_PASTE.includes(grade)) {
            status = 'passed';
          } else if (FAILING_GRADES_PASTE.includes(grade)) {
            status = 'failed';
          }
          // Increment attempts only if status changes to pass/fail
          const currentAttempts = newCourseStatuses[autCourseIndex].attempts;
          const updatedAttempts = (newCourseStatuses[autCourseIndex].status !== status && status !== 'not-started')
            ? currentAttempts + 1
            : currentAttempts;

          newCourseStatuses[autCourseIndex] = {
            ...newCourseStatuses[autCourseIndex],
            status: status,
            attempts: updatedAttempts
          };
        } else if (courseCode && courseName && points > 0) {
          // If it's a custom course not in AUT requirements, add/update it
          const existingCustomCourseIndex = newCustomCourses.findIndex(c => c.code === courseCode);
          if (existingCustomCourseIndex === -1) {
            newCustomCourses.push({
              code: courseCode,
              name: courseName,
              points: points,
              isCustom: true // Mark as custom
            });
          } else {
            // Update existing custom course details if found
            newCustomCourses[existingCustomCourseIndex] = {
              ...newCustomCourses[existingCustomCourseIndex],
              name: courseName,
              points: points
            };
          }
        }
      });

      setCourseStatuses(newCourseStatuses);
      setCustomCourses(newCustomCourses);

    } catch (err) {
      console.error("Error pasting data:", err);
      // Using a simple alert for brevity, but a custom modal would be preferred in production.
      alert('데이터를 붙여넣을 수 없습니다. 클립보드 권한을 확인하고 다음 형식으로 데이터가 올바른지 확인하십시오 (탭으로 구분): 코드 | 코스 이름 | 등급 | 학점');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header and Summary Cards */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            AUT 간호학과 학점 추적기
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={pasteData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <Upload className="w-4 h-4" />
              데이터 붙여넣기
            </button>
            <button
              onClick={resetSheet}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2H19a2 2 0 0 0-2 2v2"/><path d="M2.5 22H5a2 2 0 0 0 2-2v-2"/><path d="M8 2h.01"/><path d="M16 2h.01"/><path d="M12 6h.01"/><path d="M12 18h.01"/><path d="M16 22h.01"/><path d="M8 22h.01"/><path d="m17.6 15.6-.4-.4c-.7-.7-1.7-1-.7-2s.6-1.5 2.4-2.2c.4-.1.8-.2 1-.2s.5.1.5.2l.5.5"/><path d="M7 10l-.4-.4c-.7-.7-1.7-1-.7-2s.6-1.5 2.4-2.2c.4-.1.8-.2 1-.2s.5.1.5.2l.5.5"/><path d="M10 18h.01"/><path d="M14 6h.01"/><path d="M12 2h.01"/><path d="M12 22h.01"/></svg>
              재설정
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">총 획득 학점</h3>
            <p className="text-2xl font-bold text-blue-600">{currentTotalPoints} / {TOTAL_GRADUATION_POINTS}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">졸업 준비도</h3>
            <p className="text-md text-green-600">{graduationStatus}</p>
          </div>
        </div>
      </div>

      {/* Manual Course Entry Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">수동 코스 추가 (대체 확인용)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-4">
          <div>
            <label htmlFor="manualCourseCode" className="block text-sm font-medium text-gray-700">코스 코드</label>
            <input type="text" id="manualCourseCode" value={manualCourseCode} onChange={(e) => setManualCourseCode(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   placeholder="예: ALTCUSTOM101" />
          </div>
          <div>
            <label htmlFor="manualCourseName" className="block text-sm font-medium text-gray-700">코스 이름</label>
            <input type="text" id="manualCourseName" value={manualCourseName} onChange={(e) => setManualCourseName(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   placeholder="예: 대체 간호 연구" />
          </div>
          <div>
            <label htmlFor="manualCoursePoints" className="block text-sm font-medium text-gray-700">학점</label>
            <input type="number" id="manualCoursePoints" value={manualCoursePoints} onChange={(e) => setManualCoursePoints(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                   placeholder="예: 15" min="0" />
          </div>
          <button onClick={handleAddCustomCourse} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 sm:col-span-2 lg:col-span-1 self-end">
              <Plus className="w-4 h-4" />
              코스 추가
          </button>
        </div>
        {customCourses.length > 0 && (
            <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">추가된 코스 목록:</h3>
                <div className="space-y-2">
                    {customCourses.map((course, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg border border-gray-200">
                            <span className="text-sm font-medium">{course.code} - {course.name} ({course.points} pts)</span>
                            <button onClick={() => handleRemoveCustomCourse(index)} className="text-red-500 hover:text-red-700 text-xs font-medium ml-4">제거</button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Main Course Requirements Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex-grow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AUT 간호학과 커리큘럼 (360 학점)</h2>
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
                    <p className="text-xs text-gray-600">{course.pathway} - Level {course.level} | {course.points} pts</p>
                    {status === 'failed' && attempts > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        실패 ({attempts} {attempts > 1 ? '회 시도' : '회 시도'})
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 mt-2 sm:mt-0">
                    {getCourseStatusIcon(status, attempts)}
                    <button
                      onClick={() => updateCourseStatus(course.code, 'passed')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200
                        ${status === 'passed' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}
                      `}
                    >
                      Pass
                    </button>
                    <button
                      onClick={() => updateCourseStatus(course.code, 'failed')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200
                        ${status === 'failed' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}
                      `}
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
  );
};

export default StudentProgressTracker;
