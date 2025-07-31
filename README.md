# Joanne Personal Blog

## Frontend Development

## Backend Development
Primary development language is TypeScript, using Express.js for the server and MySQL for the database. Docker is used for containerization, and Render is used for deployment.

### Tools
- Node.js
- Express.js
- MySQL
- Docker
- Render

#### Docker Usage
1. Create a repository on Docker Hub with name identical to the one on Github.
2. Create a Dockerfile in the backend directory with deployment instructions.
3. Create a GitHub Actions workflow file that connects to Docker Hub.
4. Add Docker Hub credentials to GitHub secrets.
5. Push changes to the repository to trigger the workflow and deploy the backend.

#### Render Deployment
1. Add new Render Web Service.
2. Select the repository and branch. The service should automatically select Docker as the deployment method.
3. Set the root to `./backend` while using monorepo.
4. Set up the environment variables for database connection.