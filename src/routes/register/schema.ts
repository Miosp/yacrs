import { z } from "zod";

export const schema = z.object({
    email: z.string().email(),
    displayName: z.string().min(1),
    password: z.string().min(2),
})