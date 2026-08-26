import { Pool, type QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __portfolioPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const needsSsl =
    connectionString.includes("rlwy.net") ||
    connectionString.includes("railway.app") ||
    process.env.PGSSLMODE === "require";

  return new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });
}

export function getPool() {
  if (!global.__portfolioPool) {
    global.__portfolioPool = createPool();
  }
  return global.__portfolioPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
) {
  return getPool().query<T>(text, params);
}
