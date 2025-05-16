// src/app/(auth)/layout.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autenticação - Pipecor CRM', // Título genérico para as páginas de auth
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6">
      <div className="mb-8">
        <Link href="/" aria-label="Página Inicial Pipecor">
          <Image
            src="/logo_full.png" // Seu logo principal
            alt="Pipecor Logo"
            width={180}
            height={45}
            priority
          />
        </Link>
      </div>
      <div className="w-full max-w-md">
        {/* O conteúdo da página de login, signup ou forgot-password será renderizado aqui */}
        {children}
      </div>
      <p className="mt-8 text-center text-sm text-gray-600">
        Dúvidas ou precisa de ajuda?{' '}
        <Link href="/#contact" className="font-medium text-emerald-600 hover:text-emerald-700">
          Fale conosco
        </Link>
      </p>
       <p className="mt-2 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Pipecor. Todos os direitos reservados.
      </p>
    </div>
  );
}
