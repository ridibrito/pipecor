'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from './actions';
import { Mail, Lock } from 'lucide-react';

export function LoginForm() {
  const [errorMessage, dispatch] = useFormState(login, undefined);

  return (
    <form action={dispatch} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 py-2 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              placeholder="voce@exemplo.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Senha
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="block w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-10 py-2 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <LoginButton />
      
      {errorMessage && (
        <div className="flex items-center space-x-2 pt-4 text-sm text-red-500">
          <p>{errorMessage}</p>
        </div>
      )}
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
    >
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  );
}