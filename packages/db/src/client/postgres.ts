import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../schema";

type Database = PostgresJsDatabase<typeof schema>;

declare global {
  var __pmf_postgres__: Database | undefined;
}

export const isDatabaseConfigured = () => Boolean(process.env.DATABASE_URL);

export const getDatabase = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to use the Postgres client.");
  }

  if (!globalThis.__pmf_postgres__) {
    const client = postgres(process.env.DATABASE_URL, {
      prepare: false,
    });

    globalThis.__pmf_postgres__ = drizzle(client, { schema });
  }

  return globalThis.__pmf_postgres__;
};
