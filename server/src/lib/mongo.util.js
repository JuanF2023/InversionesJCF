// server/src/lib/mongo.util.js
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME   = process.env.MONGO_DB  || "InversionesJCF";

let _client = null;
let _db = null;

export async function getDb() {
  if (_db) return _db;
  _client = new MongoClient(MONGO_URI, { maxPoolSize: 10 });
  await _client.connect();
  _db = _client.db(DB_NAME);
  return _db;
}
