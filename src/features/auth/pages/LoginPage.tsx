import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogIn } from 'lucide-react';
import { AuthService } from '../auth.service';
import { useAuthStore } from '../auth.store';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { demoUser } from '../auth.mock';
import heroImg from '../../../assets/hero.png';
import EmptyState from '../../../components/shared/EmptyState';

const LoginPage = () => {
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const { mutateAsync: loginWithGoogle } = useMutation({
    mutationFn: AuthService.loginWithGoogle,
    onSuccess: ({ user, token }) => {
      login(user, token);
      navigate('/dashboard');
    },
  });

  const { mutateAsync: loginDemo, isPending: demoPending } = useMutation({
    mutationFn: AuthService.loginAsDemo,
    onSuccess: ({ user, token }) => {
      login(user, token ?? undefined);
      navigate('/dashboard');
    },
  });

  const handleGoogle = async (cred: CredentialResponse) => {
    await loginWithGoogle(cred);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="grid w-full max-w-5xl items-center gap-10 rounded-3xl bg-white/90 p-6 shadow-2xl md:grid-cols-2 md:p-10">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Debt & Receivable Manager</p>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Stay on top of who owes whom.</h1>
          <p className="text-base text-slate-600">
            Track debts, receivables, and payments in one calm, modern workspace. Connect Google to start fast or try a
            demo account.
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-900 text-white grid place-items-center font-semibold">
                {demoUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{demoUser.name}</p>
                <p className="text-xs text-slate-500">{demoUser.email}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">Use the demo user to explore without Google auth.</p>
          </div>
        </div>
        <Card className="glass-panel">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Use your Google account or continue with demo.</CardDescription>
              </div>
              <img src={heroImg} alt="Hero" className="h-12 w-12 rounded-lg object-cover shadow" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasGoogleClientId ? (
              <GoogleLogin onSuccess={handleGoogle} onError={() => {}} shape="pill" width="100%" />
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                Google Sign-In disabled: set <code>VITE_GOOGLE_CLIENT_ID</code> in your .env and restart dev server.
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase text-slate-500">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => loginDemo()}
              loading={demoPending}
            >
              <LogIn className="h-4 w-4" />
              Continue as Demo
            </Button>
            <EmptyState
              title="Mock only mode"
              description="Data is stored locally; architecture is ready to swap in a backend service layer."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
