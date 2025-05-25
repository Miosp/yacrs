import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageLoad } from "./$types";
import { schema } from './schema';

export const load: PageLoad = async ({ parent }) => {
    await parent();
    const form = await superValidate(zod(schema));

    return {
        form
    }
}