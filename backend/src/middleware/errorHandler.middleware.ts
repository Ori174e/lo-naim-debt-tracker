import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export class AppError extends Error {
    statusCode: number
    isOperational: boolean

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }))

        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            errors,
        })
    }

    // Handle custom AppError
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        })
    }

    // Log unexpected errors
    console.error('ERROR:', err)

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    })
}
