// src/app/api/deals/[dealId]/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

type Context = {
  params: {
    dealId: string;
  };
};

export async function GET(request: Request, context: Context) {
  const { dealId } = context.params;
  // TODO: Implementar lógica para buscar deal com id = dealId
  // Exemplo: const item = await prisma.deal.findUnique({ where: { id: dealId } });
  return NextResponse.json({ message: `GET request para /api/deals/${dealId}` });
}

export async function PUT(request: Request, context: Context) {
  const { dealId } = context.params;
  // TODO: Implementar lógica para atualizar deal com id = dealId
  // Exemplo: const body = await request.json();
  // const updatedItem = await prisma.deal.update({ where: { id: dealId }, data: body });
  // return NextResponse.json(updatedItem);
  const body = await request.json();
  return NextResponse.json({ message: `PUT request para /api/deals/${dealId}`, data: body });
}

export async function DELETE(request: Request, context: Context) {
  const { dealId } = context.params;
  // TODO: Implementar lógica para deletar deal com id = dealId
  // Exemplo: await prisma.deal.delete({ where: { id: dealId } });
  // return new NextResponse(null, { status: 204 });
  return NextResponse.json({ message: `DELETE request para /api/deals/${dealId}` }, { status: 200 });
}
