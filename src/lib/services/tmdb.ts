import { MovieDb } from "moviedb-promise"

const API_KEY = import.meta.env.YACRS_TMDB_API_KEY

export const TMDB = new MovieDb(API_KEY)
