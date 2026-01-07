# Quick Setup Guide

## Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or use Docker Compose)
- Redis (or use Docker Compose)

## Option 1: Quick Start with Docker (Recommended)

1. **Create environment files**
   
   Create `backend/.env`:
   ```bash
   DATABASE_URL=postgresql://loniam:loniam123@postgres:5432/loniam
   REDIS_URL=redis://redis:6379
   JWT_SECRET=dev-jwt-secret-change-in-production
   NODE_ENV=development
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

   Create `frontend/.env.local`:
   ```bash
   VITE_API_URL=http://localhost:3000/api
   ```

2. **Start all services**
   ```bash
   docker-compose up
   ```

3. **Run database migrations** (in a new terminal)
   ```bash
   cd backend
   npm run prisma:migrate
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

## Option 2: Manual Setup (Without Docker)

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env file**
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/loniam
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Run Prisma migrations**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Start backend**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Create .env.local file**
   ```bash
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Start frontend**
   ```bash
   npm run dev
   ```

## Testing the Application

1. Open http://localhost:5173
2. Click "Don't have an account? Sign up"
3. Create an account:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. You should be redirected to the dashboard
5. Verify that the UI shows glassmorphism effects and animations

## Troubleshooting

### PowerShell Script Execution Error

If you see "running scripts is disabled on this system":

**Option A (Recommended):**
Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy RemoteSigned
```

**Option B:**
Use npx commands:
```bash
npx vite         # instead of npm run dev
npx tsx watch src/server.ts   # for backend
```

### Database Connection Error

Make sure PostgreSQL is running:
```bash
# Check with Docker
docker ps

# Or start PostgreSQL service
# Windows: services.msc → PostgreSQL
# Mac: brew services start postgresql
```

### Port Already in Use

If ports 3000 or 5173 are taken:
- Kill the process using the port
- Or change PORT in backend/.env and VITE_API_URL in frontend/.env.local

## Next Steps

After successful setup:
1. ✅ Phase 1 is complete (Authentication working)
2. 📋 Next: Implement debt management (Phase 2)
3. 📋 Then: Add notifications and reminders (Phase 3)
4. 📋 Finally: Polish and deploy (Phase 4)
