// src/components/layout/navbar.tsx
'use client';

import NextImage from 'next/image'; // Renomeado para evitar conflito com ícone
import Link from 'next/link';
import { Search, Bell, Menu, UserCircle, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User as SupabaseAuthUser, AuthChangeEvent, Session } from '@supabase/supabase-js';

interface NavbarProps {
  onToggleSidebarLock: () => void;
}

export default function Navbar({ onToggleSidebarLock }: NavbarProps) {
  const [authUser, setAuthUser] = useState<SupabaseAuthUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const getUserSessionAndListen = async () => {
      // Pega a sessão inicial
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) console.error("Error getting initial session:", sessionError);
      
      console.log('Navbar initial authUser:', session?.user);
      console.log('Navbar initial avatar_url:', session?.user?.user_metadata?.avatar_url);
      setAuthUser(session?.user ?? null);

      // Ouve mudanças no estado de autenticação
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
          console.log('Navbar onAuthStateChange event:', event);
          console.log('Navbar onAuthStateChange authUser:', session?.user);
          console.log('Navbar onAuthStateChange avatar_url:', session?.user?.user_metadata?.avatar_url);
          setAuthUser(session?.user ?? null);
        }
      );

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    };

    getUserSessionAndListen();
  }, [supabase]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao fazer logout:", error.message);
    }
    router.push('/'); 
    router.refresh(); 
  };

  // Extrai avatarUrl e displayName DEPOIS que authUser foi definido pelo useEffect
  const avatarUrl = authUser?.user_metadata?.avatar_url as string | undefined;
  const displayName = authUser?.user_metadata?.full_name || authUser?.email;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 z-30">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebarLock}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 mr-2 lg:mr-4"
          title="Alternar sidebar"
        >
          <Menu size={24} />
        </button>
        <Link href="/dashboard" className="flex items-center">
          <NextImage
            src="/logo_full.png"
            alt="Pipecor Logo"
            width={120}
            height={30}
            priority
          />
        </Link>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <button 
          aria-label="Buscar"
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <Search size={20} />
        </button>
        <button 
          aria-label="Notificações"
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 relative"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white" />
        </button>
        
        {authUser ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Menu do usuário"
              aria-expanded={isDropdownOpen}
            >
              {avatarUrl ? (
                <NextImage
                  src={avatarUrl}
                  alt="Avatar do Usuário"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                  onError={(e) => { 
                    console.warn("Erro ao carregar avatar na Navbar:", avatarUrl);
                    // Se a URL do avatar quebrar, pode-se tentar limpar para mostrar o placeholder
                    // (e.target as HTMLImageElement).style.display = 'none'; // Ou algo para forçar o fallback
                  }}
                />
              ) : (
                <UserCircle size={22} /> 
              )}
            </button>
            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-50 border border-gray-200 py-1"
              >
                <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                  <p className="font-semibold truncate" title={displayName || undefined}>
                    {displayName || 'Usuário'}
                  </p>
                  {authUser.user_metadata?.full_name && authUser.email && (
                     <p className="text-xs text-gray-500 truncate">{authUser.email}</p>
                  )}
                </div>
                <Link
                  href="/profile"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Meu Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700">
              Entrar
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
