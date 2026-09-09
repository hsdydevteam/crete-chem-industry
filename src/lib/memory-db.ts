import "server-only";
import { pbkdf2Sync } from "node:crypto";
import { seed } from "./seed";
import type { Db } from "mongodb";

type Doc = Record<string, unknown>;
type Query = Record<string, unknown>;
type UpdateDoc = Record<string, unknown> | unknown[];

function matchesDoc(doc: Doc, query: Query): boolean {
  if (!query || Object.keys(query).length === 0) return true;

  for (const [key, condition] of Object.entries(query)) {
    if (
      key === "id" &&
      typeof condition === "object" &&
      condition !== null &&
      "$in" in condition
    ) {
      const inList = (condition as { $in: unknown[] }).$in;
      if (!Array.isArray(inList) || !inList.includes(doc.id)) return false;
      continue;
    }

    if (key === "recommendedProductIds" && typeof condition === "string") {
      const arr = Array.isArray(doc.recommendedProductIds)
        ? (doc.recommendedProductIds as unknown[])
        : [];
      if (!arr.includes(condition)) return false;
      continue;
    }

    if (
      key === "recommendedProductIds" &&
      typeof condition === "object" &&
      condition !== null &&
      "$ne" in condition
    ) {
      const arr = Array.isArray(doc.recommendedProductIds)
        ? (doc.recommendedProductIds as unknown[])
        : [];
      if (arr.includes((condition as { $ne: unknown }).$ne)) return false;
      continue;
    }

    if (
      key === "recommendedProductIds.2" &&
      typeof condition === "object" &&
      condition !== null &&
      "$exists" in condition
    ) {
      const arr = Array.isArray(doc.recommendedProductIds)
        ? (doc.recommendedProductIds as unknown[])
        : [];
      const exists = arr.length >= 3;
      if (Boolean((condition as { $exists: boolean }).$exists) !== exists)
        return false;
      continue;
    }

    if (
      key === "expires_at" &&
      typeof condition === "object" &&
      condition !== null &&
      "$gt" in condition
    ) {
      const docDate = new Date(doc.expires_at as string | number | Date).getTime();
      const targetDate = new Date(
        (condition as { $gt: string | number | Date }).$gt,
      ).getTime();
      if (!(docDate > targetDate)) return false;
      continue;
    }

    if (typeof condition === "object" && condition !== null) {
      if ("$in" in condition) {
        const inArr = (condition as { $in: unknown[] }).$in;
        if (!Array.isArray(inArr) || !inArr.includes(doc[key])) return false;
        continue;
      }
      if ("$ne" in condition) {
        if (doc[key] === (condition as { $ne: unknown }).$ne) return false;
        continue;
      }
    }

    if (doc[key] !== condition) {
      return false;
    }
  }

  return true;
}

function applyUpdate(doc: Doc, update: UpdateDoc, isInsert = false): void {
  if (Array.isArray(update)) {
    // Aggregation pipeline update for rate limiter
    const now = Date.now();
    const expired =
      !doc.expires_at ||
      new Date(doc.expires_at as string | number | Date).getTime() < now;
    if (expired) {
      doc.count = 1;
      doc.expires_at = new Date(now + 900000);
    } else {
      doc.count = ((doc.count as number) || 0) + 1;
    }
    return;
  }

  const up = update as Record<string, unknown>;

  if (up.$setOnInsert && isInsert && typeof up.$setOnInsert === "object") {
    Object.assign(doc, structuredClone(up.$setOnInsert));
  }

  if (up.$set && typeof up.$set === "object") {
    Object.assign(doc, structuredClone(up.$set));
  }

  if (up.$pull && typeof up.$pull === "object") {
    for (const [k, v] of Object.entries(up.$pull as Record<string, unknown>)) {
      if (Array.isArray(doc[k])) {
        doc[k] = (doc[k] as unknown[]).filter((item) => item !== v);
      }
    }
  }

  if (up.$addToSet && typeof up.$addToSet === "object") {
    for (const [k, v] of Object.entries(
      up.$addToSet as Record<string, unknown>,
    )) {
      if (!Array.isArray(doc[k])) doc[k] = [];
      const arr = doc[k] as unknown[];
      if (!arr.includes(v)) {
        arr.push(v);
      }
    }
  }
}

