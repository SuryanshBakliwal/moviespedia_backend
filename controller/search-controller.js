import tmdbClient from "../utils/tmdbClient.js";
const APIKEY = process.env.API_KEY;

/* ---------------- SEARCH ---------------- */
export const searchMulti = async (req, res) => {
    try {
        const { query, type = "multi", page = 1 } = req.query;
        // type can be: movie | tv | person | multi

        const response = await tmdbClient.get(
            `/3/search/${type}`,
            {
                params: {
                    query,
                    include_adult: false,
                    language: "en-US",
                    page,
                    api_key: APIKEY,
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("searchMulti error:", error.code, error.message);
        res.status(500).json({ message: "Failed to fetch search results" });
    }
};
