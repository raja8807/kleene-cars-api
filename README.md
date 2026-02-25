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
   - Add all variables from `.env.example`:
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `DB_NAME`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_HOST`
     - `DB_PORT`
     - `NODE_ENV=production`

4. **Deploy**:
   - Push to your main/production branch, or click "Deploy" in the Vercel dashboard

### Important Notes

- Database connections must be from a static IP or allow all IPs (not recommended for production)
- Vercel's serverless functions have a timeout limit (typically 10-60 seconds depending on plan)
- Use connection pooling for better database performance
- Environment variables are required for production deployment

## API Endpoints

- `GET /` - Health check
- `GET/POST /api/*` - Main API routes
