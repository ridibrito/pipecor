'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signup(prevState: any, formData: FormData) {
  const supabase = createClient();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { message: 'Todos os campos são obrigatórios.' };
  }

  // A mágica do debug está aqui
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  // Se houver um erro, vamos expor qual é
  if (error) {
    // 1. Imprime o erro completo no terminal do VS Code
    console.error('Erro no Cadastro do Supabase:', error);
    // 2. Retorna a mensagem de erro específica para a interface
    return { message: `Não foi possível criar a conta: ${error.message}` };
  }

  return redirect('/login?message=Conta criada com sucesso! Verifique seu e-mail para confirmação.');
}