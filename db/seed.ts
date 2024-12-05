import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

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
          subjectId: subjectResult[0].id,
          name: `${subject} ${type}`,
          type,
          duration: type === 'Live Exam' ? 120 : null, // 2 hours for live exam, null for practice test
          totalQuestions: 30,
          mcqCount: 20,
          qaCount: 10,
          negativeMarking: false,
          freeNavigation: type === 'Practice Test',
        }).onConflictDoNothing();
      }
    }
  }

  // Seed questions (3 for each subject)
  for (const subject of subjectNames) {
    const subjectResult = await db.select({ id: schema.subjects.id })
      .from(schema.subjects)
      .where(eq(schema.subjects.name, subject))
      .limit(1);

    if (subjectResult.length > 0) {
      const subjectId = subjectResult[0].id;
      
      for (let i = 1; i <= 3; i++) {
        // MCQ
        const mcqQuestion = await db.insert(schema.questions).values({
          subjectId,
          type: 'mcq',
          content: `${subject} MCQ Question ${i}`,
          difficultyLevel: ['Simple', 'Difficult', 'Challenging'][Math.floor(Math.random() * 3)],
          assignedMarks: 1,
          chapter: Math.floor(Math.random() * 10) + 1,
          gradeLevel: Math.floor(Math.random() * 5) + 6, // Grade 6 to 10
        }).returning({ id: schema.questions.id });

        // MCQ options
        for (let j = 1; j <= 4; j++) {
          await db.insert(schema.mcqOptions).values({
            questionId: mcqQuestion[0].id,
            content: `${subject} MCQ ${i} Option ${j}`,
            isCorrect: j === 1, // First option is correct for simplicity
          });
        }

        // Q&A
        const qaQuestion = await db.insert(schema.questions).values({
          subjectId,
          type: 'qa',
          content: `${subject} Q&A Question ${i}`,
          difficultyLevel: ['Simple', 'Difficult', 'Challenging'][Math.floor(Math.random() * 3)],
          assignedMarks: 2,
          chapter: Math.floor(Math.random() * 10) + 1,
          gradeLevel: Math.floor(Math.random() * 5) + 6, // Grade 6 to 10
        }).returning({ id: schema.questions.id });

        await db.insert(schema.qaAnswers).values({
          questionId: qaQuestion[0].id,
          content: `Model answer for ${subject} Q&A ${i}`,
          explanation: `Explanation for ${subject} Q&A ${i}`,
        });
      }
    }
  }

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});

