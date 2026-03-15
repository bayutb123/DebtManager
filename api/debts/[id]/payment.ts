import type { VercelRequest, VercelResponse } from '@vercel/node';
import { run } from '../../_db';
import { sendJSON, handleError } from '../../_response';

const computeStatus = (amount: number, paid: number, due: string) => {
  if (paid >= amount) return 'PAID';
  const today = new Date().toISOString().slice(0, 10);
  if (new Date(due) < new Date(today)) return 'OVERDUE';
  if (paid > 0) return 'PARTIAL';
  return 'ACTIVE';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return sendJSON(res, 405, { error: 'MethodNotAllowed' });
  try {
    const { id } = req.query;
    const { amount, date, note } = req.body || {};
    const debtRows = await run<{ amount: number; paidAmount: number; dueDate: string }>(
      `SELECT amount::float as amount, paid_amount::float as "paidAmount", due_date as "dueDate" FROM debts WHERE id=$1`,
      [id],
    );
    if (!debtRows.length) return sendJSON(res, 404, { error: 'NotFound' });
    const debt = debtRows[0];
    const newPaid = debt.paidAmount + Number(amount);
    const status = computeStatus(debt.amount, newPaid, debt.dueDate);

    await run(
      `INSERT INTO transactions (reference_id, type, amount, date, note)
       VALUES ($1,'DEBT',$2,$3,$4)`,
      [id, amount, date, note ?? null],
    );

    const updated = await run(
      `UPDATE debts SET paid_amount=$2, status=$3
       WHERE id=$1
       RETURNING id, contact_id as "contactId", title, amount::float, paid_amount as "paidAmount",
                 due_date as "dueDate", status, notes, created_at as "createdAt"`,
      [id, newPaid, status],
    );

    return sendJSON(res, 200, updated[0]);
  } catch (e) {
    handleError(res, e);
  }
}
