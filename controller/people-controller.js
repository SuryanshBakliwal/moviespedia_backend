import tmdbClient from "../utils/tmdbClient.js";

/* ---------------- PERSON DETAIL ---------------- */
export const getPeopleDetail = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/person/${req.params.id}`,
            { params: { language: "en-US" } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getPeopleDetail error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch person detail" });
    }
};

/* ---------------- TV CREDITS ---------------- */
export const getPeopleTvCredits = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/person/${req.params.id}/tv_credits`,
            { params: { language: "en-US" } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getPeopleTvCredits error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch tv credits" });
    }
};

/* ---------------- MOVIE CREDITS ---------------- */
export const getPeopleMovieCredits = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/person/${req.params.id}/movie_credits`,
            { params: { language: "en-US" } }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getPeopleMovieCredits error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch movie credits" });
    }
};

/* ---------------- PERSON IMAGES ---------------- */
export const getPeopleImages = async (req, res) => {
    try {
        const response = await tmdbClient.get(
            `/3/person/${req.params.id}/images`
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("getPeopleImages error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch person images" });
    }
};
