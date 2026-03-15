import type { VercelRequest, VercelResponse } from '@vercel/node';
import { run } from '../_db';
import { sendJSON, handleError } from '../_response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return sendJSON(res, 405, { error: 'MethodNotAllowed' });
  try {
    const debtAgg = await run<{ total: number; paid: number }>(
      `SELECT COALESCE(SUM(amount),0)::float as total, COALESCE(SUM(paid_amount),0)::float as paid FROM debts`,
    );
    const recAgg = await run<{ total: number; paid: number }>(
      `SELECT COALESCE(SUM(amount),0)::float as total, COALESCE(SUM(paid_amount),0)::float as paid FROM receivables`,
    );
    const tx = await run(
      `SELECT id, reference_id as "referenceId", type, amount::float, date, note, created_at as "createdAt"
       FROM transactions ORDER BY date DESC, created_at DESC LIMIT 10`,
    );

    const totalDebt = debtAgg[0]?.total ?? 0;
    const totalDebtPaid = debtAgg[0]?.paid ?? 0;
    const totalRec = recAgg[0]?.total ?? 0;
    const totalRecPaid = recAgg[0]?.paid ?? 0;

    return sendJSON(res, 200, {
      totalDebt,
      totalReceivable: totalRec,
      netBalance: totalRecPaid - totalDebtPaid,
      recentTransactions: tx,
    });
  } catch (e) {
    handleError(res, e);
  }
}
