// scaffold.js
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd(); // Pega o diretório atual onde o script é executado

// Função para garantir que o diretório base 'src' exista
const srcDir = path.join(projectRoot, 'src');
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

// Conteúdo placeholder para diferentes tipos de arquivo
const getPageContent = (pageName, title) => {
  const capitalizedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  return `// Exemplo de caminho: src/app/(app)/${pageName.toLowerCase()}/page.tsx
export default function ${capitalizedPageName}Page() {
  return (
    <div>
      <h1>${title || capitalizedPageName}</h1>
      <p>Conteúdo para a página ${title || capitalizedPageName} virá aqui.</p>
    </div>
  );
}
`;
};

const getLayoutContent = (layoutName, isClientComponent = false) => {
  const capitalizedLayoutName = layoutName.charAt(0).toUpperCase() + layoutName.slice(1);
  const clientDirective = isClientComponent ? "'use client';\n\n" : "";
  return `${clientDirective}// Exemplo de caminho: src/app/(app)/${layoutName.toLowerCase()}/layout.tsx
export default function ${capitalizedLayoutName}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Elementos de layout comuns para ${layoutName} podem vir aqui */}
      {children}
    </div>
  );
}
`;
};

const getLoadingContent = () => `// loading.tsx
export default function Loading() {
  return <p>Carregando conteúdo...</p>;
}
`;

const getErrorContent = () => `// error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Algo deu errado!</h2>
      <p>{error.message || "Ocorreu um erro inesperado."}</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Tentar novamente
      </button>
    </div>
  );
}
`;

const getApiRouteContent = (resourceName) => {
  const capitalizedResource = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
  return `// src/app/api/${resourceName.toLowerCase()}/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

export async function GET(request: Request) {
  // TODO: Implementar lógica para buscar ${resourceName}
  // Exemplo: const items = await prisma.${resourceName.toLowerCase().replace('-', '_')}.findMany();
  return NextResponse.json({ message: 'GET request para /api/${resourceName.toLowerCase()}' });
}

export async function POST(request: Request) {
  // TODO: Implementar lógica para criar ${resourceName}
  // Exemplo: const body = await request.json();
  // const newItem = await prisma.${resourceName.toLowerCase().replace('-', '_')}.create({ data: body });
  // return NextResponse.json(newItem, { status: 201 });
  const body = await request.json();
  return NextResponse.json({ message: 'POST request para /api/${resourceName.toLowerCase()}', data: body }, { status: 201 });
}
`;
};

const getApiDynamicRouteContent = (resourceName, paramName) => {
  const singleResource = resourceName.endsWith('s') ? resourceName.slice(0, -1) : resourceName;
  const prismaModelName = singleResource.toLowerCase().replace('-', '_');
  return `// src/app/api/${resourceName.toLowerCase()}/[${paramName}]/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

type Context = {
  params: {
    ${paramName}: string;
  };
};

export async function GET(request: Request, context: Context) {
  const { ${paramName} } = context.params;
  // TODO: Implementar lógica para buscar ${singleResource} com id = ${paramName}
  // Exemplo: const item = await prisma.${prismaModelName}.findUnique({ where: { id: ${paramName} } });
  return NextResponse.json({ message: \`GET request para /api/${resourceName.toLowerCase()}/\${${paramName}}\` });
}

export async function PUT(request: Request, context: Context) {
  const { ${paramName} } = context.params;
  // TODO: Implementar lógica para atualizar ${singleResource} com id = ${paramName}
  // Exemplo: const body = await request.json();
  // const updatedItem = await prisma.${prismaModelName}.update({ where: { id: ${paramName} }, data: body });
  // return NextResponse.json(updatedItem);
  const body = await request.json();
  return NextResponse.json({ message: \`PUT request para /api/${resourceName.toLowerCase()}/\${${paramName}}\`, data: body });
}

export async function DELETE(request: Request, context: Context) {
  const { ${paramName} } = context.params;
  // TODO: Implementar lógica para deletar ${singleResource} com id = ${paramName}
  // Exemplo: await prisma.${prismaModelName}.delete({ where: { id: ${paramName} } });
  // return new NextResponse(null, { status: 204 });
  return NextResponse.json({ message: \`DELETE request para /api/${resourceName.toLowerCase()}/\${${paramName}}\` }, { status: 200 });
}
`;
};

const getEmptyComponentContent = (componentName) => {
  const capitalizedComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
  return `// Exemplo de caminho: src/components/ui/${componentName.toLowerCase()}.tsx
// import React from 'react'; // Para componentes mais complexos

export default function ${capitalizedComponentName}({ /* props */ }: any) {
  return (
    <div>
      <p>${capitalizedComponentName} Component</p>
    </div>
  );
}
`;
};


