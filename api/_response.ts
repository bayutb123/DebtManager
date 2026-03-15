import type { VercelResponse } from '@vercel/node';

export const sendJSON = (res: VercelResponse, status: number, body: any) => {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(body));
};

export const handleError = (res: VercelResponse, error: any) => {
  console.error(error);
  const message = error?.message || 'Unexpected error';
  sendJSON(res, 500, { error: 'ServerError', message });
};
