import express, { Express, Request, Response, NextFunction } from 'express'

import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import debtRoutes from './routes/debt.routes'
import friendRoutes from './routes/friend.routes'
import paymentRoutes from './routes/payment.routes'
import notificationRoutes from './routes/notification.routes'
import { errorHandler } from './middleware/errorHandler.middleware'
import helmet from 'helmet'
import { apiLimiter, authLimiter } from './middleware/rateLimiter'

dotenv.config()

const app: Express = express()

// CORS - Emergency configuration
// CORS - Emergency configuration (Manual Headers)
app.use((req: Request, res: Response, next: NextFunction) => {
    const allowedOrigin = "https://lo-naim-debt-tracker.vercel.app";
    const origin = req.headers.origin;

    if (origin === allowedOrigin) {
        res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        res.sendStatus(200);
        return;
    }
    next();
});

// Security Middleware
app.use(helmet())

// Rate Limiting
app.use('/api/auth', authLimiter) // Stricter limit for auth
app.use('/api', apiLimiter)       // General limit for all API

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/debts', debtRoutes)
app.use('/api/friends', friendRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/notifications', notificationRoutes)

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

export default app
