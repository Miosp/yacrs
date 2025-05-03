import { auth } from "$lib/services/auth";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ request, depends }) => {
    depends('app:auth');

    const session = await auth.api.getSession({
        headers: request.headers
    });

    return {
        session: session?.user
    }
}
