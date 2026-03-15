import { AuthApi } from './auth.api';
import { demoUser } from './auth.mock';
import type { User } from './auth.types';
import type { CredentialResponse } from '@react-oauth/google';

export const AuthService = {
  async loginWithGoogle(response: CredentialResponse): Promise<{ user: User; token: string }> {
    return AuthApi.loginWithGoogle(response);
  },
  async loginAsDemo(): Promise<{ user: User; token: string | null }> {
    return Promise.resolve({ user: demoUser, token: null });
  },
};
