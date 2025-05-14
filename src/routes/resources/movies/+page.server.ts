import { client } from "$lib/services/db";
import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { deleteMovieSchema } from "./deleteMovieSchema";
import { verifyAdminRights } from "$lib/auth/verifier";

export const load: PageServerLoad = async ({ depends, parent }) => {
    depends("app:movies");
    const parentData = await parent();
    verifyAdminRights(parentData.session);

    const movies = await client.movie.findMany();
    return { movies };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(deleteMovieSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const res = await client.movie.delete({
            where: {
                id: form.data.id
            },
            include: {
                screenings: true,
            }
        });

        return { success: true, res };
    }
};