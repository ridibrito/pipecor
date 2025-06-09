import { createClient } from '@/lib/supabase/server';
import { ContactList } from './components/contact-list';
export const revalidate = 0;
export default async function CrmPage() {
  const supabase = createClient();
  const { data: contacts } = await supabase.from('contacts').select('id, full_name, email, phone');
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Contatos</h1><p className="text-zinc-500">Gerencie seus leads e clientes.</p></div>
      <ContactList initialContacts={contacts ?? []} />
    </div>
  );
}