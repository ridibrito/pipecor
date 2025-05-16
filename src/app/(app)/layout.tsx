// src/app/(app)/layout.tsx
'use client';

import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import { useState, useEffect } from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getInitialSidebarLockState = () => {
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('sidebarLockedOpen');
      // Padrão: travada aberta em telas maiores, recolhida em menores
      const defaultState = window.innerWidth >= 1024 ? true : false;
      return storedState ? JSON.parse(storedState) : defaultState;
    }
    // Para SSR, ou antes do cliente carregar o localStorage
    // Começar com um estado consistente no servidor é importante.
    // Se o estado depende de window.innerWidth, o useEffect cuidará disso no cliente.
    return true; // Ou false, dependendo do comportamento inicial desejado no SSR
  };

  // Inicializa com um valor padrão para SSR, depois useEffect atualiza no cliente.
  const [isSidebarLockedOpen, setIsSidebarLockedOpen] = useState(true); 

  useEffect(() => {
    // Esta lógica roda apenas no cliente
    setIsSidebarLockedOpen(getInitialSidebarLockState());
  }, []); // Array de dependências vazio para rodar apenas no mount do cliente

  useEffect(() => {
    // Esta lógica roda apenas no cliente
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarLockedOpen', JSON.stringify(isSidebarLockedOpen));
    }
  }, [isSidebarLockedOpen]); // Roda sempre que isSidebarLockedOpen mudar

  const handleToggleSidebarLock = () => {
    setIsSidebarLockedOpen(prev => !prev);
  };

  // Classes de margem baseadas na largura da sidebar
  // Estas devem corresponder às classes w- no componente Sidebar
  const sidebarExpandedMargin = 'ml-64'; // Corresponde a w-64 (16rem)
  const sidebarCollapsedMargin = 'ml-20'; // Corresponde a w-20 (5rem)

  const mainContentMarginLeft = isSidebarLockedOpen ? sidebarExpandedMargin : sidebarCollapsedMargin;

  return (
    // Container geral da página da aplicação
    <div className="flex flex-col h-screen"> {/* Garante que o layout ocupe a tela inteira e seja flex col */}
      <Navbar onToggleSidebarLock={handleToggleSidebarLock} /> 
      
      {/* Container para Sidebar e Conteúdo Principal, abaixo da Navbar */}
      <div className="flex flex-1 overflow-hidden"> {/* flex-1 para ocupar espaço restante, overflow-hidden para conter */}
        <Sidebar
          isLockedOpen={isSidebarLockedOpen}
        />
        
        {/* Conteúdo Principal à direita da Sidebar */}
        <div 
          className={`
            flex-1 flex flex-col 
            transition-all duration-300 ease-in-out
            ${mainContentMarginLeft} 
            pt-16 {/* Padding no topo para compensar a altura da Navbar FIXA */}
            h-screen {/* Garante que esta div também tente ocupar a altura da tela */}
            overflow-y-auto {/* Permite scroll APENAS no conteúdo principal se ele for maior */}
          `}
        >
          <main className="flex-1 bg-gray-50 p-4 sm:p-6"> {/* Fundo e padding para a área de conteúdo */}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}