// src/app/page.tsx
import Image from 'next/image';
import Link from 'next/link'; // Para links de navegação e CTAs
import { CheckCircle, ArrowRight, Mail } from 'lucide-react'; // Ícones para ilustrar

// Componente Header da Landing Page (pode ser movido para components/landing/header.tsx depois)
function LandingHeader() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            src="/logo_full.png" // Seu logo principal
            alt="Pipecor Logo"
            width={150}
            height={38}
            priority
          />
        </Link>
        <nav className="space-x-4 sm:space-x-6">
          {/* <Link href="#features" className="text-gray-600 hover:text-green-600">Funcionalidades</Link> */}
          {/* <Link href="#contact" className="text-gray-600 hover:text-green-600">Contato</Link> */}
          <Link
            href="/login" // Link para a página de login da aplicação
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
          >
            Acessar Plataforma
          </Link>
        </nav>
      </div>
    </header>
  );
}

// Componente Seção de Funcionalidades
function FeaturesSection() {
  const features = [
    { name: 'Cotações Inteligentes (com IA!)', icon: <CheckCircle className="text-green-500" />, description: 'Gere cotações precisas e personalizadas em minutos, otimizando seu tempo.' },
    { name: 'Pipeline de Vendas por Equipes e Individual', icon: <CheckCircle className="text-green-500" />, description: 'Tenha uma visão clara de todas as suas oportunidades e gerencie suas equipes com eficiência.' },
    { name: 'Administrativo e Financeiro Integrados', icon: <CheckCircle className="text-green-500" />, description: 'Simplifique o backoffice com ferramentas que unificam seus processos.' },
    { name: 'Gestão de Comissões Transparente', icon: <CheckCircle className="text-green-500" />, description: 'Acompanhe e gerencie suas comissões de forma clara e automatizada.' },
    { name: 'Comunicação Unificada (Email e WhatsApp)', icon: <CheckCircle className="text-green-500" />, description: 'Centralize a comunicação com seus clientes e leads diretamente na plataforma.' },
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
            Transforme sua Corretora de Saúde com Pipecor
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Descubra como nossas funcionalidades podem impulsionar seus resultados.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-3">
                {feature.icon}
                <h3 className="ml-3 text-xl font-semibold text-gray-800">{feature.name}</h3>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Componente Formulário de Lead Capture (placeholder)
function LeadCaptureForm() {
  // No futuro, você integrará isso com uma API route para salvar os emails
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    alert(`Obrigado por seu interesse! Email ${email} registrado. Avisaremos sobre as novidades.`);
    // Aqui você faria a chamada para a API:
    // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    (event.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Fique por Dentro das Novidades!
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Seja o primeiro a saber sobre o lançamento do Pipecor e receba atualizações exclusivas.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <label htmlFor="email-capture" className="sr-only">Seu melhor email</label>
          <input
            id="email-capture"
            type="email"
            name="email"
            required
            className="flex-grow px-4 py-3 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Seu melhor email"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition duration-150 flex items-center justify-center"
          >
            Quero Novidades <ArrowRight size={20} className="ml-2" />
          </button>
        </form>
      </div>
    </section>
  );
}


// Componente Footer da Landing Page
function LandingFooter() {
  return (
    <footer className="py-8 bg-gray-800 text-gray-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Image src="/icone.png" alt="Ícone Pipecor" width={40} height={40} className="mx-auto mb-2"/>
        <p>&copy; {new Date().getFullYear()} Pipecor. Todos os direitos reservados.</p>
        <p className="text-sm mt-1">Simplificando a gestão de corretoras de saúde.</p>
        {/* Adicionar links para Política de Privacidade, Termos, etc. no futuro */}
      </div>
    </footer>
  );
}


// Página Principal (Landing Page)
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-50 py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Pipecor: <span className="text-green-600">Revolucione</span> a Gestão da Sua Corretora de Saúde
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              O CRM completo e especializado que centraliza suas operações, do lead à comissão,
              para você focar no que realmente importa: vender mais.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="#contact" // Leva para a seção do formulário
                className="bg-green-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition duration-150 flex items-center"
              >
                Quero Ser o Primeiro a Saber <ArrowRight size={22} className="ml-2" />
              </Link>
              {/* <Link
                href="/docs" // Link para uma futura documentação ou "saiba mais"
                className="border border-green-600 text-green-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-green-50 transition duration-150"
              >
                Saiba Mais
              </Link> */}
            </div>
          </div>
        </section>

        {/* Seção de Problema/Solução (simplificada) */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
                Sua Corretora Merece Mais Eficiência e Menos Dor de Cabeça
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Planilhas confusas, sistemas desconectados, perda de tempo com tarefas manuais?
                O Pipecor foi desenhado para eliminar esses obstáculos e centralizar sua operação.
              </p>
            </div>
            {/* Poderia adicionar 2-3 cards aqui destacando Dores vs Soluções Pipecor */}
          </div>
        </section>

        <FeaturesSection />

       
      </main>

      <LandingFooter />
    </div>
  );
}