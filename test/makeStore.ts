import {
  CookieStore,
  MemoryStore,
  MongoStore,
  PostgresStore,
  RedisStore,
  SqliteStore,
  type Store,
  WebdisStore,
} from "../mod.ts";
import { connect as connectRedis } from "@db/redis";
import { Database as sqliteDB } from "@db/sqlite";
import { MongoClient } from "@db/mongo";
import { Client as PostgresClient } from "@db/postgres";

export function makeStore(): Promise<Store | CookieStore> {
  const storeType = Deno.env.get("STORE");
  console.info(`Creating session store of type ${storeType}`);

  switch (storeType) {
    case "cookie":
      return createCookieStore();
    case "sqlite":
      return createSQLiteStore();
    case "redis":
      return createRedisStore();
    case "webdis":
      return createWebdisStore();
    case "postgres":
      return createPostgresStore();
    case "mongo":
      return createMongoStore();
    case "memory":
      return createMemoryStore();
    default:
      throw new Error(`Unknown STORE type specified: ${storeType}`);
  }
}

function createCookieStore() {
  return Promise.resolve(new CookieStore("mandatory-encryption-passphrase"));
}

function createMemoryStore() {
  return Promise.resolve(new MemoryStore());
}

function createSQLiteStore() {
  const sqlite = new sqliteDB("./database.db");
  const store = new SqliteStore(sqlite);
  return Promise.resolve(store);
}

function createWebdisStore() {
  const store = new WebdisStore({
    url: "http://localhost:7379",
  });
  return Promise.resolve(store);
}

async function createPostgresStore() {
  const sql = new PostgresClient({
    hostname: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "postgres",
  });
  const store = new PostgresStore(sql);
  await store.initSessionsTable();
  return store;
}

async function createMongoStore() {
  const client = new MongoClient();
  const mongo = await client.connect("mongodb://localhost:27017");
  return new MongoStore(mongo);
}

async function createRedisStore() {
  const redis = await connectRedis({
    hostname: "0.0.0.0",
    port: 6379,
  });
  return new RedisStore(redis);
}
