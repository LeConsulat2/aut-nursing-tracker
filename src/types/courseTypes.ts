// src/types/courseTypes.ts

export type CourseStatus = 'passed' | 'failed' | 'not-started';

export interface Course {
  code: string;
  name: string;
  level: number;
  points: number;
  pathway: string;
}

export interface CourseStatusType {
  code: string;
  status: CourseStatus;
  attempts: number;
}

export interface CustomCourse extends Omit<Course, 'level' | 'pathway'> {
  status: CourseStatus;
  attempts: number;
  isCustom: boolean;
}
