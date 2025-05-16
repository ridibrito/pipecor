// src/app/api/users/[userId]/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

type Context = {
  params: {
    userId: string;
  };
};

export async function GET(request: Request, context: Context) {
  const { userId } = context.params;
  // TODO: Implementar lógica para buscar user com id = userId
  // Exemplo: const item = await prisma.user.findUnique({ where: { id: userId } });
  return NextResponse.json({ message: `GET request para /api/users/${userId}` });
}

export async function PUT(request: Request, context: Context) {
  const { userId } = context.params;
  // TODO: Implementar lógica para atualizar user com id = userId
  // Exemplo: const body = await request.json();
  // const updatedItem = await prisma.user.update({ where: { id: userId }, data: body });
  // return NextResponse.json(updatedItem);
  const body = await request.json();
  return NextResponse.json({ message: `PUT request para /api/users/${userId}`, data: body });
}

export async function DELETE(request: Request, context: Context) {
  const { userId } = context.params;
  // TODO: Implementar lógica para deletar user com id = userId
  // Exemplo: await prisma.user.delete({ where: { id: userId } });
  // return new NextResponse(null, { status: 204 });
  return NextResponse.json({ message: `DELETE request para /api/users/${userId}` }, { status: 200 });
}
