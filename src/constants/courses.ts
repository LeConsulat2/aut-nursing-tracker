export interface Course {
  code: string;
  name: string;
  level: number;
  points: number;
  pathway: string;
}

export const AUT_NURSING_COURSE_REQUIREMENTS: Course[] = [
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

export const TOTAL_GRADUATION_POINTS = 360;
export const PASSING_GRADES_PASTE = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
export const FAILING_GRADES_PASTE = ['D', 'F', 'W'];
