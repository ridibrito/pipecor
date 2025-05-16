// src/app/api/leads/[leadId]/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

type Context = {
  params: {
    leadId: string;
  };
};

export async function GET(request: Request, context: Context) {
  const { leadId } = context.params;
  // TODO: Implementar lógica para buscar lead com id = leadId
  // Exemplo: const item = await prisma.lead.findUnique({ where: { id: leadId } });
  return NextResponse.json({ message: `GET request para /api/leads/${leadId}` });
}

export async function PUT(request: Request, context: Context) {
  const { leadId } = context.params;
  // TODO: Implementar lógica para atualizar lead com id = leadId
  // Exemplo: const body = await request.json();
  // const updatedItem = await prisma.lead.update({ where: { id: leadId }, data: body });
  // return NextResponse.json(updatedItem);
  const body = await request.json();
  return NextResponse.json({ message: `PUT request para /api/leads/${leadId}`, data: body });
}

export async function DELETE(request: Request, context: Context) {
  const { leadId } = context.params;
  // TODO: Implementar lógica para deletar lead com id = leadId
  // Exemplo: await prisma.lead.delete({ where: { id: leadId } });
  // return new NextResponse(null, { status: 204 });
  return NextResponse.json({ message: `DELETE request para /api/leads/${leadId}` }, { status: 200 });
}
