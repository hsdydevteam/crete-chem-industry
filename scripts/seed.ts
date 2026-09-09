import { database } from "../src/lib/db";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd(), true);
await database();
console.log(
  "MongoDB content seed complete. Existing content, orders and admin credentials are preserved.",
);
process.exit(0);
