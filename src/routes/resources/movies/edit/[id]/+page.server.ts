import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { editMovieSchema } from "./schema";
import { client } from "$lib/services/db";
import { redirect } from "@sveltejs/kit";
import { verifyAdminRights } from "$lib/auth/verifier";

export const load: PageServerLoad = async ({ parent, params }) => {
    const parentData = await parent();
    verifyAdminRights(parentData.session);

    const parsedId = parseInt(params.id);

    const movieData = await client.movie.findUniqueOrThrow({
        where: {
            id: parsedId
        }
    })

    return {
        movieData
    }
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const form = await superValidate(request, zod(editMovieSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const id = Number(params.id);

        await client.movie.update({
            where: {
                id: id
            },
            data: {
                title: form.data.title,
                description: form.data.description,
                releaseYear: form.data.release_year,
                duration: form.data.runtime,
                posterPath: form.data.poster_path,
                backdropPath: form.data.backdrop_path,
                TMDBId: form.data.tmdb_id,
            }
        });

        return redirect(303, '/resources/movies');
    }
};
