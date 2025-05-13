import { client } from "$lib/services/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const screenings = await client.screening.findMany({
        include: {
            movie: true,
            auditorium: true
        }
    });
    return { screenings };
};