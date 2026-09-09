import { z } from "zod";
const text = (max = 200) => z.string().trim().min(1).max(max);
const id = text(80).regex(/^[a-z0-9][a-z0-9-]*$/);
export const imagePath = z
  .string()
  .max(2048)
  .refine(
    (v) =>
      v === "" ||
      /^\/assets\/[\w/.-]+$/.test(v) ||
      /^\/api\/media\/[a-f0-9-]+$/.test(v) ||
      /^https:\/\//.test(v),
    "Use an HTTPS image URL or upload an image.",
  );
const images = { image: imagePath, imageUrl: imagePath };
export const productSchema = z
  .object({
    id,
    name: text(120),
    category: text(80),
    ...images,
    label: z.string().trim().max(50),
    description: text(1600),
    benefits: z.array(text(250)).max(12),
    applications: z.array(text(120)).max(12),
    serviceIds: z.array(id).max(50),
    active: z.boolean(),
    featured: z.boolean(),
  })
  .refine((p) => !!(p.image || p.imageUrl), "Add a product image.");
export const serviceSchema = z.object({
  id,
  title: text(120),
  description: text(1000),
  icon: text(40),
  tags: z.array(text(80)).max(20),
  recommendedProductIds: z.array(id).max(3),
  active: z.boolean(),
});
export const bannerSchema = z.object({
  id,
  title: text(120),
  description: z.string().trim().max(300),
  link: text(2048).refine(
    (v) =>
      /^#[\w-]+$/.test(v) ||
      /^\/(?!\/)[\w/#?-]+$/.test(v) ||
      /^https:\/\//.test(v),
    "Use a site link, section anchor, or HTTPS URL.",
  ),
  active: z.boolean(),
});
export const caseSchema = z
  .object({
    id,
    title: text(120),
    description: text(1000),
    beforeImage: imagePath.refine(Boolean, "Add a before image."),
    afterImage: imagePath.refine(Boolean, "Add an after image."),
    active: z.boolean(),
    illustrative: z.boolean(),
  })
  .refine(
    (v) => v.beforeImage !== v.afterImage,
    "Before and after images must be different.",
  );
export const phone = text(25).regex(
  /^[+0-9 ()-]{7,25}$/,
  "Enter a valid phone number.",
);
export const inquirySchema = z.object({
  requestId: z.uuid(),
  name: text(100),
  phone,
  location: text(600),
  serviceId: z.string().max(80),
  projectType: text(80),
  description: text(1600),
});
export const orderSchema = z.object({
  requestId: z.uuid(),
  customer: z.object({
    name: text(100),
    phone,
    address: text(600),
    notes: z.string().trim().max(1000),
  }),
  items: z
    .array(z.object({ id, quantity: z.number().int().min(1).max(999) }))
    .min(1)
    .max(50),
});
