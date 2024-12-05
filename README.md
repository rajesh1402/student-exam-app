# Student Exam App

This is a Next.js application for managing student exams, built with React 18, TypeScript, Drizzle ORM, and Neon Postgres.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your Neon Postgres connection string
4. Generate database migrations: `npm run db:generate`
5. Push migrations to the database: `npm run db:push`
6. Seed the database: `npm run db:seed`
7. Run the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run db:generate`: Generate database migrations
- `npm run db:push`: Push migrations to the database
- `npm run db:seed`: Seed the database with initial data

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Postgres Documentation](https://neon.tech/docs/)

