import tmdbClient from "../utils/tmdbClient.js";
const APIKEY = process.env.API_KEY;

/* ---------------- TV DETAILS ---------------- */
export const getTvShowDetail = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/tv/${req.params.id}`,
            { params: { language: "en-US" } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getTvShowDetail error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch tv show detail" });
    }
};

/* ---------------- TV CREDITS ---------------- */
export const getTvShowCredits = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/tv/${req.params.id}/credits`,
            { params: { language: "en-US", api_key: APIKEY } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getTvShowCredits error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch tv show credits" });
    }
};

/* ---------------- TV CAST (AGGREGATE) ---------------- */
export const getTvCast = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/tv/${req.params.id}/aggregate_credits`,
            { params: { api_key: APIKEY } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getTvCast error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch tv cast" });
    }
};

/* ---------------- TV BACKDROPS ---------------- */
export const getTvShowBackdrops = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/tv/${req.params.id}/images`,
            { params: { api_key: APIKEY } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getTvShowBackdrops error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch tv images" });
    }
};

/* ---------------- TV RECOMMENDATIONS ---------------- */
export const getTvShowRecommendation = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/tv/${req.params.id}/recommendations`,
            { params: { api_key: APIKEY } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getTvShowRecommendation error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch tv recommendations" });
    }
};


export const getEpisodeBackdrop = async (req, res) => {
    try {
        const { id, season, episode } = req.params;

        const response = await tmdbClient.get(
            `/3/tv/${id}/season/${season}/episode/${episode}/images`
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getEpisodeBackdrop error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch episode images" });
    }
};

export const getEpisodeDetail = async (req, res) => {
    try {
        const { id, season, episode } = req.params;

        const response = await tmdbClient.get(
            `/3/tv/${id}/season/${season}/episode/${episode}`,
            { params: { language: "en-US" } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getEpisodeDetail error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch episode detail" });
    }
};

export const getSeasonDetail = async (req, res) => {
    try {
        const { id, season } = req.params;

        const response = await tmdbClient.get(
            `/3/tv/${id}/season/${season}`,
            { params: { language: "en-US" } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getSeasonDetail error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch season detail" });
    }
};


export const getShowsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const { page = 1 } = req.query;

        let endpoint;
        let params = { page };

        if (type === "popular") {
            endpoint = `/3/discover/tv`;
            params.sort_by = "popularity.desc";
            params.watch_region = "IN";
        }
        else if (type === "top_rated") {
            endpoint = `/3/discover/tv`;
            params = {
                ...params,
                include_adult: false,
                include_null_first_air_dates: false,
                language: "en-US",
                sort_by: "popularity.desc",
                vote_average_gte: 8.5,
                vote_count_gte: 100,
                watch_region: "IN"
            };
        }
        else {
            endpoint = `/3/tv/${type}`;
            params.language = "en-US";
        }

        const response = await tmdbClient.get(endpoint, { params });

        res.status(200).json(response.data);

    } catch (error) {
        console.error("getShowsByType error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch shows by type" });
    }
};
