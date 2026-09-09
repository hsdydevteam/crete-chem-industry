import "server-only";
import {
  createHash,
  pbkdf2Sync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { database } from "./db";
import { cookies } from "next/headers";
export const digest = (text: string) =>
  createHash("sha256").update(text).digest("hex");
export async function validSession(token?: string) {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  return !!(await (await database())
    .collection("sessions")
    .findOne({ token_hash: digest(token), expires_at: { $gt: new Date() } }));
}
export async function currentAdmin() {
  return validSession((await cookies()).get("cc_admin")?.value);
}
export async function login(password: string) {
  const db = await database();
  const admin = await db
    .collection<{
      _id: string;
      passwordHash: string;
      passwordSalt: string;
    }>("admins")
    .findOne({ _id: "admin" });
  if (!admin) throw new Error("Admin access has not been configured.");
  const derived = pbkdf2Sync(
    password,
    admin.passwordSalt,
    100000,
    32,
    "sha256",
  );
  const expected = Buffer.from(admin.passwordHash, "hex");
  if (derived.length !== expected.length || !timingSafeEqual(derived, expected))
    return null;
  const token = randomBytes(32).toString("hex");
  await db
    .collection("sessions")
    .insertOne({
      token_hash: digest(token),
      expires_at: new Date(Date.now() + 28800000),
    });
  return token;
}
export async function rateLimit(
  ip: string,
  kind: string,
  max: number,
  seconds: number,
) {
  const col = (await database()).collection<{
    _id: string;
    count: number;
    expires_at: Date;
  }>("limits");
  const now = new Date();
  const expired = { $lt: [{ $ifNull: ["$expires_at", new Date(0)] }, now] };
  const r = await col.findOneAndUpdate(
    { _id: `next:${kind}:${digest(ip)}` },
    [
      {
        $set: {
          count: { $cond: [expired, 1, { $add: ["$count", 1] }] },
          expires_at: {
            $cond: [
              expired,
              new Date(Date.now() + seconds * 1000),
              "$expires_at",
            ],
          },
        },
      },
    ],
    { upsert: true, returnDocument: "after" },
  );
  return (r?.count || 0) > max;
}
