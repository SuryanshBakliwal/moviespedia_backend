import express from "express";
import Connection from "./database/db.js";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./routers/routes.js";
const app = express();

Connection();

// // for local
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// for Live
// app.use(cors({
//   origin: "https://movieespedia.netlify.app",
//   credentials: true
// }));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/", route);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is listening at the port :", PORT);
});
