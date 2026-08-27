import crypto from 'node:crypto';

const SECRET = import.meta.env.AUTH_SECRET;

export function createSessionToken() {
    const payload = 'authenticated';
    const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
    if (!token) return false;
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return false;
    const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    return sig.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}