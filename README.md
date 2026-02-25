# kleene-cars-api

A Node.js/Express API for Kleene Cars.

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration

5. Start the server:

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

## Deployment to Vercel

### Prerequisites

- Node.js 18+
- Vercel account
- Git repository

### Steps

1. **Install Vercel CLI** (optional):

   ```bash
   npm install -g vercel
   ```

2. **Connect your repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Select the project root directory

3. **Set Environment Variables** in Vercel:
   - Go to your project settings → Environment Variables
   - **CRITICAL**: Add `DATABASE_URL` as a single connection string:
     ```
     postgresql://user:password@host:port/dbname
     ```
   - Optional: Add other environment variables:
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `NODE_ENV=production`

   **Example DATABASE_URL for Supabase**:

   ```
   postgresql://postgres:[password]@[host].supabase.co:5432/postgres
   ```

4. **Deploy**:
   - Push to your main/production branch, or click "Deploy" in the Vercel dashboard

### Important Notes

- **DATABASE_URL is required for Vercel** - Use PostgreSQL connection string format
- Connection pooling is configured automatically for Vercel serverless functions
- The app provides a health check endpoint: `GET /api/health`
- Vercel's serverless functions have a timeout limit (typically 10-60 seconds depending on plan)
- For local development, you can use individual DB parameters (DB_HOST, DB_USER, etc.)
- Ensure your database allows connections from Vercel's IP ranges or is on a public network

## API Endpoints

- `GET /` - Health check
- `GET/POST /api/*` - Main API routes
