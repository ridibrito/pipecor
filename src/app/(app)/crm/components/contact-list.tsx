'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { NewContactForm } from './new-contact-form';
import type { Tables } from '@/types/supabase';

type Contact = Tables<'contacts'>;

export function ContactList({ 
  initialContacts,
  children, // This is the new prop for the Server Component
}: { 
  initialContacts: Contact[];
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const contactId = searchParams.get('contactId');
  const showNewContactDrawer = searchParams.get('novo') === 'true';
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setIsDrawerOpen(!!contactId || showNewContactDrawer);
  }, [contactId, showNewContactDrawer]);
  
  const handleCloseDrawer = () => {
    router.push('/crm');
  };

  const getDrawerTitle = () => {
    if (showNewContactDrawer) return 'Criar Novo Contato';
    if (contactId) {
      const contact = initialContacts.find(c => c.id === contactId);
      return contact?.full_name || 'Detalhes do Contato';
    }
    return '';
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push('/crm?novo=true')}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Contato
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
        <ul role="list" className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {initialContacts.length > 0 ? (
            initialContacts.map((contact) => (
              <li 
                key={contact.id} 
                onClick={() => router.push(`/crm?contactId=${contact.id}`)}
                className="flex justify-between gap-x-6 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <div className="min-w-0 flex-auto"><p className="text-sm font-semibold">{contact.full_name}</p><p className="mt-1 truncate text-xs text-zinc-500">{contact.email}</p></div>
                <div className="hidden sm:flex sm:flex-col sm:items-end"><p className="text-sm">{contact.phone}</p></div>
              </li>
            ))
          ) : ( <li className="p-8 text-center"><p className="text-zinc-500">Nenhum contato encontrado.</p></li> )}
        </ul>
      </div>

      <Drawer 
        isOpen={isDrawerOpen} 
        setIsOpen={handleCloseDrawer} 
        title={getDrawerTitle()}
      >
        {showNewContactDrawer && <NewContactForm onFormSubmit={handleCloseDrawer} />}
        {contactId && children} {/* Render the passed Server Component here */}
      </Drawer>
    </>
  );
}