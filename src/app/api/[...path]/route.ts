import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { database } from "@/lib/db";
import { digest, login, rateLimit, validSession } from "@/lib/auth";
import { getCatalog, orderView } from "@/lib/repository";
import {
  bannerSchema,
  caseSchema,
  inquirySchema,
  orderSchema,
  productSchema,
  serviceSchema,
} from "@/lib/validation";
import { contact } from "@/lib/seed";
import { statuses } from "@/lib/types";
import sharp from "sharp";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
async function body(req: NextRequest) {
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("Send JSON data.");
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Missing request body.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 64000) {
      await reader.cancel();
      throw new Error("Request is too large.");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}
const wa = (message: string) =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
function orderReply(row: Record<string, unknown>) {
  const o = orderView(row);
  return {
    order: { id: o.id, status: o.status },
    whatsappUrl: wa(
      `CRETE-CHEM quotation request\nReference: ${o.id}\n\n${o.items.map((i) => `${i.quantity} × ${i.name}`).join("\n")}\n\nName: ${o.customer.name}\nPhone: ${o.customer.phone}\nProject location: ${o.customer.address}\nNotes: ${o.customer.notes || "None"}\n\nPlease confirm specifications, pack sizes, availability and quotation.`,
    ),
  };
}
async function handler(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname.replace("/api/", "").split("/"),
      method = req.method;
    if (method !== "GET" && req.headers.get("origin") !== req.nextUrl.origin)
      return json({ error: "Invalid request origin." }, 403);
    const ip =
      req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "local";
    if (path[0] === "catalog" && method === "GET")
      return json(await getCatalog());
    const db = await database();
    if (path[0] === "media" && method === "GET") {
      const image = await db.collection("media").findOne({ id: path[1] });
      if (!image) return json({ error: "Image not found" }, 404);
      return new NextResponse(new Uint8Array(image.data.buffer), {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    if (path.join("/") === "admin/login" && method === "POST") {
      if (await rateLimit(ip, "login", 8, 900))
        return json(
          { error: "Too many attempts. Try again in 15 minutes." },
          429,
        );
      const data = z
        .object({ password: z.string().max(200) })
        .parse(await body(req));
      const token = await login(data.password);
      if (!token) return json({ error: "Incorrect password." }, 401);
      const response = json({ ok: true });
      response.cookies.set("cc_admin", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: req.nextUrl.protocol === "https:",
        path: "/",
        maxAge: 28800,
      });
      response.headers.append(
        "Set-Cookie",
        "cc_admin=; Path=/api; Max-Age=0; HttpOnly; SameSite=Strict",
      );
      return response;
    }
    if (path[0] === "admin") {
      const token = req.cookies.get("cc_admin")?.value;
      if (!(await validSession(token)))
        return json({ error: "Please sign in." }, 401);
      if (path[1] === "session" && method === "GET") return json({ ok: true });
      if (path[1] === "logout" && method === "POST") {
        await db
          .collection("sessions")
          .deleteOne({ token_hash: digest(token!) });
        const r = json({ ok: true });
        r.cookies.set("cc_admin", "", { path: "/", maxAge: 0, httpOnly: true });
        r.headers.append(
          "Set-Cookie",
          "cc_admin=; Path=/api; Max-Age=0; HttpOnly; SameSite=Strict",
        );
        return r;
      }
      if (path[1] === "catalog" && method === "GET")
        return json(await getCatalog(false));
      if (path[1] === "activity" && method === "GET")
        return json({
          activity: await db
            .collection("activity")
            .find({}, { projection: { _id: 0 } })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray(),
        });
      if (path[1] === "upload" && method === "POST") {
        if (Number(req.headers.get("content-length") || 0) > 2500000)
          return json({ error: "Choose an image under 2 MB." }, 400);
        const form = await req.formData();
        const file = form.get("file");
        if (
          !(file instanceof File) ||
          file.size > 2000000 ||
          !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
            file.type,
          )
        )
          return json(
            { error: "Upload a JPG, PNG, WebP or AVIF under 2 MB." },
            400,
          );
        let buffer: Buffer;
        try {
          buffer = await sharp(Buffer.from(await file.arrayBuffer()), {
            limitInputPixels: 24000000,
          })
            .rotate()
            .resize({ width: 1800, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();
        } catch {
          return json(
            {
              error:
                "This image cannot be processed. Choose a valid raster image.",
            },
            400,
          );
        }
        const id = crypto.randomUUID();
        await db
          .collection("media")
          .insertOne({
            id,
            data: buffer,
            mime: "image/webp",
            name: file.name,
            createdAt: Date.now(),
          });
        return json({ url: `/api/media/${id}` }, 201);
      }
      if (path[1] === "orders" && method === "GET") {
        const offset = Math.max(
          0,
          Number(req.nextUrl.searchParams.get("offset")) || 0,
        );
        const [rows, total, newOrders, completed] = await Promise.all([
          db
            .collection("orders")
            .find({})
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(50)
            .toArray(),
          db.collection("orders").countDocuments(),
          db.collection("orders").countDocuments({ status: "New" }),
          db.collection("orders").countDocuments({ status: "Completed" }),
        ]);
        return json({
          orders: rows.map(orderView),
          stats: { total, newOrders, completed },
          nextOffset:
            offset + rows.length < total ? offset + rows.length : null,
        });
      }
      if (path[1] === "inquiries" && method === "GET") {
        const offset = Math.max(
          0,
          Number(req.nextUrl.searchParams.get("offset")) || 0,
        );
        const rows = await db
          .collection("inquiries")
          .find({}, { projection: { _id: 0, requestId: 0 } })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(50)
          .toArray();
        return json({
          inquiries: rows,
          nextOffset: rows.length === 50 ? offset + 50 : null,
        });
      }
      if (
        ["orders", "inquiries"].includes(path[1]) &&
        path[2] &&
        method === "PATCH"
      ) {
        const data = z
          .object({ status: z.enum(statuses) })
          .parse(await body(req));
        const row = await db
          .collection(path[1])
          .findOneAndUpdate(
            { id: path[2] },
            { $set: { status: data.status } },
            { returnDocument: "after" },
          );
        return row
          ? json({ ok: true })
          : json({ error: "Request not found." }, 404);
      }
      const schemas = {
        products: productSchema,
        services: serviceSchema,
        banners: bannerSchema,
        cases: caseSchema,
      };
      const name = path[1] as keyof typeof schemas;
      if (name in schemas && ["POST", "PUT", "DELETE"].includes(method)) {
        const col = db.collection(name);
        if (method === "DELETE") {
          if (!path[2]) return json({ error: "Select an item." }, 400);
          await col.deleteOne({ id: path[2] });
          if (name === "products")
            await db
              .collection("services")
              .updateMany({ recommendedProductIds: path[2] }, {
                $pull: { recommendedProductIds: path[2] },
              } as never);
          await db
            .collection("activity")
            .insertOne({
              title: `Deleted ${name}: ${path[2]}`,
              createdAt: Date.now(),
            });
          return json({ ok: true });
        }
        const data = schemas[name].parse(await body(req));
        if (method === "PUT" && path[2] !== data.id)
          return json({ error: "An existing ID cannot be changed." }, 400);
        if (name === "products") {
          const p = productSchema.parse(data);
          if (
            (await db
              .collection("services")
              .countDocuments({ id: { $in: p.serviceIds } })) !==
            p.serviceIds.length
          )
            return json({ error: "Select valid services." }, 400);
          const overflow = await db
            .collection("services")
            .findOne({
              id: { $in: p.serviceIds },
              recommendedProductIds: { $ne: p.id },
              "recommendedProductIds.2": { $exists: true },
            });
          if (overflow)
            return json(
              {
                error: `${overflow.title} already recommends 3 products. Edit its mappings first.`,
              },
              400,
            );
        }
        if (name === "services") {
          const s = serviceSchema.parse(data);
          if (
            (await db
              .collection("products")
              .countDocuments({ id: { $in: s.recommendedProductIds } })) !==
            s.recommendedProductIds.length
          )
            return json({ error: "Select valid products." }, 400);
        }
        const record = { ...data, updatedAt: new Date().toISOString() };
        if (method === "POST") {
          if (await col.findOne({ id: data.id }))
            return json(
              { error: "This ID already exists. Choose a different ID." },
              409,
            );
          await col.insertOne(record);
        } else {
          const r = await col.replaceOne({ id: data.id }, record);
          if (!r.matchedCount) return json({ error: "Item not found." }, 404);
        }
        if (name === "products") {
          const p = productSchema.parse(data);
          await db
            .collection("services")
            .updateMany({ recommendedProductIds: p.id }, {
              $pull: { recommendedProductIds: p.id },
            } as never);
          await db
            .collection("services")
            .updateMany(
              { id: { $in: p.serviceIds } },
              { $addToSet: { recommendedProductIds: p.id } },
            );
        }
        await db
          .collection("activity")
          .insertOne({
            title: `${method === "POST" ? "Created" : "Updated"} ${name}: ${"name" in data ? data.name : data.title}`,
            createdAt: Date.now(),
          });
        return json({ ok: true }, method === "POST" ? 201 : 200);
      }
      return json({ error: "Not found." }, 404);
    }
    if (path[0] === "orders" && method === "POST") {
      const data = orderSchema.parse(await body(req));
      if (new Set(data.items.map((i) => i.id)).size !== data.items.length)
        return json({ error: "Remove duplicate cart items." }, 400);
      const existing = await db
        .collection("orders")
        .findOne({ request_id: data.requestId });
      if (existing) {
        const old = orderView(existing);
        if (
          JSON.stringify(old.customer) !== JSON.stringify(data.customer) ||
          JSON.stringify(
            old.items.map(({ id, quantity }) => ({ id, quantity })),
          ) !== JSON.stringify(data.items)
        )
          return json(
            { error: "This request was already used. Start a new request." },
            409,
          );
        return json(orderReply(existing));
      }
      if (await rateLimit(ip, "orders", 20, 3600))
        return json({ error: "Too many requests. Try again later." }, 429);
      const catalog = await getCatalog();
      const items = data.items.map((i) => {
        const p = catalog.products.find((p) => p.id === i.id);
        if (!p)
          throw new Error(
            "A cart product is no longer available. Remove it and try again.",
          );
        return { ...i, name: p.name };
      });
      const row = {
        id: `CC-${crypto.randomUUID()}`,
        request_id: data.requestId,
        created_at: Date.now(),
        status: "New",
        customer: JSON.stringify(data.customer),
        items: JSON.stringify(items),
      };
      await db
        .collection("orders")
        .updateOne(
          { request_id: data.requestId },
          { $setOnInsert: row },
          { upsert: true },
        );
      const stored = (await db
        .collection("orders")
        .findOne({ request_id: data.requestId }))!;
      if (stored.customer !== row.customer || stored.items !== row.items)
        return json(
          { error: "This request was already used. Start a new request." },
          409,
        );
      return json(orderReply(stored), 201);
    }
    if (path[0] === "inquiries" && method === "POST") {
      const data = inquirySchema.parse(await body(req));
      const existing = await db
        .collection("inquiries")
        .findOne({ requestId: data.requestId });
      if (existing) {
        if (
          Object.keys(data).some(
            (key) => existing[key] !== data[key as keyof typeof data],
          )
        )
          return json({ error: "This request has already been used." }, 409);
        return json({ id: existing.id, whatsappUrl: existing.whatsappUrl });
      }
      if (await rateLimit(ip, "inquiries", 12, 3600))
        return json({ error: "Too many requests. Try again later." }, 429);
      const service = data.serviceId
        ? await db
            .collection("services")
            .findOne({ id: data.serviceId, active: true })
        : null;
      if (data.serviceId && !service)
        return json({ error: "Choose an available service." }, 400);
      const id = `INQ-${crypto.randomUUID()}`;
      const whatsappUrl = wa(
        `CRETE-CHEM inspection request\nReference: ${id}\nName: ${data.name}\nPhone: ${data.phone}\nLocation: ${data.location}\nService: ${service?.title || "Technical assessment"}\nProject: ${data.projectType}\n${data.description}`,
      );
      await db
        .collection("inquiries")
        .updateOne(
          { requestId: data.requestId },
          {
            $setOnInsert: {
              ...data,
              id,
              whatsappUrl,
              status: "New",
              createdAt: Date.now(),
            },
          },
          { upsert: true },
        );
      const stored = (await db
        .collection("inquiries")
        .findOne({ requestId: data.requestId }))!;
      if (
        Object.keys(data).some(
          (key) => stored[key] !== data[key as keyof typeof data],
        )
      )
        return json({ error: "This request was already used." }, 409);
      return json({ id: stored.id, whatsappUrl: stored.whatsappUrl }, 201);
    }
    return json({ error: "Not found." }, 404);
  } catch (error) {
    if (error instanceof z.ZodError)
      return json(
        {
          error: error.issues
            .map((i) => `${i.path.join(".") || "Details"}: ${i.message}`)
            .join("; "),
        },
        400,
      );
    if (error instanceof SyntaxError)
      return json({ error: "Invalid JSON data." }, 400);
    if (
      error instanceof Error &&
      /Send JSON|Missing request|Request is too|cart product/.test(
        error.message,
      )
    )
      return json({ error: error.message }, 400);
    console.error(
      "API request failed",
      error instanceof Error ? error.name : "Error",
    );
    return json(
      { error: "Storage is temporarily unavailable. Please try again." },
      503,
    );
  }
}
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
