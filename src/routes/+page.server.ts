import { client } from "$lib/services/db";
import { date } from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
    const dateStr = url.searchParams.get("date");

    const queryDate = dateStr ? new Date(dateStr) : new Date();
    const startTime = new Date(queryDate.setHours(0, 0, 0));
    const endTime = new Date(queryDate.setHours(23, 59, 59));

    const movies = await client.movie.findMany({
        where: {
            screenings: {
                some: {
                    startTime: {
                        gte: startTime,
                        lte: endTime
                    }
                }
            }
        },
        include: {
            screenings: {
                where: {
                    startTime: {
                        gte: startTime,
                        lte: endTime
                    }
                }
            }
        }
    })

    return {
        movies
    };
};