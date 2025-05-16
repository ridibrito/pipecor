// src/app/(auth)/forgot-password/page.tsx
'use client';

import Link from 'next/link';
import { Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  const handlePasswordResetRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      // URL para onde o usuário será redirecionado após clicar no link de redefinição no email.
      // Você precisará criar uma página em /auth/update-password para lidar com a redefinição.
      // Certifique-se que esta rota é pública no seu middleware.
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    setIsLoading(false);

    if (resetError) {
      setError('Ocorreu um erro: ' + resetError.message);
    } else {
      setSuccess(
        'Se este email estiver cadastrado, um link para redefinir sua senha foi enviado. Verifique sua caixa de entrada e spam.'
      );
    }
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Redefinir Senha</h1>
        <p className="text-gray-600 mt-2 text-sm">
          Insira seu email e enviaremos instruções para você criar uma nova senha.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
          {success}
        </div>
      )}

      {!success && ( // Mostra o formulário apenas se não houver mensagem de sucesso
        <form onSubmit={handlePasswordResetRequest} className="space-y-6">
          <div>
            <label htmlFor="email-forgot" className="block text-sm font-medium text-gray-700 mb-1">
              Email Cadastrado
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="email-forgot"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Send size={20} className="mr-2" />
              )}
              {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Voltar para o Login
        </Link>
      </div>
    </div>
  );
}
