import { zod } from "sveltekit-superforms/adapters";
import type { PageLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { screeningAddSchema } from "./screeningAddSchema";

export const load: PageLoad = async ({ url, parent }) => {
    await parent();

    const movieIdStr = url.searchParams.get("movieId");
    const movieId = movieIdStr ? parseInt(movieIdStr) : undefined;

    const form = await superValidate({
        movieId: movieId,
    }, zod(screeningAddSchema), { errors: false })

    return {
        movieId,
        form,
    }
};
