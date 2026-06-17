'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const client = getSupabaseAuthBrowserClient();
      if (!client) {
        setError('Supabase no configurado');
        setLoading(false);
        return;
      }
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('Error inesperado');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-amtme-navy flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">AMTME Studio OS</h1>
          <p className="text-amtme-gray-400 text-sm mt-1">Acceso al sistema de producción</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-amtme-navy mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amtme-navy"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amtme-navy mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amtme-navy"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amtme-yellow text-amtme-navy font-semibold py-2.5 rounded-lg hover:bg-amtme-yellow/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-amtme-gray-400 text-xs mt-6">
          A Mí Tampoco Me Explicaron · Sistema interno
        </p>
      </div>
    </div>
  );
}
