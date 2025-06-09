'use client';

import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';
import { logout } from '@/app/actions';
import { ChevronDown, UserCircle, LogOut } from 'lucide-react';

type UserNavProps = {
  userName: string;
  userEmail: string;
};

function getInitials(name: string) {
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.toUpperCase().slice(0, 2);
}

export function UserNav({ userName, userEmail }: UserNavProps) {
  const userInitials = getInitials(userName);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group w-full rounded-md px-3 py-2 text-sm text-left font-medium text-gray-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <div className="flex w-full items-center justify-between">
            <div className="flex min-w-0 items-center justify-between space-x-3">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
                <span className="text-sm font-semibold text-white">{userInitials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-200">{userName}</p>
                <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{userEmail}</p>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-zinc-700 rounded-md bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link href="/profile">
                  <button className={`${ active ? 'bg-indigo-500 text-white' : 'text-gray-900 dark:text-zinc-300' } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    <UserCircle className="mr-2 h-5 w-5" />
                    Perfil
                  </button>
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <form action={logout} className="w-full">
                  <button type="submit" className={`${ active ? 'bg-indigo-500 text-white' : 'text-gray-900 dark:text-zinc-300' } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                    <LogOut className="mr-2 h-5 w-5" />
                    Sair
                  </button>
                </form>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}