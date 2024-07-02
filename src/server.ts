import express from "express";
import cors from "cors";
import { conn } from "./db/mongoConection";
import { routes } from "./routes/routes";
import { rateLimiter } from "./middlewares/global/RateLimit";
import helmet from "helmet";
import redisClient from "./db/redisConnection";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(routes);

async function server(): Promise<void> {
  try {
    await conn();
    await redisClient.connect();
    console.log("Conectado ao redis =D");

    app.listen(3000, () => {
      console.log("Server runing at 3000");
    });
  } catch (error) {
    console.log(error);
  }
}

server();
