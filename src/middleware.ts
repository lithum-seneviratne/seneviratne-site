import { defineMiddleware } from "astro:middleware";
import { verifySessionToken } from "./lib/auth";

export const onRequest = defineMiddleware((context, next) => {
    if (context.url.pathname.startsWith('/admin')) {
        const token = context.cookies.get('session')?.value;
        if (!verifySessionToken(token)) {
            return context.redirect('/login');
        }
    }
    return next();
})