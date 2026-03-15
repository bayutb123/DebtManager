import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendJSON } from '../_response';
import { parseBody } from '../_parseBody';
import crypto from 'crypto';

// Minimal placeholder: trust the incoming idToken (verification should be added with Google libraries/IAM)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return sendJSON(res, 405, { error: 'MethodNotAllowed' });
  const { idToken } = parseBody(req) || {};
  if (!idToken) return sendJSON(res, 400, { error: 'ValidationError', message: 'idToken is required' });

  const fakeUser = {
    id: crypto.randomUUID(),
    email: 'user@example.com',
    name: 'Google User',
    pictureUrl: 'https://i.pravatar.cc/100',
  };
  const fakeJwt = crypto.randomUUID();
  sendJSON(res, 200, { token: fakeJwt, user: fakeUser });
}
