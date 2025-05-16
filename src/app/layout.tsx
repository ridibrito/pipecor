// src/app/layout.tsx
import { type Metadata } from 'next'
// Supondo que você quer usar Geist Sans como principal e Geist Mono opcionalmente
import { GeistSans } from 'geist/font/sans'; // Importação correta para Geist
import { GeistMono } from 'geist/font/mono';   // Importação correta para Geist Mono
import './globals.css'
// Remova o import do NextAuthProvider se você o removeu ao mudar para Supabase Auth direto
// import { NextAuthProvider } from './providers'; // Se você ainda tem isso e usa Supabase Auth, pode remover

export const metadata: Metadata = {
  title: 'Pipecor CRM', // Atualize para o título correto
  description: 'CRM especializado para corretoras de planos de saúde',
  icons: {
    icon: '/icone.png', // Certifique-se que public/icone.png existe
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Aplica a classe da fonte principal diretamente ao HTML
    // Disponibiliza a fonte mono como uma variável CSS para uso com Tailwind
    <html lang="pt-BR" className={`${GeistSans.className} ${GeistMono.variable}`}>
      <body className="antialiased"> {/* antialiased é uma boa prática */}
        {/* Se você não tem um provider específico do Supabase para envolver aqui,
            pode ser apenas {children}. Se o Supabase Auth precisar de um provider
            no nível raiz para Client Components, ele viria aqui. */}
        {children}
      </body>
    </html>
  )
}