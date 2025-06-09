'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, type Dispatch, type SetStateAction } from 'react';
import { X } from 'lucide-react';
type DrawerProps = { isOpen: boolean; setIsOpen: (value: boolean) => void; title: string; children: React.ReactNode; };
export function Drawer({ isOpen, setIsOpen, title, children }: DrawerProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden"><div className="absolute inset-0 overflow-hidden"><div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-x-0" leaveTo="translate-x-full">
            <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl"><div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-zinc-900 shadow-xl">
              <div className="bg-indigo-600 px-4 py-6 sm:px-6"><div className="flex items-center justify-between">
                <Dialog.Title className="text-base font-semibold leading-6 text-white">{title}</Dialog.Title>
                <div className="ml-3 flex h-7 items-center">
                  <button type="button" className="relative rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" onClick={() => setIsOpen(false)}>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div></div>
              <div className="relative flex-1 px-4 py-6 sm:px-6">{children}</div>
            </div></Dialog.Panel>
          </Transition.Child>
        </div></div></div>
      </Dialog>
    </Transition.Root>
  );
}