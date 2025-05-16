
'use client'; // Para usar usePathname e interatividade no menu

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building, // Account (Corretora)
  Users,    // Users
  Users2,   // Teams (usei Users2 para diferenciar)
  GitFork,  // Pipelines (Funis)
  ListChecks, // Custom Fields
  Zap,      // Automations
  Plug,     // Integrations
  CreditCard // Billing
} from 'lucide-react';
import React from 'react';

interface SettingsNavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const settingsNavItems: SettingsNavItem[] = [
  { href: '/settings/account', label: 'Dados da Corretora', icon: Building },
  { href: '/settings/users', label: 'Usuários', icon: Users },
  { href: '/settings/teams', label: 'Equipes', icon: Users2 },
  { href: '/settings/pipelines', label: 'Funis de Venda', icon: GitFork },
  { href: '/settings/custom-fields', label: 'Campos Personalizados', icon: ListChecks },
  { href: '/settings/automations', label: 'Automações', icon: Zap },
  { href: '/settings/integrations', label: 'Integrações', icon: Plug },
  { href: '/settings/billing', label: 'Assinatura e Cobrança', icon: CreditCard },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Sub-navegação da Sidebar de Configurações */}
      <aside className="w-full lg:w-64 xl:w-72 shrink-0">
        <div className="bg-white p-4 rounded-xl shadow-lg h-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 px-2">Configurações</h2>
          <nav className="space-y-1">
            {settingsNavItems.map((item) => {
              const Icon = item.icon;
              // O pathname do App Router não inclui o grupo (app)
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Conteúdo da Página de Configuração Ativa */}
      <div className="flex-1">
        {/* O conteúdo da página específica (ex: account/page.tsx) será renderizado aqui */}
        {children}
      </div>
    </div>
  );
}
