# Joanne Personal Blog

## Overview

## Frontend Development
[Webpage URL](https://joanne-09.github.io/Joanne-web)

## Backend Development
Primary development language is TypeScript, using Express.js for the server and PostgreSQL for the database. Docker is used for containerization, and Vercel is used for deployment.

### Tools
- Node.js
- Express.js
- PostgreSQL (Neon Database)
- GitHub Actions
- Docker
- Vercel

#### Docker Usage
1. Create a repository on Docker Hub with name identical to the one on Github.
2. Create a Dockerfile in the backend directory with deployment instructions.
3. Create a GitHub Actions workflow file that connects to Docker Hub.
4. Add Docker Hub credentials to GitHub secrets.
5. Push changes to the repository to trigger the workflow and deploy the backend.

#### Vercel Deployment
1. Add a new project on Vercel and import the GitHub repository.
2. The `vercel.json` file in the root directory will automatically configure the backend deployment as a serverless function.
3. Set up the environment variables for the database connection (e.g., `DB_URL`) in the Vercel project settings.
4. Deploy the project.
5. Copy the backend URL from Vercel after deployment and add it to GitHub secrets as `VERCEL_BACKEND_URL`.

#### Database
I use Neon Database because it provides a free tier for PostgreSQL databases.
1. Create .env file in the backend directory with the following content:
   ```
   DB_URL=your_neon_database_url
   ```
2. Install `pg` and `@types/pg` to connect to Neon Database:
   ```
   npm install pg @types/pg
   ```
3. Create a table named `posts` in the database with the following SQL command:
   ```sql
   CREATE TABLE posts (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       content TEXT NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   ```
4. Create a `db.ts` file in the backend directory to manage the database connection.

#### Connect to Frontend
Handle the connection in `Article.tsx`:
1. In the frontend, use the `VERCEL_BACKEND_URL` environment variable to connect to the backend.
2. Use Fetch API to make requests to the backend endpoints.