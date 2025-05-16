// src/components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react'; // Import React para JSX.Element e Fragment
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  FileSignature,
  CircleDollarSign,
  CheckSquare,
  Settings,
  Briefcase,
  UserPlus,
  Contact,
  Building,
  Mail,
  Megaphone,
  Landmark,
  ArrowLeftRight,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export interface NavItemStructure { // Renomeado para evitar conflito se NavItem for usado em outro lugar
  href: string;
  label: string;
  icon: React.ElementType;
  children?: NavItemStructure[];
  basePath?: string;
}

const mainNavItems: NavItemStructure[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, basePath: '/dashboard' },
  {
    href: '#crm-dropdown', // Usar um href único para o botão/dropdown em si
    label: 'CRM',
    icon: Users,
    basePath: '/crm',
    children: [
      { href: '/crm/deals', label: 'Negócios', icon: Briefcase, basePath: '/crm/deals' },
      { href: '/crm/leads', label: 'Leads', icon: UserPlus, basePath: '/crm/leads' },
      { href: '/crm/contacts', label: 'Contatos', icon: Contact, basePath: '/crm/contacts' },
      { href: '/crm/companies', label: 'Empresas', icon: Building, basePath: '/crm/companies' },
    ],
  },
  { href: '/quotations', label: 'Cotações', icon: FileText, basePath: '/quotations' },
  { href: '/contracts', label: 'Contratos', icon: FileSignature, basePath: '/contracts' },
  { href: '/inbox', label: 'Caixa de Entrada', icon: Mail, basePath: '/inbox' },
  {
    href: '#financial-dropdown', // Usar um href único
    label: 'Financeiro',
    icon: Landmark,
    basePath: '/financial',
    children: [
      { href: '/financial/overview', label: 'Visão Geral', icon: LayoutDashboard, basePath: '/financial/overview' },
      { href: '/financial/transactions', label: 'Contas P/R', icon: ArrowLeftRight, basePath: '/financial/transactions' },
      { href: '/commissions/management', label: 'Gestão Comissões', icon: CircleDollarSign, basePath: '/commissions/management' },
    ],
  },
  { href: '/commissions', label: 'Minhas Comissões', icon: CircleDollarSign, basePath: '/commissions' },
  { href: '/marketing/campaigns', label: 'Marketing', icon: Megaphone, basePath: '/marketing' },
  { href: '/tasks', label: 'Tarefas', icon: CheckSquare, basePath: '/tasks' },
];

const settingsNavItem: NavItemStructure = { href: '/settings/account', label: 'Configurações', icon: Settings, basePath: '/settings' };

interface SidebarProps {
  isLockedOpen: boolean;
}

const IconComponent = ({ as: IconComp, ...props }: { as: React.ElementType, [key: string]: any }) => {
  return <IconComp {...props} />;
};

