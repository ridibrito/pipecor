// src/app/(app)/dashboard/page.tsx
'use client'; // Necessário para usar useState e useEffect

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  ClipboardList,
  BarChart3,
  UserCheck,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client'; // Nosso helper
import type { User } from '@supabase/supabase-js';

// Componente para os cards de KPI (pode ser movido para /components/ui/card.tsx ou similar)
interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description?: string;
  trend?: string;
  trendColor?: string;
}

const KpiCard = ({ title, value, icon: Icon, description, trend, trendColor }: KpiCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <Icon size={24} className="text-emerald-500" />
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      {trend && <p className={`text-xs ${trendColor || 'text-gray-500'} mt-2`}>{trend}</p>}
    </div>
  );
};

// Componente para seções do Dashboard
interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}
const DashboardSection = ({ title, children }: DashboardSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      <div>{children}</div>
    </div>
  );
};


export default function DashboardPage() {
  const supabase = createSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erro ao buscar sessão do usuário:", error.message);
      }
      setCurrentUser(session?.user ?? null);
      setIsLoadingUser(false);
    };

    fetchUser();

    // Opcional: ouvir mudanças no estado de autenticação se necessário nesta página específica
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  // Determina o nome a ser exibido
  const displayName = currentUser?.user_metadata?.full_name || currentUser?.email || "Usuário";

  // Placeholders para KPIs - variariam por papel
  const kpiData = [
    { title: 'Novos Leads (Hoje)', value: '12', icon: Zap, trend: '+2 vs ontem', trendColor: 'text-green-500' },
    { title: 'Negócios em Andamento', value: '78', icon: BarChart3, description: 'Valor total: R$ 350.000' },
    { title: 'Comissão Estimada (Mês)', value: 'R$ 12.500', icon: DollarSign, trend: '+R$1.2k vs mês passado', trendColor: 'text-green-500' },
    { title: 'Tarefas Pendentes', value: '5', icon: ClipboardList, trend: '2 atrasadas', trendColor: 'text-red-500'  },
  ];

  const recentActivities = [
    { text: "Lead 'Empresa Alpha' moveu para 'Proposta Enviada'", time: "2h atrás" },
    { text: "Contrato 'Cliente Beta' precisa de atenção - Pendência Documental", time: "Ontem", urgent: true },
    { text: "Reunião com 'Prospect Gamma' agendada para amanhã", time: "Amanhã às 10:00" },
  ];

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Carregando dashboard...</p>
        {/* Você pode adicionar um spinner aqui */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Bem-vindo(a) de volta, {displayName}!
        </h1>
        <p className="text-gray-600 mt-1">Aqui está um resumo da sua atividade e desempenho.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            description={kpi.description}
            trend={kpi.trend}
            trendColor={kpi.trendColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardSection title="Meu Funil de Vendas (Resumo)">
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              [Gráfico do Funil de Vendas Aqui]
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Este gráfico mostraria as etapas do seu funil e quantos negócios estão em cada uma.
            </p>
          </DashboardSection>

          <DashboardSection title="Atividades Recentes / Alertas">
            <ul className="space-y-3">
              {recentActivities.map((activity, index) => (
                <li key={index} className={`flex items-start space-x-3 p-3 rounded-md ${activity.urgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                  {activity.urgent ? <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" /> : <UserCheck size={20} className="text-blue-500 shrink-0 mt-0.5" />}
                  <div>
                    <p className={`text-sm ${activity.urgent ? 'text-red-700 font-medium' : 'text-gray-700'}`}>{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </DashboardSection>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <DashboardSection title="Próximas Tarefas">
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 p-2 border-b">Follow-up com Lead X - Hoje</li>
              <li className="text-sm text-gray-600 p-2 border-b">Enviar proposta para Empresa Y - Amanhã</li>
              <li className="text-sm text-gray-600 p-2">Preparar relatório mensal - 03/06</li>
            </ul>
            <Link href="/tasks" className="mt-4 inline-block text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              Ver todas as tarefas &rarr;
            </Link>
          </DashboardSection>

          <DashboardSection title="Ranking de Corretores (Exemplo Gestor)">
            <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              [Gráfico/Lista de Ranking Aqui]
            </div>
          </DashboardSection>
        </div>
      </div>
      <p className="text-xs text-center text-gray-500 mt-4">
        Nota: Este dashboard é uma representação visual. Os dados e widgets serão dinâmicos baseados no seu perfil e permissões.
      </p>
    </div>
  );
}
