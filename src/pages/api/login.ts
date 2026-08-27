export const prerender = false

import type { APIRoute } from "astro";
import { createSessionToken } from "../../lib/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const form = await request.formData();
    const password = form.get('password');
    console.log('got:', JSON.stringify(password));
    console.log('expected', JSON.stringify(import.meta.env.SITE_PASSWORD));

if (password === import.meta.env.SITE_PASSWORD) {
    cookies.set('session', createSessionToken(), {
        path: '/',
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
    });
    return redirect('/admin')
}   

return redirect('/login');
};