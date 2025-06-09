'use client';

import type { Tables } from '@/types/supabase';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { updateContact, deleteContact } from '../actions';
import { Mail, Phone, User, Edit, Trash2 } from 'lucide-react';

type Contact = Tables<'contacts'>;

export function ContactDetails({ initialContact }: { initialContact: Contact }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction] = useFormState(updateContact, undefined);
  
  // Função para lidar com o delete, mostrando um confirm
  const handleDelete = () => {
    if(window.confirm("Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.")) {
      const formData = new FormData();
      formData.append('id', initialContact.id);
      deleteContact(formData);
    }
  }

  if (isEditing) {
    // MODO DE EDIÇÃO
    return (
      <form action={updateAction} className="flex flex-col h-full p-6">
        <input type="hidden" name="id" value={initialContact.id} />
        <div className="flex-1 space-y-4">
          <div>
            <label htmlFor="full_name" className="text-sm font-medium">Nome Completo</label>
            <input id="full_name" name="full_name" type="text" required defaultValue={initialContact.full_name || ''} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 px-3" />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" defaultValue={initialContact.email || ''} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 px-3" />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
            <input id="phone" name="phone" type="text" defaultValue={initialContact.phone || ''} className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 px-3" />
          </div>
          {updateState?.message && <p className="text-sm text-red-500">{updateState.message}</p>}
        </div>
        <div className="flex justify-end gap-x-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button type="button" onClick={() => setIsEditing(false)} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Cancelar</button>
          <SubmitButton />
        </div>
      </form>
    );
  }

  // MODO DE VISUALIZAÇÃO
  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700"><User className="h-6 w-6 text-zinc-500" /></span>
              <div>
                <h2 className="text-xl font-bold">{initialContact.full_name}</h2>
                <p className="text-sm text-zinc-500">Contato</p>
              </div>
            </div>
            <div className="flex gap-x-2">
              <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"><Edit className="h-4 w-4" /></button>
              <button onClick={handleDelete} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6"><dl className="space-y-4">
            <div><dt className="text-sm font-medium text-zinc-500">Email</dt><dd className="mt-1 flex items-center gap-2"><Mail className="h-4 w-4 text-zinc-400" />{initialContact.email || 'Não informado'}</dd></div>
            <div><dt className="text-sm font-medium text-zinc-500">Telefone</dt><dd className="mt-1 flex items-center gap-2"><Phone className="h-4 w-4 text-zinc-400" />{initialContact.phone || 'Não informado'}</dd></div>
          </dl></div>
        </div>
      </div>
      <div className="w-1/2 p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Linha do Tempo</h3>
        <div className="p-8 text-center border-2 border-dashed rounded-lg"><p className="text-zinc-500">O "Mural do Negócio" aparecerá aqui.</p></div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" aria-disabled={pending} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50">{pending ? 'Salvando...' : 'Salvar Alterações'}</button>;
}