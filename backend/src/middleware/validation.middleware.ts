import { ZodError } from 'zod'
import { AppError } from './errorHandler.middleware'

export const handleZodError = (error: ZodError) => {
    const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }))

    return new AppError(
        `Validation error: ${errors.map(e => e.message).join(', ')}`,
        400
    )
}
