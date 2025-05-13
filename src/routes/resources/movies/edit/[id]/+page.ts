import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { editMovieSchema } from "./schema";

export const load: PageLoad = async ({ parent, data }) => {
    await parent;

    const movie = data.movieData;

    const form = await superValidate({
        id: movie.id,
        title: movie.title,
        description: movie.description ?? undefined,
        release_year: movie.releaseYear ?? undefined,
        runtime: movie.duration ?? undefined,
        poster_path: movie.posterPath ?? undefined,
        backdrop_path: movie.backdropPath ?? undefined,
        tmdb_id: movie.TMDBId ?? undefined
    }, zod(editMovieSchema));

    return {
        form,
        movie
    }
};
