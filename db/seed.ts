import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { eq, sql } from 'drizzle-orm';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  console.log('Seeding database...');

  // Seed subjects
  const subjectNames = ['History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Math', 'Computer Applications'];
  for (const name of subjectNames) {
    await db.insert(schema.subjects).values({ name }).onConflictDoNothing();
  }

  // Seed exams
  const examTypes = ['Practice Test', 'Live Exam'];
  for (const type of examTypes) {
    for (const subject of subjectNames) {
      const subjectResult = await db.select({ id: schema.subjects.id })
        .from(schema.subjects)
        .where(eq(schema.subjects.name, subject))
        .limit(1);

      if (subjectResult.length > 0) {
        await db.insert(schema.exams).values({
          subjectId: sql`${subjectResult[0].id}`,
          name: `${subject} ${type}`,
          type,
          duration: type === 'Live Exam' ? sql`120` : null,
          totalQuestions: sql`30`,
          mcqCount: sql`20`,
          qaCount: sql`10`,
          negativeMarking: false,
          freeNavigation: type === 'Practice Test',
        }).onConflictDoNothing();
      }
    }
  }

  // Seed questions (20 MCQ and 10 Q&A for each subject)
  for (const subject of subjectNames) {
    const subjectResult = await db.select({ id: schema.subjects.id })
      .from(schema.subjects)
      .where(eq(schema.subjects.name, subject))
      .limit(1);

    if (subjectResult.length > 0) {
      const subjectId = subjectResult[0].id;
      
      // Create 20 MCQ questions
      for (let i = 1; i <= 20; i++) {
        // MCQ
        const mcqQuestion = await db.insert(schema.questions).values({
          subjectId: sql`${subjectId}`,
          type: 'mcq',
          content: `${subject} MCQ Question ${i}`,
          difficultyLevel: ['Simple', 'Difficult', 'Challenging'][Math.floor(Math.random() * 3)],
          assignedMarks: sql`1`,
          chapter: sql`${Math.floor(Math.random() * 10) + 1}`,
          gradeLevel: sql`${Math.floor(Math.random() * 5) + 6}`,
        }).returning({ id: schema.questions.id });

        // MCQ options
        for (let j = 1; j <= 4; j++) {
          await db.insert(schema.mcqOptions).values({
            questionId: sql`${mcqQuestion[0].id}`,
            content: `${subject} MCQ ${i} Option ${j}`,
            isCorrect: j === 1,
          });
        }
      }

      // Create 10 Q&A questions
      for (let i = 1; i <= 10; i++) {
        // Q&A
        const qaQuestion = await db.insert(schema.questions).values({
          subjectId: sql`${subjectId}`,
          type: 'qa',
          content: `${subject} Q&A Question ${i}`,
          difficultyLevel: ['Simple', 'Difficult', 'Challenging'][Math.floor(Math.random() * 3)],
          assignedMarks: sql`2`,
          chapter: sql`${Math.floor(Math.random() * 10) + 1}`,
          gradeLevel: sql`${Math.floor(Math.random() * 5) + 6}`,
        }).returning({ id: schema.questions.id });

        await db.insert(schema.qaAnswers).values({
          questionId: sql`${qaQuestion[0].id}`,
          content: `Model answer for ${subject} Q&A ${i}`,
          explanation: `Explanation for ${subject} Q&A ${i}`,
        });
      }
    }
  }

  // Associate questions with exams
  const exams = await db.select().from(schema.exams);
  for (const exam of exams) {
    // Get all questions for the exam's subject
    const questions = await db.select()
      .from(schema.questions)
      .where(eq(schema.questions.subjectId, exam.subjectId));
    
    // Separate MCQ and Q&A questions
    const mcqQuestions = questions.filter(q => q.type === 'mcq');
    const qaQuestions = questions.filter(q => q.type === 'qa');

    // Add MCQ questions to exam
    for (let i = 0; i < exam.mcqCount; i++) {
      await db.insert(schema.examQuestions).values({
        examId: sql`${exam.id}`,
        questionId: sql`${mcqQuestions[i].id}`,
        orderNumber: sql`${i + 1}`,
      }).onConflictDoNothing();
    }

    // Add Q&A questions to exam
    for (let i = 0; i < exam.qaCount; i++) {
      await db.insert(schema.examQuestions).values({
        examId: sql`${exam.id}`,
        questionId: sql`${qaQuestions[i].id}`,
        orderNumber: sql`${exam.mcqCount + i + 1}`,
      }).onConflictDoNothing();
    }
  }

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
