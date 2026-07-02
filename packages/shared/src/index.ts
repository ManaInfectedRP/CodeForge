export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK';

export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED';

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
  bio: string | null;
  xp: number;
  streak: number;
}

export interface LearningPathDto {
  id: string;
  slug: string;
  name: string;
  icon: string;
  difficulty: number; // 1-5
  estimatedHours: number;
  description: string;
  lessonCount: number;
  projectCount: number;
  selected?: boolean;
}

export interface CourseSummaryDto {
  id: string;
  title: string;
  description: string;
  pathSlug: string;
  pathName: string;
  instructorName: string;
  lessonCount: number;
  enrolled?: boolean;
  completedLessons?: number;
}

export interface LessonSummaryDto {
  id: string;
  title: string;
  order: number;
  hasQuiz: boolean;
  completed: boolean;
}

export interface CourseDetailDto extends CourseSummaryDto {
  lessons: LessonSummaryDto[];
}

export interface QuizQuestionDto {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[]; // empty for FILL_BLANK
  order: number;
}

export interface QuizDto {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestionDto[];
}

export interface LessonDetailDto {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  order: number;
  videoUrl: string | null;
  content: string;
  completed: boolean;
  quiz: QuizDto | null;
  prevLessonId: string | null;
  nextLessonId: string | null;
}

export interface QuizResultDto {
  score: number;
  passed: boolean;
  passingScore: number;
  correctCount: number;
  totalQuestions: number;
  incorrectQuestionIds: string[];
  xpAwarded: number;
}

export interface EnrollmentDto {
  courseId: string;
  courseTitle: string;
  pathSlug: string;
  pathName: string;
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
}

export interface DashboardDto {
  user: UserDto;
  enrollments: EnrollmentDto[];
  recentLessons: { lessonId: string; lessonTitle: string; courseTitle: string; completedAt: string }[];
  paths: LearningPathDto[];
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface ApiError {
  error: string;
}

// --- Instructor authoring ---

export interface TeachCourseSummaryDto {
  id: string;
  title: string;
  description: string;
  pathSlug: string;
  pathName: string;
  status: CourseStatus;
  reviewNote: string | null;
  lessonCount: number;
  enrollmentCount: number;
}

export interface TeachLessonSummaryDto {
  id: string;
  title: string;
  order: number;
  hasQuiz: boolean;
}

export interface TeachCourseDetailDto extends TeachCourseSummaryDto {
  lessons: TeachLessonSummaryDto[];
}

export interface QuizQuestionEditDto {
  type: QuestionType;
  prompt: string;
  options: string[];
  answer: string;
}

export interface QuizEditDto {
  title: string;
  passingScore: number;
  questions: QuizQuestionEditDto[];
}

export interface TeachLessonDetailDto {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  order: number;
  videoUrl: string | null;
  content: string;
  quiz: QuizEditDto | null;
}

// --- Admin review ---

export interface AdminCourseDto {
  id: string;
  title: string;
  description: string;
  pathName: string;
  instructorName: string;
  status: CourseStatus;
  reviewNote: string | null;
  lessonCount: number;
  createdAt: string;
}
