import rateLimit from 'express-rate-limit'

// General API rate limiter (100 requests per 15 minutes)
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.'
})

// Strict limiter for Auth routes (Login/Signup) - 5 attempts per hour
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many login attempts, please try again after an hour.'
})
