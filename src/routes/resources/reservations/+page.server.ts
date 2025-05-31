import { verifyAdminRights } from "$lib/auth/verifier";
import { client } from "$lib/services/db";
import type { Actions, PageServerLoad } from "./$types";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { updateUsedSchema } from "./updateUsedSchema";
import { getSession } from "$lib/auth/session";

export const load: PageServerLoad = async ({ parent, depends, url }) => {
    depends("app:reservations");
    const parentData = await parent();
    verifyAdminRights(parentData.session);

    const search = url.searchParams.get('search') || '';

    const reservations = await client.reservation.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            },
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

    const form = await superValidate(zod(updateUsedSchema));

    return { reservations, form, search };
};

export const actions: Actions = {
    updateUsed: async ({ request }) => {
        const user = await getSession(request.headers);

        if (!user || user.role !== 'admin') {
            return fail(403, { error: 'Unauthorized' });
        }

        const form = await superValidate(request, zod(updateUsedSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await client.reservation.update({
                where: {
                    id: form.data.id
                },
                data: {
                    used: form.data.used
                }
            });

            return { form };
        } catch (error) {
            return fail(500, { form, error: 'Failed to update reservation' });
        }
    }
};
