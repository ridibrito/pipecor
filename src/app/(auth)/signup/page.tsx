// src/app/(auth)/signup/page.tsx
'use client';

import Link from 'next/link';
import { Mail, Lock, User, Building, Send } from 'lucide-react'; // Send para o botão
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [name, setName] = useState(''); // Nome do usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState(''); // Nome da Corretora
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Você pode passar dados adicionais que serão armazenados em auth.users.raw_user_meta_data
        // E também pode usá-los para popular sua tabela 'users' (no schema public) via um trigger ou função no Supabase.
        data: { 
          full_name: name, // Supabase Auth espera 'full_name' ou você pode mapear depois
          company_name: companyName, 
          // Papel inicial pode ser definido aqui ou por um admin depois
          // initial_role: 'OWNER_CORRETORA' 
        },
        // URL para onde o usuário será redirecionado após clicar no link de confirmação do email
        // Certifique-se de que esta rota é pública no seu middleware e que lida com a confirmação.
        // Ou deixe o Supabase redirecionar para uma URL padrão configurada no seu painel.
        // emailRedirectTo: `${window.location.origin}/auth/callback`, 
      },
    });

    setIsLoading(false);

    if (signUpError) {
      setError('Ocorreu um erro no cadastro: ' + signUpError.message);
    } else if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
      // Caso comum: email já existe mas não está confirmado, Supabase envia novo email de confirmação.
      setError('Este email já está registrado mas não foi confirmado. Um novo email de confirmação foi enviado (se aplicável). Verifique sua caixa de entrada e spam.');
    } else if (signUpData.user) {
      setSuccess(
        'Cadastro realizado! Um link de confirmação foi enviado para o seu email. Por favor, verifique sua caixa de entrada e spam.'
      );
      // Você pode limpar o formulário aqui se desejar
      // setName(''); setEmail(''); setPassword(''); setCompanyName('');
      
      // NOTA: Após o signUp, o usuário NÃO está logado automaticamente. Ele precisa confirmar o email.
      // O Supabase Auth cuida de criar o usuário na tabela `auth.users`.
      // Você precisará de um mecanismo (ex: Trigger/Function no Supabase ou uma API route)
      // para criar um registro correspondente na sua tabela `public.users` (a do Prisma)
      // quando um novo usuário é confirmado no `auth.users`.
      // Este registro em `public.users` armazenaria o `id` do `auth.users` como chave estrangeira.
    } else {
      setError('Ocorreu uma resposta inesperada do servidor.');
    }
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Crie sua Conta Pipecor</h1>
        <p className="text-gray-600 mt-2 text-sm">Comece a transformar sua corretora hoje mesmo.</p>
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
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="companyName-signup" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Corretora
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building size={18} className="text-gray-400" />
              </div>
              <input
                id="companyName-signup"
                name="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Sua Corretora de Saúde Ltda."
              />
            </div>
          </div>
          <div>
            <label htmlFor="name-signup" className="block text-sm font-medium text-gray-700 mb-1">
              Seu Nome Completo (Responsável)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                id="name-signup"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Seu nome completo"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 mb-1">
              Seu Email (será seu login)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="email-signup"
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
            <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 mb-1">
              Crie uma Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="password-signup"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
          </div>

          <div className="pt-2">
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
              {isLoading ? 'Criando conta...' : 'Criar Conta e Enviar Confirmação'}
            </button>
          </div>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-gray-600">
        Já possui uma conta?{' '}
        <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
          Faça login
        </Link>
      </p>
    </div>
  );
}
