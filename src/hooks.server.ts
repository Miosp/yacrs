import { auth } from '$lib/services/auth'
import type { Handle } from '@sveltejs/kit'
import { svelteKitHandler } from 'better-auth/svelte-kit'

export const handle: Handle = async ({ event, resolve }) => svelteKitHandler({ event, resolve, auth })