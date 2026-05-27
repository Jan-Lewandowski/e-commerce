import { MongoClient } from 'mongodb';

let client = null;
let db = null;

export async function connectMongo(uri) {
  if (db) {
    return db;
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('MongoDB native client is not connected.');
  }
  return db;
}

export async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
