import request from 'supertest';
import app from '../src/app';

describe('Security Headers', () => {
    it('should have security headers (Helmet)', async () => {
        const res = await request(app).get('/health');

        // Helmet adds these by default
        expect(res.headers['x-dns-prefetch-control']).toBe('off');
        expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
        expect(res.headers['strict-transport-security']).toBeDefined();
        expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should have CORS headers', async () => {
        const res = await request(app).get('/health');
        expect(res.headers['access-control-allow-origin']).toBeDefined();
        // Since we default to specific origin, it might be reflected or specific string
        // If no Origin header sent, some CORS configs don't send Allow-Origin.
        // Let's force an origin
        const resWithOrigin = await request(app)
            .get('/health')
            .set('Origin', 'http://localhost:5173');
        expect(resWithOrigin.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });
});

describe('Rate Limiting', () => {
    // Note: Testing limits might be slow if limits are high.
    // Our auth limit is 5/hour, which is testable.

    it('should impose rate limits on auth routes', async () => {
        const agent = request.agent(app);

        // Hit login endpoint 5 times
        for (let i = 0; i < 5; i++) {
            const res = await agent.post('/api/auth/login').send({ email: 'test@test.com', password: 'wrong' });
            // Expect 400 or 401 (invalid creds) but NOT 429 yet
            expect(res.status).not.toBe(429);
        }

        // 6th time should fail
        const res = await agent.post('/api/auth/login').send({ email: 'test@test.com', password: 'wrong' });
        expect(res.status).toBe(429);
        expect(res.text).toContain('Too many login attempts');
    });
});
