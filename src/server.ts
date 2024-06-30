import express from "express";
import cors from "cors";
import { conn } from "../src/db/conn";
import { routes } from "./routes/routes";
import { rateLimiter } from "./middlewares/RateLimit";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(routes);

async function server(): Promise<void> {
  try {
    await conn();
    app.get("/", (req, res) => {
      res.send("A rota ta funfando");
    });

    app.listen(3000, () => {
      console.log("Server runing at 3000");
    });

    
  } catch (error) {
    console.log(error);
  }
}

server();
