import { getSession } from "$lib/auth/session";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ request, depends }) => {
    depends('app:auth');

    return {
        session: await getSession(request.headers),
    }
}
