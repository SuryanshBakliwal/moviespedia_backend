import axios from "axios";
import axiosRetry from "axios-retry";

const tmdbClient = axios.create({
    baseURL: process.env.TMDB_URL,
    timeout: 8000, // 👈 very important
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.IMDB_AUTH}`,
    },
});

// Retry for network errors
axiosRetry(tmdbClient, {
    retries: 2,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) =>
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT" ||
        error.response?.status >= 500,
});

export default tmdbClient;