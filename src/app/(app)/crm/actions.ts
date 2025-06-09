'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
export async function createContact(prevState: any, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: 'Usuário não autenticado.' };
  const fullName = formData.get('full_name') as string;
  if (!fullName) return { message: 'O nome completo é obrigatório.' };
  const { error } = await supabase.from('contacts').insert({ full_name: fullName, email: formData.get('email') as string, phone: formData.get('phone') as string, owner_id: user.id });
  if (error) { console.error('Erro:', error); return { message: 'Erro de banco de dados.' }; }
  revalidatePath('/crm');
  return { success: true, message: 'Contato criado!' };
}