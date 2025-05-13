import { client } from "$lib/services/db";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return json({ error: "Invalid ID" }, { status: 400 });
    }

    const movie = await client.movie.findUnique({
        where: {
            id: id
        }
    });

    if (!movie) {
        return json({ error: "Movie not found" }, { status: 404 });
    }

    return json(movie);
};
