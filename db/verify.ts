import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function verifyData() {
  console.log('Verifying database contents...\n');

  // Check subjects
  const subjects = await db.select().from(schema.subjects);
  console.log('Subjects:', subjects.length);
  console.log(subjects);
  console.log('\n-------------------\n');

  // Check exams
  const exams = await db.select().from(schema.exams);
  console.log('Exams:', exams.length);
  console.log(exams);
  console.log('\n-------------------\n');

  // Check questions
  const questions = await db.select().from(schema.questions);
  console.log('Questions:', questions.length);
  console.log('Sample questions:');
  console.log(questions.slice(0, 2));
  console.log('\n-------------------\n');

  // Count MCQ vs QA questions
  const mcqCount = questions.filter(q => q.type === 'mcq').length;
  const qaCount = questions.filter(q => q.type === 'qa').length;
  console.log('MCQ Questions:', mcqCount);
  console.log('QA Questions:', qaCount);
  console.log('\n-------------------\n');

  // Check MCQ options
  const mcqOptions = await db.select().from(schema.mcqOptions);
  console.log('MCQ Options:', mcqOptions.length);
  console.log('Sample MCQ options:');
  console.log(mcqOptions.slice(0, 4));
  console.log('\n-------------------\n');

  // Check QA answers
  const qaAnswers = await db.select().from(schema.qaAnswers);
  console.log('QA Answers:', qaAnswers.length);
  console.log('Sample QA answers:');
  console.log(qaAnswers.slice(0, 2));
  console.log('\n-------------------\n');

  // Check exam questions
  const examQuestions = await db.select().from(schema.examQuestions);
  console.log('Exam Questions:', examQuestions.length);
  console.log('Sample exam questions:');
  console.log(examQuestions.slice(0, 3));

  await pool.end();
}

verifyData().catch(error => {
  console.error('Error verifying database:', error);
  process.exit(1);
});
