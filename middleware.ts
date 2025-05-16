// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const createSupabaseMiddlewareClient = (request: NextRequest, response: NextResponse) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
};

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname); // Para debugging, se necessário

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createSupabaseMiddlewareClient(request, response);

  console.log(`[Middleware] Executando para: ${request.nextUrl.pathname}`);

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('[Middleware] Erro ao buscar sessão Supabase:', sessionError.message);
    // Decide o que fazer em caso de erro ao buscar sessão.
    // Pode ser permitir acesso ou redirecionar para uma página de erro/login.
    // Por segurança, se não puder verificar a sessão, talvez redirecionar para login.
    // Mas isso pode causar loops se o erro for persistente.
    // Por enquanto, vamos deixar passar e focar na lógica de sessão nula/existente.
  }

  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Pathname: ${pathname}`);
  console.log('[Middleware] Sessão obtida:', session ? `Usuário ID: ${session.user.id}` : 'Nenhuma sessão');

  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/auth/callback',
    '/auth/update-password',
    // Adicione outros caminhos que são explicitamente públicos
  ];

  const isApiPublicRoute = pathname.startsWith('/api/landing-leads'); // Exemplo de API pública

  // Verifica se a rota atual é uma das rotas públicas definidas
  let isPublicRoute = publicRoutes.includes(pathname) || isApiPublicRoute;
  
  // Lógica para permitir acesso a assets dentro de /public (ex: /logo_full.png)
  // O matcher já deve excluir a maioria dos assets, mas como uma salvaguarda.
  if (!isPublicRoute && (pathname.startsWith('/_next/') || pathname.includes('.'))) {
    // Considera caminhos com extensões (ex: .png, .css) ou internos do Next.js como públicos
    // se não forem explicitamente rotas de página.
    // O matcher do config já faz um bom trabalho aqui, então esta verificação pode ser redundante.
    // console.log(`[Middleware] Rota de asset/interna detectada: ${pathname}, tratando como pública.`);
    // isPublicRoute = true; // CUIDADO: Isso pode tornar rotas de API com '.' públicas.
  }


  console.log(`[Middleware] A rota ${pathname} é pública? ${isPublicRoute}`);

  // Se NÃO há sessão E a rota NÃO é pública, redireciona para a página de login
  if (!session && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    if (pathname !== '/') {
        url.searchParams.set('redirectedFrom', pathname);
    }
    console.log(`[Middleware] SEM SESSÃO e ROTA NÃO PÚBLICA. Redirecionando de ${pathname} para ${url.pathname}`);
    return NextResponse.redirect(url);
  }

  // Se HÁ sessão E o usuário tenta acessar /login ou /signup, redireciona para o dashboard
  if (session && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    console.log(`[Middleware] SESSÃO EXISTE. Redirecionando de ${pathname} para ${url.pathname}`);
    return NextResponse.redirect(url);
  }

  console.log(`[Middleware] Permitindo acesso para: ${pathname}`);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js(?!on)|jpe?g|woff2?|ttf|ico|csv|docx?|xlsx?|zip|webmanifest)$).*)',
    '/(api|trpc)(.*)',
  ],
};
