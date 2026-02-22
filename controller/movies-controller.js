import tmdbClient from "../utils/tmdbClient.js";

const APIKEY = process.env.API_KEY;

/* ---------------- TRENDING ---------------- */
export const tredingMovies = async (req, res) => {
    try {
        const { duration } = req.query;

        const response = await tmdbClient.get(
            `/3/trending/all/${duration}`,
            { params: { api_key: APIKEY } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Trending error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch trending data" });
    }
};

/* ---------------- GENRE ---------------- */
export const basedOnGenre = async (req, res) => {
    try {
        const { genreId } = req.query;

        if (!genreId) {
            return res.status(400).json({ message: "genreId is required" });
        }

        const params = {
            api_key: APIKEY,
            language: "en-US",
            include_adult: false,
            include_video: false,
            page: 1,
            sort_by: "popularity.desc",
            ...(Number(genreId) === 296
                ? {
                    vote_average_gte: 7.5,
                    vote_count_gte: 100,
                    watch_region: "IN",
                    with_keywords: 210024,
                }
                : {
                    with_genres: genreId,
                    with_original_language: "en",
                    with_watch_monetization_types: "flatrate",
                }),
        };

        const response = await tmdbClient.get("/3/discover/movie", { params });
        res.status(200).json(response.data);

    } catch (error) {
        console.error("Genre error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch movies by genre" });
    }
};

/* ---------------- MONETIZATION ---------------- */
export const monetization = async (req, res) => {
    try {
        const { monetizationType } = req.query;

        if (!monetizationType) {
            return res.status(400).json({ message: "monetizationType is required" });
        }

        const response = await tmdbClient.get("/3/discover/movie", {
            params: {
                api_key: APIKEY,
                language: "en-US",
                include_adult: true,
                include_video: false,
                page: 1,
                watch_region: "IN",
                with_watch_monetization_types: monetizationType,
                sort_by: "vote_count.desc",
            },
        });

        res.status(200).json(response.data);

    } catch (error) {
        console.error("Monetization error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch monetization data" });
    }
};

/* ---------------- HOLLY / BOLLY ---------------- */
export const hollyBolly = async (req, res) => {
    try {
        const { lang } = req.query;

        if (!lang) {
            return res.status(400).json({ message: "language is required" });
        }

        const releaseYear = new Date().getFullYear() - 2;

        const response = await tmdbClient.get("/3/discover/movie", {
            params: {
                api_key: APIKEY,
                language: "en-US",
                sort_by: "vote_count.desc",
                include_adult: true,
                include_video: false,
                page: 1,
                primary_release_year: releaseYear,
                with_original_language: lang,
                watch_region: "IN",
                with_watch_monetization_types: "flatrate",
            },
        });

        res.status(200).json(response.data);

    } catch (error) {
        console.error("HollyBolly error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch movies" });
    }
};

/* ---------------- MOVIE DETAILS ---------------- */
export const getMovieDetail = async (req, res) => {
    try {
        const response = await tmdbClient.get(`/3/movie/${req.params.id}`, {
            params: { language: "en-US" },
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch movie detail" });
    }
};

export const getMovieCredits = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/movie/${req.params.id}/credits`,
            { params: { api_key: APIKEY } }
        );
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch movie credits" });
    }
};

export const getMovieBackDrop = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/movie/${req.params.id}/images`,
            { params: { api_key: APIKEY } }
        );
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch movie images" });
    }
};

export const getMovieRecommendation = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/movie/${req.params.id}/recommendations`,
            { params: { api_key: APIKEY } }
        );
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch recommendations" });
    }
};

/* ---------------- MOVIE TYPES ---------------- */
export const moviesTypes = async (req, res) => {
    try {
        const { type, page = 1 } = req.query;

        const url =
            type === "anime"
                ? "/3/discover/movie"
                : `/3/movie/${type}`;

        const params =
            type === "anime"
                ? {
                    api_key: APIKEY,
                    include_adult: false,
                    include_video: false,
                    language: "en-US",
                    page,
                    sort_by: "popularity.desc",
                    vote_average_gte: 7.5,
                    vote_count_gte: 100,
                    watch_region: "IN",
                    with_keywords: 210024,
                }
                : {
                    api_key: APIKEY,
                    language: "en-US",
                    page,
                    region: "IN",
                };

        const response = await tmdbClient.get(url, { params });
        res.status(200).json(response.data);

    } catch (error) {
        console.error("moviesTypes error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch movies by type" });
    }
};
