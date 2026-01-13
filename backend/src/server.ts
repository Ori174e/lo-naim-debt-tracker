import app from './app'
import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'

const PORT = process.env.PORT || 8080
export const prisma = new PrismaClient()
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

async function startServer() {
    try {
        // Test database connection
        await prisma.$connect()
        console.log('✅ Database connected')

        // Test Redis connection
        await redis.ping()
        console.log('✅ Redis connected')

        // Start server
        app.listen(Number(PORT), '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`)
            console.log(`📡 API available at http://0.0.0.0:${PORT}/api`)
            console.log(`🏥 Health check at http://0.0.0.0:${PORT}/health`)
        })
    } catch (error) {
        console.error('❌ Failed to start server:', error)
        process.exit(1)
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...')
    await prisma.$disconnect()
    await redis.quit()
    process.exit(0)
})

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...')
    await prisma.$disconnect()
    await redis.quit()
    process.exit(0)
})

startServer()
