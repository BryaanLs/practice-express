import { createClient } from "redis";
import { config } from "dotenv";
config({ path: "../.env" });

// Verificar a mudança do password
const redisClient = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-10103.c8.us-east-1-3.ec2.redns.redis-cloud.com",
    port: 10103,
  },
});

export default redisClient;
