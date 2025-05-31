import { z } from "zod";

export const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    seats: z.array(z.object({
        row: z.number().int().min(0),
        seatNumber: z.number().int().min(0)
    })),
    seatPrice: z.number().min(0).step(0.01),
    rows: z.number().int().min(1),
    seatsPerRow: z.number().int().min(1)
});
