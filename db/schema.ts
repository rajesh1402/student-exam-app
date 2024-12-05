import { pgTable, serial, text, timestamp, integer, boolean, decimal } from 'drizzle-orm/pg-core';

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  clerkUserId: text('clerk_user_id').unique().notNull(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  authProvider: text('auth_provider').notNull(),
  gradeLevel: integer('grade_level').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const exams = pgTable('exams', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  duration: integer('duration'),
  totalQuestions: integer('total_questions').notNull(),
  mcqCount: integer('mcq_count').notNull(),
  qaCount: integer('qa_count').notNull(),
  negativeMarking: boolean('negative_marking').notNull(),
  freeNavigation: boolean('free_navigation').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  type: text('type').notNull(),
  content: text('content').notNull(),
  difficultyLevel: text('difficulty_level').notNull(),
  assignedMarks: decimal('assigned_marks').notNull(),
  chapter: integer('chapter').notNull(),
  gradeLevel: integer('grade_level').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const examAttempts = pgTable('exam_attempts', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  examId: integer('exam_id').references(() => exams.id).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  status: text('status').notNull(),
  totalScore: decimal('total_score'),
  attemptedQuestions: integer('attempted_questions'),
  correctQuestions: integer('correct_questions'),
  incorrectQuestions: integer('incorrect_questions'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const questionAttempts = pgTable('question_attempts', {
  id: serial('id').primaryKey(),
  examAttemptId: integer('exam_attempt_id').references(() => examAttempts.id).notNull(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  studentAnswer: text('student_answer'),
  isCorrect: boolean('is_correct'),
  score: decimal('score'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  flaggedForReview: boolean('flagged_for_review').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const examQuestions = pgTable('exam_questions', {
  id: serial('id').primaryKey(),
  examId: integer('exam_id').references(() => exams.id).notNull(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  orderNumber: integer('order_number').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const mcqOptions = pgTable('mcq_options', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  content: text('content').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const qaAnswers = pgTable('qa_answers', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  content: text('content').notNull(),
  explanation: text('explanation').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

