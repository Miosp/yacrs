import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { schema } from "./schema";

export const load: PageLoad = async ({ parent, data }) => {
    await parent
    const form = await superValidate(zod(schema))

    return {
        form,
        ...data
    }
}