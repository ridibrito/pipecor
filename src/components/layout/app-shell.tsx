'use client';

import { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Navbar from './navbar';

type AppShellProps = {
  userName: string;
  userEmail: string;
  children: React.ReactNode;
};

export function AppShell({ userName, userEmail, children }: AppShellProps) {
  const getInitialSidebarState = () => {
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('sidebarLockedOpen');
      const defaultState = window.innerWidth >= 1024;
      return storedState ? JSON.parse(storedState) : defaultState;
    }
    return true;
  };

  const [isLockedOpen, setIsLockedOpen] = useState(true);

  useEffect(() => {
    setIsLockedOpen(getInitialSidebarState());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarLockedOpen', JSON.stringify(isLockedOpen));
    }
  }, [isLockedOpen]);

  const handleToggleSidebarLock = () => {
    setIsLockedOpen((prev) => !prev);
  };

  const sidebarExpandedMargin = 'lg:ml-64';
  const sidebarCollapsedMargin = 'lg:ml-20';
  const mainContentMarginLeft = isLockedOpen ? sidebarExpandedMargin : sidebarCollapsedMargin;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Navbar fica no topo de tudo */}
      <Navbar userName={userName} userEmail={userEmail} />
      
      {/* Sidebar fica fixa no seu lugar */}
      <Sidebar 
        isLockedOpen={isLockedOpen} 
        onToggleLock={handleToggleSidebarLock} 
      />
      
      {/* Conteúdo principal é empurrado para a direita pela sidebar e para baixo pela navbar */}
      <div className={`pt-16 transition-all duration-300 ease-in-out ${mainContentMarginLeft}`}>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}