// Estrutura de arquivos e pastas a serem criados
const structure = {
  'src/app/(auth)/layout.tsx': getLayoutContent('Auth'),
  'src/app/(auth)/login/page.tsx': getPageContent('Login', 'Login'),
  'src/app/(auth)/forgot-password/page.tsx': getPageContent('ForgotPassword', 'Recuperar Senha'),
  'src/app/(auth)/signup/page.tsx': getPageContent('Signup', 'Cadastro Corretora/Usuário'),

  'src/app/(app)/layout.tsx': getLayoutContent('App'),
  'src/app/(app)/dashboard/page.tsx': getPageContent('Dashboard', 'Dashboard Principal'),
  'src/app/(app)/loading.tsx': getLoadingContent(),
  'src/app/(app)/error.tsx': getErrorContent(),

  'src/app/(app)/crm/layout.tsx': getLayoutContent('Crm'),
  'src/app/(app)/crm/leads/page.tsx': getPageContent('Leads', 'Leads'),
  'src/app/(app)/crm/leads/[leadId]/page.tsx': getPageContent('LeadDetail', 'Detalhe do Lead'),
  'src/app/(app)/crm/deals/page.tsx': getPageContent('Deals', 'Negócios/Oportunidades'),
  'src/app/(app)/crm/deals/[dealId]/page.tsx': getPageContent('DealDetail', 'Detalhe do Negócio'),
  'src/app/(app)/crm/contacts/page.tsx': getPageContent('Contacts', 'Contatos'),
  'src/app/(app)/crm/contacts/[contactId]/page.tsx': getPageContent('ContactDetail', 'Detalhe do Contato'),
  'src/app/(app)/crm/companies/page.tsx': getPageContent('Companies', 'Empresas'),
  'src/app/(app)/crm/companies/[companyId]/page.tsx': getPageContent('CompanyDetail', 'Detalhe da Empresa'),

  'src/app/(app)/quotations/page.tsx': getPageContent('Quotations', 'Cotações'),
  'src/app/(app)/quotations/new/page.tsx': getPageContent('NewQuotation', 'Nova Cotação'),
  'src/app/(app)/quotations/[quotationId]/page.tsx': getPageContent('QuotationDetail', 'Detalhe da Cotação'),

  'src/app/(app)/contracts/page.tsx': getPageContent('Contracts', 'Contratos'),
  'src/app/(app)/contracts/[contractId]/page.tsx': getPageContent('ContractDetail', 'Detalhe do Contrato'),

  'src/app/(app)/commissions/page.tsx': getPageContent('Commissions', 'Comissões'),

  'src/app/(app)/financial/layout.tsx': getLayoutContent('Financial'),
  'src/app/(app)/financial/overview/page.tsx': getPageContent('FinancialOverview', 'Visão Geral Financeira'),
  'src/app/(app)/financial/transactions/page.tsx': getPageContent('FinancialTransactions', 'Transações Financeiras'),
  'src/app/(app)/financial/reports/page.tsx': getPageContent('FinancialReports', 'Relatórios Financeiros'),

  'src/app/(app)/tasks/page.tsx': getPageContent('Tasks', 'Tarefas e Agenda'),
  'src/app/(app)/inbox/page.tsx': getPageContent('Inbox', 'Caixa de Entrada Unificada'),
  'src/app/(app)/reports/page.tsx': getPageContent('GeneralReports', 'Relatórios Gerais'),

  'src/app/(app)/marketing/layout.tsx': getLayoutContent('Marketing'),
  'src/app/(app)/marketing/forms/page.tsx': getPageContent('MarketingForms', 'Formulários de Captura'),
  'src/app/(app)/marketing/campaigns/page.tsx': getPageContent('MarketingCampaigns', 'Campanhas de Email'),
  'src/app/(app)/marketing/templates/email/page.tsx': getPageContent('EmailTemplates', 'Templates de Email'),
  'src/app/(app)/marketing/templates/whatsapp/page.tsx': getPageContent('WhatsappTemplates', 'Templates de WhatsApp'),

  'src/app/(app)/settings/layout.tsx': getLayoutContent('Settings'),
  'src/app/(app)/settings/account/page.tsx': getPageContent('SettingsAccount', 'Configurações da Corretora'),
  'src/app/(app)/settings/users/page.tsx': getPageContent('SettingsUsers', 'Gerenciar Usuários'),
  'src/app/(app)/settings/teams/page.tsx': getPageContent('SettingsTeams', 'Gerenciar Equipes'),
  'src/app/(app)/settings/pipelines/page.tsx': getPageContent('SettingsPipelines', 'Configurar Funis de Venda'),
  'src/app/(app)/settings/custom-fields/page.tsx': getPageContent('SettingsCustomFields', 'Campos Personalizados'),
  'src/app/(app)/settings/automations/page.tsx': getPageContent('SettingsAutomations', 'Automações'),
  'src/app/(app)/settings/integrations/page.tsx': getPageContent('SettingsIntegrations', 'Integrações'),
  'src/app/(app)/settings/billing/page.tsx': getPageContent('SettingsBilling', 'Assinatura Pipecor'),
  'src/app/(app)/profile/page.tsx': getPageContent('UserProfile', 'Meu Perfil'),

  // API Routes
  'src/app/api/auth/[...nextauth]/route.ts': "// Placeholder for NextAuth.js\nexport async function GET() {}\nexport async function POST() {}",
  'src/app/api/users/route.ts': getApiRouteContent('users'),
  'src/app/api/users/[userId]/route.ts': getApiDynamicRouteContent('users', 'userId'),
  'src/app/api/leads/route.ts': getApiRouteContent('leads'),
  'src/app/api/leads/[leadId]/route.ts': getApiDynamicRouteContent('leads', 'leadId'),
  'src/app/api/deals/route.ts': getApiRouteContent('deals'),
  'src/app/api/deals/[dealId]/route.ts': getApiDynamicRouteContent('deals', 'dealId'),
  'src/app/api/contacts/route.ts': getApiRouteContent('contacts'),
  'src/app/api/contacts/[contactId]/route.ts': getApiDynamicRouteContent('contacts', 'contactId'),
  'src/app/api/companies/route.ts': getApiRouteContent('companies'),
  'src/app/api/companies/[companyId]/route.ts': getApiDynamicRouteContent('companies', 'companyId'),
  'src/app/api/quotations/route.ts': getApiRouteContent('quotations'),
  'src/app/api/quotations/[quotationId]/route.ts': getApiDynamicRouteContent('quotations', 'quotationId'),
  'src/app/api/contracts/route.ts': getApiRouteContent('contracts'),
  'src/app/api/contracts/[contractId]/route.ts': getApiDynamicRouteContent('contracts', 'contractId'),
  'src/app/api/commissions/route.ts': getApiRouteContent('commissions'),
  'src/app/api/financial-transactions/route.ts': getApiRouteContent('financial-transactions'), // Note o hífen aqui


  // Componentes UI genéricos
  'src/components/ui/button.tsx': getEmptyComponentContent('Button'),
  'src/components/ui/input.tsx': getEmptyComponentContent('Input'),
  'src/components/ui/card.tsx': getEmptyComponentContent('Card'),
  'src/components/ui/modal.tsx': getEmptyComponentContent('Modal'),
  'src/components/ui/table.tsx': getEmptyComponentContent('Table'),
  'src/components/ui/select.tsx': getEmptyComponentContent('Select'),
  'src/components/ui/datepicker.tsx': getEmptyComponentContent('DatePicker'),
  'src/components/ui/alert.tsx': getEmptyComponentContent('Alert'),


  // Componentes de Layout
  'src/components/layout/sidebar.tsx': getEmptyComponentContent('Sidebar'),
  'src/components/layout/navbar.tsx': getEmptyComponentContent('Navbar'),
  'src/components/layout/page-header.tsx': getEmptyComponentContent('PageHeader'),

  // Componentes Específicos (exemplos)
  'src/components/specific/crm/lead-card.tsx': getEmptyComponentContent('LeadCard'),
  'src/components/specific/crm/deal-kanban-column.tsx': getEmptyComponentContent('DealKanbanColumn'),
  'src/components/specific/dashboard/kpi-widget.tsx': getEmptyComponentContent('KpiWidget'),


  // Libs adicionais (exemplo)
  'src/lib/auth.ts': "// src/lib/auth.ts\n// Configuração do NextAuth.js ou funções auxiliares de autenticação virão aqui.\nexport const authOptions = {}; // Exemplo para NextAuth",
  'src/lib/utils.ts': "// src/lib/utils.ts\n// Funções utilitárias gerais.\nexport function formatDate(date: Date): string {\n  return date.toLocaleDateString('pt-BR');\n}",
};

// Criar diretórios e arquivos
console.log('Iniciando a criação da estrutura de arquivos e pastas...');

for (const filePath in structure) {
  const fullPath = path.join(projectRoot, filePath);
  const dirName = path.dirname(fullPath);

  try {
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
      // console.log(`Diretório criado: ${dirName}`); // Descomente para log verboso
    }

    fs.writeFileSync(fullPath, structure[filePath]);
    // console.log(`Arquivo criado: ${fullPath}`); // Descomente para log verboso
  } catch (error) {
    console.error(`Erro ao criar ${fullPath}:`, error);
  }
}

// Criar globals.css se não existir (Next.js geralmente cria, mas para garantir)
const globalsCssPath = path.join(projectRoot, 'src/app/globals.css');
if (!fs.existsSync(globalsCssPath)) {
  try {
    fs.writeFileSync(globalsCssPath, `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Seus estilos globais adicionais aqui */\n`);
    console.log(`Arquivo criado: ${globalsCssPath}`);
  } catch (error) {
    console.error(`Erro ao criar ${globalsCssPath}:`, error);
  }
}

console.log('Criação da estrutura concluída! Verifique sua pasta src/.');