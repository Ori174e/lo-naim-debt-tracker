import express, { Express, Request, Response } from 'express'
import cors from 'cors'
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

// Security Middleware
app.use(helmet())
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'https://lo-naim-debt-tracker.vercel.app',
            process.env.CLIENT_URL,
            process.env.FRONTEND_URL,
            process.env.CORS_ORIGIN
        ].filter(Boolean) as string[];

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
            callback(null, true);
        } else {
            // Optional: Log blocked origin for debugging
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))

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
