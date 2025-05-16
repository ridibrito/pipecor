// src/app/api/contacts/[contactId]/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

type Context = {
  params: {
    contactId: string;
  };
};

export async function GET(request: Request, context: Context) {
  const { contactId } = context.params;
  // TODO: Implementar lógica para buscar contact com id = contactId
  // Exemplo: const item = await prisma.contact.findUnique({ where: { id: contactId } });
  return NextResponse.json({ message: `GET request para /api/contacts/${contactId}` });
}

export async function PUT(request: Request, context: Context) {
  const { contactId } = context.params;
  // TODO: Implementar lógica para atualizar contact com id = contactId
  // Exemplo: const body = await request.json();
  // const updatedItem = await prisma.contact.update({ where: { id: contactId }, data: body });
  // return NextResponse.json(updatedItem);
  const body = await request.json();
  return NextResponse.json({ message: `PUT request para /api/contacts/${contactId}`, data: body });
}

export async function DELETE(request: Request, context: Context) {
  const { contactId } = context.params;
  // TODO: Implementar lógica para deletar contact com id = contactId
  // Exemplo: await prisma.contact.delete({ where: { id: contactId } });
  // return new NextResponse(null, { status: 204 });
  return NextResponse.json({ message: `DELETE request para /api/contacts/${contactId}` }, { status: 200 });
}
