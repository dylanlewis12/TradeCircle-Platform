import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionStr = process.env.MONGO_URI || "";

const client = new MongoClient(connectionStr);

let conn;

try {
  conn = await client.connect();

  console.log(`MongoDB Connected...`);
} catch (error) {
  console.error(error);
  process.exit(1);
}

let db = conn.db("trade_circle");

export default db;