export default function Sidebar({ isLockedOpen }: SidebarProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();

  const isEffectivelyOpen = isLockedOpen || isHovering;

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    const newOpenDropdownsState: { [key: string]: boolean } = {};
    mainNavItems.forEach(item => {
      if (item.children && item.basePath && pathname.startsWith(item.basePath)) {
        newOpenDropdownsState[item.label] = true;
      } else if (item.children) {
        // Mantém o estado se não for o pai ativo, a menos que outro pai tenha sido aberto
        newOpenDropdownsState[item.label] = openDropdowns[item.label] || false;
      }
    });
    setOpenDropdowns(newOpenDropdownsState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  const hoverTextColorClass = 'hover:text-green-600';
  const hoverBgColorClass = 'hover:bg-green-100';
  const iconHoverColorClass = 'group-hover:text-green-600';
  const activeItemClasses = 'bg-green-100 text-green-700 font-semibold';
  const activeIconClasses = 'text-green-700';


  const renderNavItem = (item: NavItemStructure, isSubItem = false): JSX.Element => {
    const Icon = item.icon;
    const isOpen = openDropdowns[item.label] || false;
    
    let isActive = false;
    if (item.basePath) {
      // Um item é considerado ativo se o pathname começa com seu basePath.
      // Se for um item pai com filhos, ele só é "diretamente" ativo se o pathname
      // for exatamente seu href (caso ele seja uma página de overview) E nenhum filho estiver ativo.
      // Se um filho estiver ativo, o pai é "parentOfActivePath".
      if (item.children) {
        isActive = (item.href !== "#crm-dropdown" && item.href !== "#financial-dropdown" && pathname === item.href) && 
                   !item.children.some(child => pathname === child.href || (child.basePath && pathname.startsWith(child.basePath)));
      } else {
        isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/' && item.href.length < pathname.length && pathname[item.href.length] === '/');
      }
    } else {
        isActive = pathname === item.href;
    }
    
    const isParentOfActivePath = item.children && item.basePath && pathname.startsWith(item.basePath);

    if (item.children) {
      return (
        // Usando item.label como key para o container do dropdown, assumindo que labels são únicas no nível principal
        <div key={item.label} className={`${isSubItem ? 'pl-0' : ''}`}>
          <button
            onClick={(e) => {
              e.preventDefault(); 
              if (isEffectivelyOpen) {
                toggleDropdown(item.label);
              }
            }}
            className={`
              w-full flex items-center justify-between p-3 mx-2 rounded-md
              ${hoverBgColorClass} ${hoverTextColorClass}
              transition-colors group
              ${!isEffectivelyOpen ? 'justify-center' : ''}
              ${isParentOfActivePath && isOpen ? activeItemClasses : ''}
              ${isParentOfActivePath && !isOpen && !isActive ? activeItemClasses.replace('bg-green-100', 'bg-transparent').replace('font-semibold', 'font-medium') : ''}
              ${isActive ? activeItemClasses : ''} 
            `}
            title={item.label}
          >
            <div className="flex items-center space-x-3">
              <Icon size={20} className={`shrink-0 ${isParentOfActivePath || isActive ? activeIconClasses : 'text-gray-500'} ${iconHoverColorClass}`} />
              {isEffectivelyOpen && <span className="truncate whitespace-nowrap">{item.label}</span>}
            </div>
            {isEffectivelyOpen && (
              <IconComponent 
                as={isOpen ? ChevronDown : ChevronRight} 
                size={18} 
                className="shrink-0 transition-transform duration-200" 
              />
            )}
          </button>
          {isEffectivelyOpen && isOpen && (
            <div className={`pl-6 pr-2 py-1 space-y-1 ml-2 border-l border-gray-200`}>
              {item.children.map(child => (
                // A key aqui é crucial e child.href deve ser único entre os filhos
                <React.Fragment key={child.href}> 
                  {renderNavItem(child, true)}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      // Usando item.href como key para Links, assumindo que são únicos
      <Link
        key={item.href}
        href={item.href}
        className={`
          flex items-center space-x-3 p-3 mx-2 rounded-md
          ${hoverBgColorClass} ${hoverTextColorClass}
          transition-colors group
          ${!isEffectivelyOpen ? 'justify-center' : ''} 
          ${isActive ? activeItemClasses : ''}
          ${isSubItem ? 'pl-5' : ''}
        `}
        title={item.label}
      >
        <Icon size={20} className={`shrink-0 ${isActive ? activeIconClasses : `text-gray-500 ${iconHoverColorClass}`}`} />
        {isEffectivelyOpen && (
          <span className="truncate whitespace-nowrap">{item.label}</span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={`
        fixed left-0 bg-white text-gray-700 flex flex-col
        border-r border-gray-200 transition-all duration-300 ease-in-out z-20
        ${isEffectivelyOpen ? 'w-64 shadow-lg' : 'w-20'}
        top-16 h-[calc(100vh-4rem)] 
        overflow-hidden
      `}
      onMouseEnter={() => { if (!isLockedOpen) setIsHovering(true); }}
      onMouseLeave={() => { if (!isLockedOpen) setIsHovering(false); }}
    >
      <nav className="flex-1 pt-4 space-y-1 overflow-hidden">
        {mainNavItems.map((item) => (
          // Usando item.label como key para os itens de primeiro nível
          // Assumindo que os labels dos itens principais são únicos.
          // Se renderNavItem retorna um único elemento raiz já com key,
          // o React.Fragment aqui pode ser desnecessário, mas não prejudica.
          <React.Fragment key={item.label}>
            {renderNavItem(item)}
          </React.Fragment>
        ))}
      </nav>

      <div className="py-2 border-t border-gray-200 shrink-0">
        {/* renderNavItem já retorna um elemento com key, então não precisa de Fragment aqui */}
        {renderNavItem(settingsNavItem)}
      </div>
    </aside>
  );
}
