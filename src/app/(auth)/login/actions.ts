'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(prevState: string | undefined, formData: FormData) {
  const supabase = createClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return 'E-mail e senha são obrigatórios.';
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return 'Falha no login. Verifique seu e-mail e senha.';
  }

  // A rota de redirecionamento após o login.
  return redirect('/dashboard');
}