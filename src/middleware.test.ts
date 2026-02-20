import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adminMiddleware, authMiddleware } from './middleware'; // Adjust path
import { ROLES } from './modules/auth';

// Mock isAdminList (assume it's imported/exported from elsewhere)
vi.mock('./shared/api/generated', () => ({
    isAdminList: vi.fn(),
}));

const isAdminListMock = vi.mocked((await import('./shared/api/generated')).isAdminList);


describe('adminMiddleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();

    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('allows admin with valid token', async () => {
        const url = new URL('http://localhost/admin');
        const req = new NextRequest(url, {
            headers: {
                Cookie: `access=valid-token;role=${ROLES.ADMIN}`,
            },
        });

        const response = await adminMiddleware(req);

        expect(response.status).toBe(200)
    });

    it('redirects without token', async () => {
        const url = new URL('http://localhost/admin');
        const req = new NextRequest(url);

        const response = await adminMiddleware(req);

        expect(response.status).toBe(307)
    });

    it('redirects if not admin', async () => {
        isAdminListMock.mockResolvedValueOnce({ message: 'User is not admin', role: 'user' });
        const url = new URL('http://localhost/admin');
        const req = new NextRequest(url, {
            headers: {
                Cookie: 'access=valid-token',
            },
        });

        const response = await adminMiddleware(req);

        expect(response.status).toBe(307)
    });
});



describe('authMiddleware', async () => {
    it('redirects to login if not logged in', async () => {
        const url = new URL('http://localhost/ru/profile');
        const req = new NextRequest(url, {
            headers: {
                Cookie: 'access,NEXT_LOCALE=ru',
            },
        });

        const response = authMiddleware(req);

        expect(response.status).toBe(307)
    });
    it("don't redirect to login if page is public", async () => {
        const url = new URL('http://localhost/ru');
        const req = new NextRequest(url, {
            headers: {
                Cookie: 'NEXT_LOCALE=ru',
            },
        });
        const response = authMiddleware(req);
        expect(response.status).toBe(200)
    })
    it('redirects to home if page is public', async () => {
        const url = new URL('http://localhost/ru/login');
        const req = new NextRequest(url, {
            headers: {
                Cookie: 'access=valid-token;NEXT_LOCALE=ru',
            },
        });
        const response = authMiddleware(req);
        expect(response.status).toBe(307)
    });
    it('redirects to home if page is private', async () => {
        const url = new URL('http://localhost/ru/profile');
        const req = new NextRequest(url, {
            headers: {
                Cookie: 'NEXT_LOCALE=ru',
            },
        });
        const response = authMiddleware(req);
        expect(response.status).toBe(307)
    });

    it("allows access to  private page if logged in", async () => {
        const url = new URL('http://localhost/ru/profile');
        const req = new NextRequest(url, {
            headers: {
                Cookie: 'access=valid-token,NEXT_LOCALE=ru',
            },
        });
        const response = authMiddleware(req);
        expect(response.status).toBe(200)
    });

});