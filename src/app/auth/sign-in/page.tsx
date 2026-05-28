'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Field, Input } from '@/components/ui';
import { getSiteUrl } from '@/lib/supabase/env';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';

export default function SignInPage() {
  const [next, setNext] = useState('/dashboard');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get('next');

    if (nextParam) {
      setNext(nextParam);
    }
  }, []);

  const submit = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const client = getSupabaseAuthBrowserClient();

      if (!client) {
        setError('Supabase no esta configurado en este entorno.');
        setLoading(false);
        return;
      }

      const redirectTo = `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error: signInError } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      setMessage('Te enviamos un enlace de acceso a tu correo.');
    } catch {
      setError('No se pudo iniciar sesion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4">
      <Card className="w-full">
        <div className="text-xs uppercase tracking-[0.22em] text-black/40">Acceso</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0C1F36]">
          Iniciar sesion
        </h1>
        <p className="mt-3 text-sm leading-6 text-black/58">
          Usa tu correo para recibir un enlace magico y entrar al sistema AMTME.
        </p>

        <div className="mt-5 space-y-4">
          <Field label="Correo">
            <Input
              type="email"
              placeholder="tu-correo@dominio.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Button onClick={submit} disabled={loading || !email.trim()}>
            {loading ? 'Enviando...' : 'Enviar enlace magico'}
          </Button>
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-[#E0211E]">{error}</p> : null}
        </div>
      </Card>
    </div>
  );
}
