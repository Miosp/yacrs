import { z } from 'zod';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad } from './$types';
import { registerUser } from '$lib/services/user/register';
import { signIn } from '@auth/sveltekit/client';
import { AuthError } from '@auth/sveltekit';

const registerSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
})

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(registerSchema));
    return { form };
}

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event.request, zod(registerSchema));

        if (!form.valid) {
            return fail(400, { form })
        }

        try {
            await registerUser(form.data.username, form.data.password)
        } catch (error: any) {
            if (error.message === 'User already exists') {
                return fail(400, { form, message: 'Username already taken' });
            }
            return fail(500, { form, message: 'Registration failed. Please try again.' });
        }
        try {
            await signIn('credentials', {
                username: form.data.username,
                password: form.data.password,
                redirectTo: '/',
            });
            return message(form, 'Registration and login successful!');
        } catch (error) {
            if (error instanceof AuthError) {
                console.error('AuthError during sign in after registration:', error);
                return fail(500, { form, message: 'Login failed after registration.' });
            }
            console.error('Error during sign in after registration:', error);
            return fail(500, { form, message: 'An unexpected error occurred during login.' });
        }
    }
}