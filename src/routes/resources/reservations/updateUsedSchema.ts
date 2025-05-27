import { z } from "zod";

export const updateUsedSchema = z.object({
    id: z.number(),
    used: z.boolean()
});
