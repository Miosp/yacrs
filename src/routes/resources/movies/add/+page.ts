import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { movieSchema, TMDBSearchSchema } from "./schema";

export const load: PageLoad = async ({ parent }) => {
    await parent
    const movieForm = await superValidate(zod(movieSchema))
    const searchForm = await superValidate(zod(TMDBSearchSchema))

    return {
        movieForm,
        searchForm
    }
};
