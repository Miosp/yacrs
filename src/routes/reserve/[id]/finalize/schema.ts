import z from "zod";

export const reservationSchema = z.object({
    screeningId: z.number().int().min(1),
    seats: z.number().int().min(1).array().nonempty()
})