'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { createContact } from '../actions';
import { useEffect } from 'react';
export function NewContactForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [state, dispatch] = useFormState(createContact, undefined);
  useEffect(() => { if (state?.success) { onFormSubmit(); } }, [state, onFormSubmit]);
  return (
    <form action={dispatch} className="space-y-6 h-full flex flex-col">
      <div className="flex-1 space-y-4"><p className="text-sm text-zinc-600">Preencha os dados abaixo para criar um novo contato.</p><div>
        <label htmlFor="full_name">Nome Completo</label>
        <input id="full_name" name="full_name" type="text" required className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 px-3" />
      </div><div><label htmlFor="email">Email</label><input id="email" name="email" type="email" className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 px-3" /></div>
      <div><label htmlFor="phone">Telefone</label><input id="phone" name="phone" type="text" className="mt-1 block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-2 px-3" /></div>
      {state?.message && <p className="text-sm text-red-500">{state.message}</p>}</div>
      <div className="flex justify-end gap-x-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button type="button" onClick={onFormSubmit} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Cancelar</button>
        <SubmitButton />
      </div>
    </form>
  );
}
function SubmitButton() { const { pending } = useFormStatus(); return ( <button type="submit" aria-disabled={pending} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50">{pending ? 'Salvando...' : 'Salvar Contato'}</button> ); }