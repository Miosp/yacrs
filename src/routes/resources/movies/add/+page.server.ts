import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions } from "./$types";
import { movieSchema } from "./schema";
import { client } from "$lib/services/db";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(movieSchema))

        console.log('form', form)

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

        return redirect(303, '/resources/movies')
    }
};
