// src/app/api/companies/[companyId]/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

type Context = {
  params: {
    companyId: string;
  };
};

export async function GET(request: Request, context: Context) {
  const { companyId } = context.params;
  // TODO: Implementar lógica para buscar companie com id = companyId
  // Exemplo: const item = await prisma.companie.findUnique({ where: { id: companyId } });
  return NextResponse.json({ message: `GET request para /api/companies/${companyId}` });
}

export async function PUT(request: Request, context: Context) {
  const { companyId } = context.params;
  // TODO: Implementar lógica para atualizar companie com id = companyId
  // Exemplo: const body = await request.json();
  // const updatedItem = await prisma.companie.update({ where: { id: companyId }, data: body });
  // return NextResponse.json(updatedItem);
  const body = await request.json();
  return NextResponse.json({ message: `PUT request para /api/companies/${companyId}`, data: body });
}

export async function DELETE(request: Request, context: Context) {
  const { companyId } = context.params;
  // TODO: Implementar lógica para deletar companie com id = companyId
  // Exemplo: await prisma.companie.delete({ where: { id: companyId } });
  // return new NextResponse(null, { status: 204 });
  return NextResponse.json({ message: `DELETE request para /api/companies/${companyId}` }, { status: 200 });
}
