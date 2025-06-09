'use client';

import { Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserNav } from './user-nav';

type NavbarProps = {
  userName: string;
  userEmail: string;
};

export default function Navbar({ userName, userEmail }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-100">
      {/* A Navbar agora tem uma margem esquerda que corresponde à largura da Sidebar */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 h-16 flex items-center justify-between px-6">
        {/* Lado Esquerdo - Reservado, pois o logo estará na Sidebar agora */}
        <div>
          <img src="/logo_full.webp" alt="logo_coruss" width={150} height={50} />
        </div>

        {/* Lado Direito - Itens da Navbar */}
        <div className="flex items-center gap-x-4">
          <ThemeToggle />
          <button className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Bell className="h-5 w-5 text-zinc-500" />
          </button>
          <UserNav userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </header>
  );
}