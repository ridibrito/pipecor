import { createClient } from '@/lib/supabase/server';
import { Mail, Phone, User } from 'lucide-react';
// import { ContactTimeline } from './contact-timeline'; // We will add this later

export async function ContactDetails({ contactId }: { contactId: string }) {
  const supabase = createClient();
  const { data: contact } = await supabase.from('contacts').select('*').eq('id', contactId).single();
  if (!contact) return <div className="p-6">Contato não encontrado.</div>;
  return (
    <div className="flex h-full"><div className="w-1/2 border-r border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto"><div className="space-y-6">
      <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700"><User className="h-6 w-6 text-zinc-500" /></span>
      <div><h2 className="text-xl font-bold">{contact.full_name}</h2><p className="text-sm text-zinc-500">Contato</p></div></div>
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6"><dl className="space-y-4">
        <div><dt className="text-sm font-medium text-zinc-500">Email</dt><dd className="mt-1 flex items-center gap-2"><Mail className="h-4 w-4 text-zinc-400" />{contact.email || 'Não informado'}</dd></div>
        <div><dt className="text-sm font-medium text-zinc-500">Telefone</dt><dd className="mt-1 flex items-center gap-2"><Phone className="h-4 w-4 text-zinc-400" />{contact.phone || 'Não informado'}</dd></div>
      </dl></div>
    </div></div><div className="w-1/2 p-6 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Linha do Tempo</h3><div className="p-8 text-center border-2 border-dashed rounded-lg"><p className="text-zinc-500">O "Mural do Negócio" aparecerá aqui.</p></div>
    </div></div>
  );
}