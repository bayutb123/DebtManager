import type { VercelRequest } from '@vercel/node';

export const parseBody = <T = any>(req: VercelRequest): T | undefined => {
  const b = req.body;
  if (!b) return undefined;
  if (typeof b === 'string') {
    try {
      return JSON.parse(b) as T;
    } catch {
      return undefined;
    }
  }
  return b as T;
};
