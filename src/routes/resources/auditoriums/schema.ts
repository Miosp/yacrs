import { z } from "zod";

export const schema = z.object({
    id: z.number().min(1, { message: "Must be greater than 0" }),
})