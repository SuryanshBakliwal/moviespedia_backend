import express from "express";
import Connection from "./database/db.js";
import bodyParser from "body-parser";
import cors from "cors";
import route from "./routers/routes.js";
const app = express();

Connection();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", route);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is listening at the port :", PORT);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
