import { getSession } from "$lib/auth/session";
import { client } from "$lib/services/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, request }) => {
    await parent();
    const user = await getSession(request.headers);

    if (!user) {
        throw new Error("User not authenticated");
    }

    const reservations = await client.reservation.findMany({
        where: {
            userId: user.id
        },
        include: {
            screening: {
                include: {
                    movie: true,
                    auditorium: true
                }
            },
            seats: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return {
        reservations
    };
};
