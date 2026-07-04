export function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'untitled';
}

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
  emailVerified: boolean;
}

export interface CertificateDto {
  id: string;
  courseId: string;
  courseTitle: string;
  pathName: string;
  studentName: string;
  instructorName: string;
  verificationCode: string;
  issuedAt: string;
}

export interface AdminUserDto {
  id: string;
  username: string;
  email: string;
  role: Role;
  xp: number;
  streak: number;
  createdAt: string;
  bannedAt: string | null;
  chatBlockedAt: string | null;
}

export interface ChatMessageDto {
  id: string;
  room: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  role: Role;
  content: string;
  createdAt: string;
}

export interface CertificateVerificationDto {
  valid: boolean;
  studentName?: string;
  courseTitle?: string;
  pathName?: string;
  issuedAt?: string;
  certificateId?: string;
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
  /** set when the viewer has earned a certificate for this course */
  certificateId?: string | null;
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

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED';

export interface ProjectSubmissionDto {
  id: string;
  submissionUrl: string;
  status: SubmissionStatus;
  feedback: string | null;
  submittedAt: string;
  reviewedAt: string | null;
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
  requiresSubmission: boolean;
  mySubmission: ProjectSubmissionDto | null;
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
  requiresSubmission: boolean;
  quiz: QuizEditDto | null;
}

// --- Project submission review ---

export interface InstructorSubmissionDto {
  id: string;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentUsername: string;
  submissionUrl: string;
  status: SubmissionStatus;
  feedback: string | null;
  submittedAt: string;
  reviewedAt: string | null;
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

// --- Challenges ---

export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type ChallengeLanguage = 'PYTHON' | 'JAVASCRIPT' | 'TYPESCRIPT';

export interface ChallengeSummaryDto {
  id: string;
  slug: string;
  title: string;
  difficulty: ChallengeDifficulty;
  languages: ChallengeLanguage[];
  solved: boolean;
}

export interface ChallengeExampleDto {
  input: unknown[];
  expectedOutput: unknown;
}

export interface ChallengeTestCaseInputDto {
  id: string;
  input: unknown[];
  isHidden: boolean;
}

export interface ChallengeDetailDto extends ChallengeSummaryDto {
  prompt: string;
  entryPoint: string;
  starterCode: Partial<Record<'python' | 'javascript' | 'typescript', string>>;
  examples: ChallengeExampleDto[];
  testCases: ChallengeTestCaseInputDto[];
}

export interface ChallengeSubmissionResultDto {
  testCaseId: string;
  actualOutput: unknown;
  errored: boolean;
  errorMessage: string | null;
}

export interface ChallengeSubmitRequestDto {
  language: ChallengeLanguage;
  results: ChallengeSubmissionResultDto[];
}

export interface ChallengeSubmissionDto {
  passed: boolean;
  testsPassed: number;
  testsTotal: number;
  failedTestCaseIds: string[];
  xpAwarded: number;
}

export type ChallengeStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED';

export interface TeachChallengeSummaryDto {
  id: string;
  title: string;
  difficulty: ChallengeDifficulty;
  languages: ChallengeLanguage[];
  status: ChallengeStatus;
  reviewNote: string | null;
  testCaseCount: number;
}

export interface ChallengeTestCaseEditDto {
  input: unknown[];
  expectedOutput: unknown;
  isHidden: boolean;
}

export interface TeachChallengeDetailDto extends TeachChallengeSummaryDto {
  prompt: string;
  entryPoint: string;
  starterCode: Partial<Record<'python' | 'javascript' | 'typescript', string>>;
  testCases: ChallengeTestCaseEditDto[];
}

export interface AdminChallengeDto {
  id: string;
  title: string;
  difficulty: ChallengeDifficulty;
  languages: ChallengeLanguage[];
  instructorName: string;
  status: ChallengeStatus;
  reviewNote: string | null;
  testCaseCount: number;
  createdAt: string;
}

// --- Leaderboard ---

export interface LeaderboardEntryDto {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  xp: number;
  streak: number;
  challengesSolved: number;
  isCurrentUser: boolean;
}

export interface LeaderboardDto {
  entries: LeaderboardEntryDto[];
}

// --- Achievements ---

export type AchievementMetric = 'XP' | 'STREAK' | 'LESSONS_COMPLETED' | 'QUIZZES_PASSED' | 'CHALLENGES_SOLVED';

export interface AchievementDto {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  metric: AchievementMetric;
  threshold: number;
  unlocked: boolean;
  unlockedAt: string | null;
}
