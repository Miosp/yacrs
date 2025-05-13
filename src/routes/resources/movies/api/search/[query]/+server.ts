import { TMDB } from "$lib/services/tmdb";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { MovieResultsResponse } from "moviedb-promise";

export const GET: RequestHandler = async ({ params }) => {
    const query = params.query;

    const movieResults = query !== "" ? await TMDB.searchMovie({ query }) : (new Array as MovieResultsResponse);
    return json(movieResults)
};
