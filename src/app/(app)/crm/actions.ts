'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createContact(prevState: any, formData: FormData) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Usuário não autenticado.' };
  }

  const fullName = formData.get('full_name') as string;
  if (!fullName) {
    return { message: 'O nome completo é obrigatório.' };
  }

  const { error } = await supabase
    .from('contacts')
    .insert({
      full_name: fullName,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      owner_id: user.id
    });

  if (error) {
    console.error('Erro ao criar contato:', error);
    return { message: 'Erro de banco de dados: não foi possível criar o contato.' };
  }

  revalidatePath('/crm');
  return { success: true, message: 'Contato criado com sucesso!' };
}

// Função para ATUALIZAR um contato
export async function updateContact(prevState: any, formData: FormData) {
  const supabase = createClient();

  const id = formData.get('id') as string;
  const fullName = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  if (!fullName) {
    return { message: 'O nome completo é obrigatório.' };
  }

  const { error } = await supabase
    .from('contacts')
    .update({ 
      full_name: fullName, 
      email: email, 
      phone: phone 
    })
    .eq('id', id);
  
  if (error) {
    console.error('Erro ao atualizar contato:', error);
    return { message: 'Erro de banco de dados: não foi possível atualizar o contato.' };
  }

  revalidatePath('/crm');
  return { success: true, message: 'Contato atualizado com sucesso!' };
}

// Função para DELETAR um contato
export async function deleteContact(formData: FormData) {
  const supabase = createClient();
  const id = formData.get('id') as string;

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar contato:', error);
    throw new Error('Não foi possível deletar o contato.');
  }
  
  revalidatePath('/crm');
  redirect('/crm'); 
}