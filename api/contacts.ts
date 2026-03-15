import type { VercelRequest, VercelResponse } from '@vercel/node';
import { run } from './_db';
import { sendJSON, handleError } from './_response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const rows = await run(
        `SELECT id, name, phone, notes, created_at as "createdAt" FROM contacts ORDER BY created_at DESC`,
      );
      return sendJSON(res, 200, rows);
    }

    if (req.method === 'POST') {
      const { name, phone, notes } = req.body || {};
      const rows = await run(
        `INSERT INTO contacts (name, phone, notes) VALUES ($1,$2,$3) RETURNING id, name, phone, notes, created_at as "createdAt"`,
        [name, phone, notes ?? null],
      );
      return sendJSON(res, 201, rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, name, phone, notes } = req.body || {};
      const rows = await run(
        `UPDATE contacts SET name=$2, phone=$3, notes=$4 WHERE id=$1 RETURNING id, name, phone, notes, created_at as "createdAt"`,
        [id, name, phone, notes ?? null],
      );
      return sendJSON(res, 200, rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await run(`DELETE FROM contacts WHERE id = $1`, [id]);
      return sendJSON(res, 204, null);
    }

    sendJSON(res, 405, { error: 'MethodNotAllowed' });
  } catch (e) {
    handleError(res, e);
  }
}
