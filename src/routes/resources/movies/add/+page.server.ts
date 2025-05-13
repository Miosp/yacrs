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
                title: form.data.title,
                description: form.data.description,
                releaseYear: form.data.release_year,
                duration: form.data.runtime,
                posterPath: form.data.poster_path,
                backdropPath: form.data.backdrop_path,
                TMDBId: form.data.tmdb_id,
            }
        })

        return message(200, "Movie added successfully")
    }
};