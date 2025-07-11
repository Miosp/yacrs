import { verifyAdminRights } from "$lib/auth/verifier";
import { client } from "$lib/services/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
    const parentData = await parent();
    verifyAdminRights(parentData.session);

    const screenings = await client.screening.findMany({
        include: {
            movie: true,
            auditorium: true
        }
    });
    return { screenings };
};