import { z } from "zod";

export const screeningAddSchema = z.object({
    movieId: z.number().min(1, { message: "Movie Id must be positive" }),
    auditoriumId: z.number().min(1, { message: "Auditorium Id must be positive" }),
    dateTime: z.string().datetime({ local: true })
})
