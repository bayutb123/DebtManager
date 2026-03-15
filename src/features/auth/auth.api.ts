import type { CredentialResponse } from '@react-oauth/google';
import type { User } from './auth.types';
import { apiClient } from '../../services/api/client';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    pictureUrl: string;
  };
}

export const AuthApi = {
  async loginWithGoogle(response: CredentialResponse): Promise<{ user: User; token: string }> {
    const idToken = response.credential;
    if (!idToken) throw new Error('Missing Google credential');

    const data = await apiClient.post<AuthResponse>('/auth/google', { idToken });
    const mappedUser: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      picture: data.user.pictureUrl,
      provider: 'google',
    };
    return { user: mappedUser, token: data.token };
  },
};
