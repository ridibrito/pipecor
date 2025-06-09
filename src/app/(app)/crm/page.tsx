import { createClient } from '@/lib/supabase/server';
import { ContactList } from './components/contact-list';
import { ContactDetails } from './components/contact-details';
import { Suspense } from 'react';
import type { Tables } from '@/types/supabase';

export const revalidate = 0;

async function getContactDetails(contactId: string) {
  const supabase = createClient();
  const { data: contact } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', contactId)
    .single();
  return contact;
}

export default async function CrmPage({
  searchParams,
}: {
  searchParams: { contactId?: string; novo?: string };
}) {
  const supabase = createClient();
  const { data: contacts } = await supabase
    .from('contacts')
    .select('id, full_name, email, phone');
  
  const contactId = searchParams.contactId;
  const showNewContactDrawer = searchParams.novo === 'true';

  // Busca os dados do contato selecionado se um ID estiver presente
  const selectedContact = contactId ? await getContactDetails(contactId) : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Contatos</h1>
        <p className="text-zinc-500">Gerencie seus leads e clientes.</p>
      </div>
      
      <ContactList initialContacts={contacts ?? []}>
        {/* Passa o componente de detalhes como filho se um contato foi selecionado */}
        {selectedContact && (
          <Suspense fallback={<div>Carregando detalhes...</div>}>
            <ContactDetails initialContact={selectedContact} />
          </Suspense>
        )}
      </ContactList>
    </div>
  );
}