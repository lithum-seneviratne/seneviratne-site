import { defineMiddleware } from "astro:middleware";
import { verifySessionToken } from "./lib/auth";

// Site under construction: set to false to bring the site back online.
const MAINTENANCE_MODE = true;

export const onRequest = defineMiddleware((context, next) => {
    if (MAINTENANCE_MODE) {
        const { pathname } = context.url;
        const isExempt =
            pathname === '/under-construction' ||
            pathname.startsWith('/admin') ||
            pathname === '/login' ||
            pathname.startsWith('/api') ||
            /\.[a-zA-Z0-9]+$/.test(pathname);

        if (!isExempt) {
            return context.redirect('/under-construction');
        }
    }

    if (context.url.pathname.startsWith('/admin')) {
        const token = context.cookies.get('session')?.value;
        if (!verifySessionToken(token)) {
            return context.redirect('/login');
        }
    }
    return next();
})