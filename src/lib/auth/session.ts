import { auth } from "$lib/services/auth";

export async function getSession(headers: Headers) {
    return (await auth.api.getSession({ headers }))?.user
}