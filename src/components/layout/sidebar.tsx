'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, Wallet, Award, Megaphone,
  ListTodo, Settings, Mail, FileCheck, Pin, PinOff
} from 'lucide-react';

type SidebarProps = {
  isLockedOpen: boolean;
  onToggleLock: () => void;
};

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/crm', label: 'CRM', icon: Users },
    { href: '/cotacoes', label: 'Cotações', icon: FileText },
    { href: '/contratos', label: 'Contratos', icon: FileCheck },
    { href: '/caixa-de-entrada', label: 'Caixa de Entrada', icon: Mail },
    { href: '/financeiro', label: 'Financeiro', icon: Wallet },
    { href: '/comissoes', label: 'Comissões', icon: Award },
    { href: '/marketing', label: 'Marketing', icon: Megaphone },
    { href: '/tarefas', label: 'Tarefas', icon: ListTodo },
];

const settingsItem = { href: '/settings', label: 'Configurações', icon: Settings };

export default function Sidebar({ isLockedOpen, onToggleLock }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        group fixed top-0 left-0 z-40 h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800
        transition-all duration-300 ease-in-out
        ${isLockedOpen ? 'w-64' : 'w-20 hover:w-64'}
      `}
    >
      {/* ✅ CORREÇÃO APLICADA AQUI */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* LOGO SECTION */}
        <div className="h-16 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800 shrink-0 px-4">
           <div className={`transition-opacity duration-200 ${isLockedOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
             <Image 
                src="/images/logo_full.webp" 
                alt="Pipecor Logo" 
                width={120} 
                height={40} 
                className="hidden dark:hidden"
              />
           </div>
           <div className={`absolute transition-opacity duration-200 ${isLockedOpen ? 'opacity-0' : 'group-hover:opacity-0'}`}>
              <span className="text-2xl font-bold text-brand-green">P</span>
           </div>
        </div>

        {/* NAVIGATION SECTION */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <ul className="space-y-1 list-none p-0">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} className="block">
                    <div
                      className={`flex items-center gap-x-4 rounded-md text-sm font-medium
                        ${isLockedOpen ? '' : 'justify-center'}
                        px-2 h-10
                        ${ isActive
                            ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-white'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className={`whitespace-nowrap transition-opacity duration-200 ${isLockedOpen ? 'opacity-100' : 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto'}`}>{item.label}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER SECTION */}
        <div className="px-2 py-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
          <div
            onClick={onToggleLock}
            className={`flex items-center gap-x-4 p-2 rounded-md text-sm font-medium cursor-pointer text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${isLockedOpen ? '' : 'justify-center'}`}
          >
            {isLockedOpen ? <PinOff className="h-5 w-5 flex-shrink-0" /> : <Pin className="h-5 w-5 flex-shrink-0" />}
            <span className={`whitespace-nowrap transition-opacity duration-200 ${isLockedOpen ? 'opacity-100' : 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto'}`}>{isLockedOpen ? 'Destravar' : 'Travar'}</span>
          </div>
          <Link href={settingsItem.href} className="block mt-1">
            <div
              className={`flex items-center gap-x-4 p-2 rounded-md text-sm font-medium
                ${isLockedOpen ? '' : 'justify-center'}
                ${ pathname.startsWith(settingsItem.href)
                    ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
            >
              <settingsItem.icon className="h-5 w-5 flex-shrink-0" />
              <span className={`whitespace-nowrap transition-opacity duration-200 ${isLockedOpen ? 'opacity-100' : 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto'}`}>{settingsItem.label}</span>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}