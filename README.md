# Lo Naim - Debt Tracker PWA

A mobile-first Progressive Web Application for tracking debts between friends with automated polite reminders.

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### Development Setup

1. **Clone and navigate**
   ```bash
   cd lo-naim-debt-tracker
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

4. **Run database migrations**
   ```bash
   cd backend
   npm run prisma:migrate
   ```

### Manual Setup (Without Docker)

1. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Start services**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

## Project Status

✅ **Completed**
- Project structure and configuration
- Frontend setup with React, TypeScript, Vite, TailwindCSS
- Backend setup with Express, TypeScript, Prisma
- Docker Compose configuration
- Authentication system architecture
- Glassmorphism UI design system
- Route structure and navigation

🚧 **In Progress**
- Authentication implementation (Firebase/Clerk integration)
- API endpoint implementations
- Database migrations

📋 **To Do**
- Debt management features
- Friend system
- Payment tracking
- Push notifications (OneSignal)
- Email notifications (Resend)
- Reminder scheduler (cron jobs)
- Testing suite
- Production deployment

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Zustand (state management)
- Framer Motion (animations)
- Axios (HTTP client)
- PWA (Workbox)

### Backend
- Node.js 20 + TypeScript
- Express.js (API framework)
- Prisma (ORM)
- PostgreSQL (database)
- Redis (cache & job queue)
- JWT (authentication)
- OneSignal (push notifications)
- Resend (email)

### DevOps
- Docker & Docker Compose
- GitHub Actions (planned)
- Vercel/Netlify (frontend hosting - planned)
- Railway/Render (backend hosting - planned)

## Project Structure

```
lo-naim-debt-tracker/
├── frontend/          # React PWA
├── backend/           # Express API
├── docker-compose.yml # Development environment
└── README.md
```

## Contributing

This is currently in active development. Check the implementation plan for current priorities.

## License

MIT
