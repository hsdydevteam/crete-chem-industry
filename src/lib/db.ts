import "server-only";
import { MongoClient, ServerApiVersion, type Db } from "mongodb";
import { seed } from "./seed";
import { getMemoryDb } from "./memory-db";

declare global {
  var creteDatabase: Promise<Db> | undefined;
}

export function database(): Promise<Db> {
  if (!global.creteDatabase) {
    global.creteDatabase = connect().catch((err) => {
      console.warn(
        "[AI Studio] MongoDB connection failed or unconfigured, using in-memory database:",
        err instanceof Error ? err.message : String(err),
      );
      return getMemoryDb();
    });
  }
  return global.creteDatabase;
}

async function connect(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri === "[REDACTED]") {
    throw new Error("MONGODB_URI is not configured");
  }
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 2500,
    ...(process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD
      ? {
          auth: {
            username: process.env.MONGODB_USERNAME,
            password: process.env.MONGODB_PASSWORD,
          },
        }
      : {}),
  });
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    const db = client.db(
      process.env.MONGODB_DATABASE ||
        new URL(uri).pathname.slice(1) ||
        "cretechem",
    );
    await Promise.all([
      ...["products", "services", "banners", "cases", "inquiries", "media"].map(
        (c) => db.collection(c).createIndex({ id: 1 }, { unique: true }),
      ),
      db.collection("orders").createIndex({ request_id: 1 }, { unique: true }),
      db.collection("orders").createIndex({ created_at: -1 }),
      db
        .collection("inquiries")
        .createIndex({ requestId: 1 }, { unique: true, sparse: true }),
      db
        .collection("sessions")
        .createIndex({ token_hash: 1 }, { unique: true }),
      db
        .collection("sessions")
        .createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 }),
      db
        .collection("limits")
        .createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 }),
    ]);
    if (
      !(await db.collection("settings").findOne({ key: "next-cms-seeded-v1" }))
    ) {
      for (const [name, items] of Object.entries(seed))
        for (const item of items)
          await db
            .collection(name)
            .updateOne(
              { id: item.id },
              {
                $setOnInsert: { ...item, updatedAt: new Date().toISOString() },
              },
              { upsert: true },
            );
      await db
        .collection("settings")
        .updateOne(
          { key: "next-cms-seeded-v1" },
          { $set: { complete: true } },
          { upsert: true },
        );
    }
    if (process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD_SALT)
      await db
        .collection<{
          _id: string;
          passwordHash: string;
          passwordSalt: string;
        }>("admins")
        .updateOne(
          { _id: "admin" },
          {
            $setOnInsert: {
              passwordHash: process.env.ADMIN_PASSWORD_HASH,
              passwordSalt: process.env.ADMIN_PASSWORD_SALT,
            },
          },
          { upsert: true },
        );
    return db;
  } catch (e) {
    await client.close().catch(() => {});
    throw e;
  }
}
