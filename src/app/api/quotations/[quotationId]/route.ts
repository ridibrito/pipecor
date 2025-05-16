// src/app/api/quotations/[quotationId]/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

type Context = {
  params: {
    quotationId: string;
  };
};

export async function GET(request: Request, context: Context) {
  const { quotationId } = context.params;
  // TODO: Implementar lógica para buscar quotation com id = quotationId
  // Exemplo: const item = await prisma.quotation.findUnique({ where: { id: quotationId } });
  return NextResponse.json({ message: `GET request para /api/quotations/${quotationId}` });
}

export async function PUT(request: Request, context: Context) {
  const { quotationId } = context.params;
  // TODO: Implementar lógica para atualizar quotation com id = quotationId
  // Exemplo: const body = await request.json();
  // const updatedItem = await prisma.quotation.update({ where: { id: quotationId }, data: body });
  // return NextResponse.json(updatedItem);
  const body = await request.json();
  return NextResponse.json({ message: `PUT request para /api/quotations/${quotationId}`, data: body });
}

export async function DELETE(request: Request, context: Context) {
  const { quotationId } = context.params;
  // TODO: Implementar lógica para deletar quotation com id = quotationId
  // Exemplo: await prisma.quotation.delete({ where: { id: quotationId } });
  // return new NextResponse(null, { status: 204 });
  return NextResponse.json({ message: `DELETE request para /api/quotations/${quotationId}` }, { status: 200 });
}
