export type Provider = 'google' | 'demo';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  provider: Provider;
}
