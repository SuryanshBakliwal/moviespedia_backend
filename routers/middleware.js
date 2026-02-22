import JWT from "jsonwebtoken";

const jwt_key = process.env.JWTTOKEN;
export const authMiddleware = (req, res, next) => {
    try {

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = JWT.verify(token, jwt_key);
        req.user = decoded; // { userId, email }
        console.log("user in middleware", decoded);

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
