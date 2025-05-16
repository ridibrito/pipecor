// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

// Esta função cria um cliente Supabase que pode ser usado em
// Componentes do Lado do Cliente (Client Components) e Server Actions.
export function createSupabaseBrowserClient() {
  // As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
  // devem estar definidas no seu arquivo .env (ou .env.local)
  // e acessíveis no lado do cliente (por isso o prefixo NEXT_PUBLIC_).

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase URL or Anon Key is missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
