import { z } from "zod";

export const deleteMovieSchema = z.object({
    id: z.number()
})