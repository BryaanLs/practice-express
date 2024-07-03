import { createClient } from "redis";
import { config } from "dotenv";
import { envPath } from "../env/environment";
config({ path: envPath });

const redisClient = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-10103.c8.us-east-1-3.ec2.redns.redis-cloud.com",
    port: 10103,
  },
});

async function redisConn(): Promise<void> {
  redisClient.connect();
  return new Promise((resolve, reject) => {
    redisClient.on("connect", () => {
      resolve();
    });

    redisClient.on("error", (err) => {
      console.log("Erro na conexão no redis");
      reject(err);
    });
  });
}
export { redisClient, redisConn };
