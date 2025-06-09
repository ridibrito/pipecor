import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from './actions';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Este é um fallback de segurança. O middleware já deve ter redirecionado.
    redirect('/login');
  }

  // Busca o nome do usuário na tabela 'profiles'
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Bem-vindo(a), {profile?.full_name || 'Usuário'}!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Aqui está um resumo da sua atividade.
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md shadow-sm hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
          >
            Sair
          </button>
        </form>
      </div>

      {/* Área para os futuros cards e KPIs do dashboard */}
      <div className="p-8 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
        <p className="text-zinc-500">
          Seu dashboard está sendo construído. Em breve, você verá seus KPIs aqui.
        </p>
      </div>
    </div>
  );
}