export class MemoryCollection {
  name: string;
  docs: Doc[];

  constructor(name: string, initialDocs: Doc[] = []) {
    this.name = name;
    this.docs = initialDocs.map((d) => structuredClone(d));
  }

  async createIndex(): Promise<string> {
    return "ok";
  }

  async findOne<T = Doc>(query: Query = {}): Promise<T | null> {
    const found = this.docs.find((d) => matchesDoc(d, query));
    return found ? (structuredClone(found) as T) : null;
  }

  find<T = Doc>(query: Query = {}, _options: Query = {}) {
    const matched = this.docs.filter((d) => matchesDoc(d, query));

    const cursor = {
      _results: [...matched],
      sort(sortObj: Record<string, number>) {
        cursor._results.sort((a, b) => {
          for (const [key, dir] of Object.entries(sortObj)) {
            const valA = (a[key] as string | number) ?? "";
            const valB = (b[key] as string | number) ?? "";
            if (valA < valB) return dir === 1 ? -1 : 1;
            if (valA > valB) return dir === 1 ? 1 : -1;
          }
          return 0;
        });
        return cursor;
      },
      skip(n: number) {
        cursor._results = cursor._results.slice(n);
        return cursor;
      },
      limit(n: number) {
        cursor._results = cursor._results.slice(0, n);
        return cursor;
      },
      async toArray(): Promise<T[]> {
        return cursor._results.map((d) => structuredClone(d) as T);
      },
    };

    return cursor;
  }

  async countDocuments(query: Query = {}): Promise<number> {
    return this.docs.filter((d) => matchesDoc(d, query)).length;
  }

  async insertOne(
    doc: Doc,
  ): Promise<{ insertedId: unknown; acknowledged: boolean }> {
    const copy = structuredClone(doc);
    if (!copy._id && !copy.id) {
      copy._id = crypto.randomUUID();
    }
    this.docs.push(copy);
    return { insertedId: copy._id || copy.id, acknowledged: true };
  }

  async deleteOne(
    query: Query = {},
  ): Promise<{ deletedCount: number; acknowledged: boolean }> {
    const idx = this.docs.findIndex((d) => matchesDoc(d, query));
    if (idx !== -1) {
      this.docs.splice(idx, 1);
      return { deletedCount: 1, acknowledged: true };
    }
    return { deletedCount: 0, acknowledged: true };
  }

  async deleteMany(
    query: Query = {},
  ): Promise<{ deletedCount: number; acknowledged: boolean }> {
    const initial = this.docs.length;
    this.docs = this.docs.filter((d) => !matchesDoc(d, query));
    return { deletedCount: initial - this.docs.length, acknowledged: true };
  }

  async updateOne(
    query: Query,
    update: UpdateDoc,
    options: { upsert?: boolean } = {},
  ): Promise<{
    matchedCount: number;
    modifiedCount: number;
    upsertedCount?: number;
    acknowledged: boolean;
  }> {
    const idx = this.docs.findIndex((d) => matchesDoc(d, query));
    if (idx !== -1) {
      applyUpdate(this.docs[idx], update, false);
      return { matchedCount: 1, modifiedCount: 1, acknowledged: true };
    }
    if (options.upsert) {
      const newDoc = structuredClone(query);
      applyUpdate(newDoc, update, true);
      this.docs.push(newDoc);
      return {
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        acknowledged: true,
      };
    }
    return { matchedCount: 0, modifiedCount: 0, acknowledged: true };
  }

