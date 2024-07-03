import express from "express";
import cors from "cors";
import { conn } from "./db/mongoConection";
import { routes } from "./routes/routes";
import { rateLimiter } from "./middlewares/global/RateLimit";
import helmet from "helmet";
import { redisConn } from "./db/redisConnection";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(routes);

async function server(): Promise<void> {
  try {
    await conn();
    console.log("Conectado no MongoDB");
    await redisConn();
    console.log("Conectado ao Redis");
    app.listen(3000, () => {
      console.log("Server runing at 3000");
    });
    // console.table({ mongoDB: true, RedisCaching: true, serverOn: true });
  } catch (error) {
    console.log(error);
  }
}

server();
