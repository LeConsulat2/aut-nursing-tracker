// src/hooks/useCourseProgress.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CourseStatus } from '../types/courseTypes';
import { AUT_NURSING_COURSE_REQUIREMENTS, TOTAL_GRADUATION_POINTS } from '../constants/autCourses';
import { PASSING_GRADES, FAILING_GRADES } from '../constants/grades';

export const useCourseProgress = () => {
  // State for tracking status of pre-defined AUT courses
  const [courseStatuses, setCourseStatuses] = useState<Array<{
    code: string;
    status: CourseStatus;
    attempts: number;
  }>>(() => {
    const saved = localStorage.getItem('courseStatuses');
    return saved ? JSON.parse(saved) : 
      AUT_NURSING_COURSE_REQUIREMENTS.map((course: { code: string }) => ({
        code: course.code,
        status: 'not-started' as CourseStatus,
        attempts: 0
      }));
  });

  // State for manually added custom courses
  const [customCourses, setCustomCourses] = useState<Array<{
    code: string;
    name: string;
    points: number;
    status: CourseStatus;
    attempts: number;
    isCustom: boolean;
  }>>(() => {
    const saved = localStorage.getItem('customCourses');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when courseStatuses changes
  useEffect(() => {
    localStorage.setItem('courseStatuses', JSON.stringify(courseStatuses));
  }, [courseStatuses]);

  // Save to localStorage when customCourses changes
  useEffect(() => {
    localStorage.setItem('customCourses', JSON.stringify(customCourses));
  }, [customCourses]);

  /**
   * Updates the status of a specific course in the courseStatuses array.
   * Implements toggle functionality: clicking the same status button resets to 'not-started'.
   */
  const updateCourseStatus = useCallback((courseCode: string, actionType: 'passed' | 'failed') => {
    setCourseStatuses(prevStatuses =>
      prevStatuses.map(course => {
        if (course.code === courseCode) {
          const currentStatus = course.status;
          const currentAttempts = course.attempts;

          // If the action is the same as the current status, reset it to 'not-started'
          if (actionType === currentStatus) {
            return { ...course, status: 'not-started', attempts: 0 };
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
   * Adds or updates a custom course in the customCourses state.
   */
  const addOrUpdateCustomCourse = useCallback((courseData: {
    code: string;
    name: string;
    points: number;
  }) => {
    setCustomCourses(prevCourses => {
      const existingIndex = prevCourses.findIndex(c => c.code === courseData.code);
      
      if (existingIndex !== -1) {
        // Update existing course
        return prevCourses.map((course, idx) => 
          idx === existingIndex 
            ? { ...course, ...courseData }
            : course
        );
      } else {
        // Add new course
        return [
          ...prevCourses,
          {
            ...courseData,
            status: 'not-started' as const,
            attempts: 0,
            isCustom: true
          }
        ];
      }
    });
  }, []);

  /**
   * Removes a custom course by its code.
   */
  const removeCustomCourse = useCallback((courseCode: string): void => {
    setCustomCourses(prevCourses => 
      prevCourses.filter(course => course.code !== courseCode)
    );
  }, []);

  /**
   * Resets all progress for both standard and custom courses.
   */
  const resetAllProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setCourseStatuses(prevStatuses =>
        prevStatuses.map(course => ({
          ...course,
          status: 'not-started',
          attempts: 0
        }))
      );

      setCustomCourses(prevCourses =>
        prevCourses.map(course => ({
          ...course,
          status: 'not-started',
          attempts: 0
        }))
      );
    }
  }, []);

  /**
   * Processes pasted data to update course statuses.
   */
  const pasteData = useCallback((pastedText: string) => {
    const lines = pastedText.split('\n').filter(line => line.trim() !== '');
    
    lines.forEach(line => {
      const [code, grade] = line.split('\t').map(part => part.trim());
      
      if (code && grade) {
        const normalizedGrade = grade.toUpperCase();
        
        if (PASSING_GRADES.includes(normalizedGrade)) {
          updateCourseStatus(code, 'passed');
        } else if (FAILING_GRADES.includes(normalizedGrade)) {
          updateCourseStatus(code, 'failed');
        }
      }
    });
  }, [updateCourseStatus]);

  // Calculate total points and graduation status
  const { currentTotalPoints, graduationStatus } = useMemo((): { currentTotalPoints: number; graduationStatus: string } => {
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

    const graduationMsg = totalPoints >= TOTAL_GRADUATION_POINTS
      ? '🎉 You are eligible to graduate!'
      : `You need ${TOTAL_GRADUATION_POINTS - totalPoints} more points to graduate.`;

    return { currentTotalPoints: totalPoints, graduationStatus: graduationMsg };
  }, [courseStatuses, customCourses]);

  return {
    courseStatuses,
    customCourses,
    currentTotalPoints,
    graduationStatus,
    updateCourseStatus,
    addOrUpdateCustomCourse,
    removeCustomCourse,
    resetAllProgress,
    pasteData
  };
};