  async updateMany(
    query: Query,
    update: UpdateDoc,
  ): Promise<{
    matchedCount: number;
    modifiedCount: number;
    acknowledged: boolean;
  }> {
    let count = 0;
    for (const doc of this.docs) {
      if (matchesDoc(doc, query)) {
        applyUpdate(doc, update, false);
        count++;
      }
    }
    return { matchedCount: count, modifiedCount: count, acknowledged: true };
  }

  async replaceOne(
    query: Query,
    replacement: Doc,
    options: { upsert?: boolean } = {},
  ): Promise<{
    matchedCount: number;
    modifiedCount: number;
    upsertedCount?: number;
    acknowledged: boolean;
  }> {
    const idx = this.docs.findIndex((d) => matchesDoc(d, query));
    if (idx !== -1) {
      this.docs[idx] = structuredClone(replacement);
      return { matchedCount: 1, modifiedCount: 1, acknowledged: true };
    }
    if (options.upsert) {
      this.docs.push(structuredClone(replacement));
      return {
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        acknowledged: true,
      };
    }
    return { matchedCount: 0, modifiedCount: 0, acknowledged: true };
  }

  async findOneAndUpdate<T = Doc>(
    query: Query,
    update: UpdateDoc,
    options: { upsert?: boolean; returnDocument?: "before" | "after" } = {},
  ): Promise<T | null> {
    const idx = this.docs.findIndex((d) => matchesDoc(d, query));
    if (idx !== -1) {
      const before = structuredClone(this.docs[idx]);
      applyUpdate(this.docs[idx], update, false);
      return (
        options.returnDocument === "after"
          ? (structuredClone(this.docs[idx]) as T)
          : (before as T)
      );
    }
    if (options.upsert) {
      const newDoc = structuredClone(query);
      applyUpdate(newDoc, update, true);
      this.docs.push(newDoc);
      return options.returnDocument === "after"
        ? (structuredClone(newDoc) as T)
        : null;
    }
    return null;
  }
}

export class MemoryDb {
  collections = new Map<string, MemoryCollection>();

  constructor() {
    // Populate seed collections
    for (const [name, items] of Object.entries(seed)) {
      this.collections.set(
        name,
        new MemoryCollection(name, items as unknown as Doc[]),
      );
    }
    // Activity, orders, sessions, limits, admins, settings
    this.collections.set("activity", new MemoryCollection("activity", []));
    this.collections.set("orders", new MemoryCollection("orders", []));
    this.collections.set("inquiries", new MemoryCollection("inquiries", []));
    this.collections.set("media", new MemoryCollection("media", []));
    this.collections.set("sessions", new MemoryCollection("sessions", []));
    this.collections.set("limits", new MemoryCollection("limits", []));
    this.collections.set(
      "settings",
      new MemoryCollection("settings", [
        { key: "next-cms-seeded-v1", complete: true },
      ]),
    );

    const salt = process.env.ADMIN_PASSWORD_SALT || "cc_default_salt_2026";
    const hash =
      process.env.ADMIN_PASSWORD_HASH ||
      pbkdf2Sync("admin", salt, 100000, 32, "sha256").toString("hex");

    this.collections.set(
      "admins",
      new MemoryCollection("admins", [
        {
          _id: "admin",
          passwordHash: hash,
          passwordSalt: salt,
        },
      ]),
    );
  }

  collection<T = Doc>(name: string): MemoryCollection {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MemoryCollection(name));
    }
    return this.collections.get(name)!;
  }

  async command(_cmd: Record<string, unknown>) {
    return { ok: 1 };
  }
}

declare global {
  var creteMemoryDbInstance: MemoryDb | undefined;
}

export function getMemoryDb(): Db {
  if (!global.creteMemoryDbInstance) {
    global.creteMemoryDbInstance = new MemoryDb();
  }
  return global.creteMemoryDbInstance as unknown as Db;
}
