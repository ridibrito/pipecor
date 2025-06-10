import Link from 'next/link';
import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">pipecor</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Acesse sua conta para continuar</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm p-8">
          <LoginForm />
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Não tem uma conta?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
