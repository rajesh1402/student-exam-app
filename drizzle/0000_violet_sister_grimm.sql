CREATE TABLE IF NOT EXISTS "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exam_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"exam_id" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"status" text NOT NULL,
	"total_score" numeric,
	"attempted_questions" integer,
	"correct_questions" integer,
	"incorrect_questions" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exam_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"order_number" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"duration" integer,
	"total_questions" integer NOT NULL,
	"mcq_count" integer NOT NULL,
	"qa_count" integer NOT NULL,
	"negative_marking" boolean NOT NULL,
	"free_navigation" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mcq_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"content" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "qa_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"content" text NOT NULL,
	"explanation" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_attempt_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"student_answer" text,
	"is_correct" boolean,
	"score" numeric,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"flagged_for_review" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"difficulty_level" text NOT NULL,
	"assigned_marks" numeric NOT NULL,
	"chapter" integer NOT NULL,
	"grade_level" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"auth_provider" text NOT NULL,
	"grade_level" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "students_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "students_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exams" ADD CONSTRAINT "exams_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mcq_options" ADD CONSTRAINT "mcq_options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "qa_answers" ADD CONSTRAINT "qa_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_exam_attempt_id_exam_attempts_id_fk" FOREIGN KEY ("exam_attempt_id") REFERENCES "exam_attempts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
