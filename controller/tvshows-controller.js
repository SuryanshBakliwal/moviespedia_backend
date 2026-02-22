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

