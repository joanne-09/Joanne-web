# Joanne Personal Blog

## Frontend Development

## Backend Development
Primary development language is TypeScript, using Express.js for the server and MySQL for the database. Docker is used for containerization, and Render is used for deployment.

### Tools
- Node.js
- Express.js
- MySQL
- GitHub Actions
- Docker
- Render

#### MySQL Database Setup
1. Create .env file in the backend directory with the following content:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_table_name
   ```

#### Docker Usage
1. Create a repository on Docker Hub with name identical to the one on Github.
2. Create a Dockerfile in the backend directory with deployment instructions.
3. Create a GitHub Actions workflow file that connects to Docker Hub.
4. Add Docker Hub credentials to GitHub secrets.
5. Push changes to the repository to trigger the workflow and deploy the backend.

#### Render Deployment
1. Add new Render Web Service.
2. Select the repository and branch. The service should automatically select Docker as the deployment method.
3. Set the root to `.` and configure the path of the Dockerfile to `./backend/Dockerfile`.
4. Set up the environment variables for database connection.