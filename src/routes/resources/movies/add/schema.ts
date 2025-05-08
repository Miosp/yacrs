import { z } from "zod";

export const movieSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    release_year: z.number().min(1, { message: "Release year must be a positive number" }).optional(),
    runtime: z.number().optional(),
    poster_path: z.string().optional(),
    backdrop_path: z.string().optional(),
    tmdb_id: z.number().optional(),
})
