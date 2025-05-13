import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { TMDB } from "$lib/services/tmdb";
import type { Actions } from "./$types";
import { movieSchema } from "./schema";
import { client } from "$lib/services/db";

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(movieSchema))

        if (!form.valid) {
            return fail(400, { form })
        }

        await client.movie.create({
            data: {

            }
        })
    }
};