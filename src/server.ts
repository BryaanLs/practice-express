import express from "express";
import cors from "cors";
import { conn } from "../src/db/conn";
import { routes } from "./routes/routes";
import { rateLimiter } from "./middlewares/RateLimit";
const app = express();
app.use(express.json());
app.use(rateLimiter);
app.use(routes);
app.use(cors());

conn();

app.get("/", (req, res) => {
  res.send("A rota ta funfando");
});

app.listen(3000, () => {
  console.log("Server runing at 3000");
});
