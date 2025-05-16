// src/app/api/commissions/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

export async function GET(request: Request) {
  // TODO: Implementar lógica para buscar commissions
  // Exemplo: const items = await prisma.commissions.findMany();
  return NextResponse.json({ message: 'GET request para /api/commissions' });
}

export async function POST(request: Request) {
  // TODO: Implementar lógica para criar commissions
  // Exemplo: const body = await request.json();
  // const newItem = await prisma.commissions.create({ data: body });
  // return NextResponse.json(newItem, { status: 201 });
  const body = await request.json();
  return NextResponse.json({ message: 'POST request para /api/commissions', data: body }, { status: 201 });
}
