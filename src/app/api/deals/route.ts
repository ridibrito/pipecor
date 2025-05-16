// src/app/api/deals/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

export async function GET(request: Request) {
  // TODO: Implementar lógica para buscar deals
  // Exemplo: const items = await prisma.deals.findMany();
  return NextResponse.json({ message: 'GET request para /api/deals' });
}

export async function POST(request: Request) {
  // TODO: Implementar lógica para criar deals
  // Exemplo: const body = await request.json();
  // const newItem = await prisma.deals.create({ data: body });
  // return NextResponse.json(newItem, { status: 201 });
  const body = await request.json();
  return NextResponse.json({ message: 'POST request para /api/deals', data: body }, { status: 201 });
}
