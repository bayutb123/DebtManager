import type { VercelRequest, VercelResponse } from '@vercel/node';
import { run } from './_db';
import { sendJSON, handleError } from './_response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const rows = await run(
        `SELECT id, reference_id as "referenceId", type, amount::float, date, note, created_at as "createdAt"
         FROM transactions
         ORDER BY date DESC, created_at DESC`,
      );
      return sendJSON(res, 200, rows);
    }
    sendJSON(res, 405, { error: 'MethodNotAllowed' });
  } catch (e) {
    handleError(res, e);
  }
}
