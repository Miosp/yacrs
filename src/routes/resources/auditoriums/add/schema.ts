import { z } from "zod";

export const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    rows: z.number().min(1, { message: "Rows must be greater than 0" }),
    columns: z.number().min(1, { message: "Columns must be greater than 0" })
});