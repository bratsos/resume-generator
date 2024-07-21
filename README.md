# Resume Generator

## Overview

This Resume Generator is a weekend project I created to streamline the process of managing and creating professional resumes. It's not a public product or service, but rather a personal tool to experiment with modern web technologies and solve a common problem.

### What it does

- Allows creation and management of multiple resume profiles
- Provides sections for personal information, work experiences, and skills
- Includes features for adding side projects and achievements
- Generates a formatted resume suitable for printing or sharing

This project was primarily built as a learning exercise and to explore the capabilities of certain tech stacks in a practical application.

## For Developers

### Tech Stack

- **Frontend**: React with Remix framework
- **Backend**: Node.js with Remix server-side rendering
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Form Handling**: Conform library
- **Type Checking**: TypeScript
- **Runtime Type Validation**: Zod

### Key Technical Features

- Server-side rendering
- Optimistic UI updates
- Responsive design with print-specific styles
- Type-safe database operations
- Docker setup for local development

### Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up the database using Docker: `docker-compose up -d`
4. Run database migrations: `npm run prisma:migrate`
5. Start the development server: `npm run dev`

## Note

While contributions are welcomed, this project is primarily for personal use and learning. For a more comprehensive and maintained resume builder, you might want to check out [rxresu.me](https://rxresu.me/).
