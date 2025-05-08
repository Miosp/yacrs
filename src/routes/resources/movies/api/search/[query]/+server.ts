import { TMDB } from "$lib/services/tmdb";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
    const query = params.query;

    const movieResults = query !== "" ? await TMDB.searchMovie({ query }) : [];
    return json(movieResults)
};
