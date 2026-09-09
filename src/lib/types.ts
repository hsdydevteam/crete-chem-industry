export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  imageUrl: string;
  label: string;
  description: string;
  benefits: string[];
  applications: string[];
  serviceIds: string[];
  active: boolean;
  featured: boolean;
  updatedAt?: string;
}
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  recommendedProductIds: string[];
  active: boolean;
  updatedAt?: string;
}
export interface Banner {
  id: string;
  title: string;
  description: string;
  link: string;
  active: boolean;
  updatedAt?: string;
}
export interface BeforeAfterCase {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  active: boolean;
  illustrative: boolean;
  updatedAt?: string;
}
export interface Catalog {
  products: Product[];
  services: Service[];
  banners: Banner[];
  cases: BeforeAfterCase[];
}
export type CollectionName = keyof Catalog;
export interface Customer {
  name: string;
  phone: string;
  address: string;
  notes: string;
}
export interface Order {
  id: string;
  createdAt: number;
  status: string;
  customer: Customer;
  items: { id: string; name: string; quantity: number }[];
}
export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  location: string;
  serviceId: string;
  projectType: string;
  description: string;
  status: string;
  createdAt: number;
}
export const statuses = [
  "New",
  "Contacted",
  "Confirmed",
  "In progress",
  "Completed",
  "Cancelled",
] as const;
