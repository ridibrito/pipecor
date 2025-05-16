// src/components/ui/Drawer.tsx
'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'screen-75' | 'screen-90'; // Ajustadas opções de tamanho
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md', 
}: DrawerProps) {
  const sizeClasses = {
    sm: 'max-w-sm', // 384px
    md: 'max-w-md', // 512px
    lg: 'max-w-lg', // 576px
    xl: 'max-w-xl', // 672px
    '2xl': 'max-w-2xl', // 768px
    // Ajustando para usar porcentagens mais diretas em telas maiores
    'screen-75': 'w-full md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-5xl', // Ex: 75% em md, 66% em lg, 50% em xl, com um max geral
    'screen-90': 'w-full md:w-11/12 lg:w-5/6 xl:w-3/4 max-w-6xl', // Ex: ~90% em md, ~83% em lg, 75% em xl
  };

  const positionClasses = position === 'right' ? 'right-0' : 'left-0';
  const transformEnterFrom = position === 'right' ? 'translate-x-full' : '-translate-x-full';
  const transformEnterTo = 'translate-x-0';
  const transformLeaveFrom = 'translate-x-0';
  const transformLeaveTo = position === 'right' ? 'translate-x-full' : '-translate-x-full';

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={`pointer-events-none fixed inset-y-0 flex ${position === 'right' ? 'right-0' : 'left-0'} ${sizeClasses[size]}`}>
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-500"
                enterFrom={transformEnterFrom}
                enterTo={transformEnterTo}
                leave="transform transition ease-in-out duration-300 sm:duration-500"
                leaveFrom={transformLeaveFrom}
                leaveTo={transformLeaveTo}
              >
                {/* A largura real é controlada pelo div pai acima (com sizeClasses[size]) */}
                <Dialog.Panel className={`pointer-events-auto w-full`}> 
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
                    <div className="py-4 px-4 sm:px-6 sticky top-0 z-10 bg-white border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        {title && (
                          <Dialog.Title className="text-lg font-semibold text-gray-800">
                            {title}
                          </Dialog.Title>
                        )}
                        <div className={`ml-auto ${!title ? 'w-full flex justify-end' : ''}`}>
                          <button
                            type="button"
                            className="rounded-md p-1 text-gray-900 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Fechar painel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 py-6 px-4 sm:px-6">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
