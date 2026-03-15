import { Pool } from 'pg';

let pool: Pool | null = null;

export const getPool = () => {
  if (pool) return pool;
  const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE } = process.env;
  if (!PGHOST || !PGPORT || !PGDATABASE || !PGUSER) {
    throw new Error('Database env vars missing');
  }
  pool = new Pool({
    host: PGHOST,
    port: Number(PGPORT),
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    ssl: PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });
  return pool;
};

export const run = async <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  const p = getPool();
  if (!p) throw new Error('DB pool not configured');
  const res = await p.query(sql, params);
  return res.rows as T[];
};
