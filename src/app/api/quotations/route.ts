// src/app/api/quotations/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

export async function GET(request: Request) {
  // TODO: Implementar lógica para buscar quotations
  // Exemplo: const items = await prisma.quotations.findMany();
  return NextResponse.json({ message: 'GET request para /api/quotations' });
}

export async function POST(request: Request) {
  // TODO: Implementar lógica para criar quotations
  // Exemplo: const body = await request.json();
  // const newItem = await prisma.quotations.create({ data: body });
  // return NextResponse.json(newItem, { status: 201 });
  const body = await request.json();
  return NextResponse.json({ message: 'POST request para /api/quotations', data: body }, { status: 201 });
}
