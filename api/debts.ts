import type { VercelRequest, VercelResponse } from '@vercel/node';
import { run } from './_db';
import { sendJSON, handleError } from './_response';
import { parseBody } from './_parseBody';

const computeStatus = (amount: number, paid: number, due: string) => {
  if (paid >= amount) return 'PAID';
  const today = new Date().toISOString().slice(0, 10);
  if (new Date(due) < new Date(today)) return 'OVERDUE';
  if (paid > 0) return 'PARTIAL';
  return 'ACTIVE';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const rows = await run(
        `SELECT id, contact_id as "contactId", title, amount::float, paid_amount as "paidAmount", due_date as "dueDate",
                status, notes, created_at as "createdAt"
         FROM debts
         ORDER BY created_at DESC`,
      );
      return sendJSON(res, 200, rows);
    }

    if (req.method === 'POST') {
      const { contactId, title, amount, dueDate, notes } = parseBody(req) || {};
      const status = computeStatus(Number(amount), 0, dueDate);
      const rows = await run(
        `INSERT INTO debts (contact_id, title, amount, paid_amount, due_date, status, notes)
         VALUES ($1,$2,$3,0,$4,$5,$6)
         RETURNING id, contact_id as "contactId", title, amount::float, paid_amount as "paidAmount",
                   due_date as "dueDate", status, notes, created_at as "createdAt"`,
        [contactId, title, amount, dueDate, status, notes ?? null],
      );
      return sendJSON(res, 201, rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, title, amount, dueDate, notes, contactId, paidAmount } = parseBody(req) || {};
      const status = computeStatus(Number(amount), Number(paidAmount ?? 0), dueDate);
      const rows = await run(
        `UPDATE debts
         SET title=$2, amount=$3, paid_amount=$4, due_date=$5, status=$6, notes=$7, contact_id=$8
         WHERE id=$1
         RETURNING id, contact_id as "contactId", title, amount::float, paid_amount as "paidAmount",
                   due_date as "dueDate", status, notes, created_at as "createdAt"`,
        [id, title, amount, paidAmount ?? 0, dueDate, status, notes ?? null, contactId],
      );
      return sendJSON(res, 200, rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await run(`DELETE FROM debts WHERE id=$1`, [id]);
      return sendJSON(res, 204, null);
    }

    sendJSON(res, 405, { error: 'MethodNotAllowed' });
  } catch (e) {
    handleError(res, e);
  }
}
