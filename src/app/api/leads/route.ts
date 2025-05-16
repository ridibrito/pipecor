// src/app/api/leads/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

export async function GET(request: Request) {
  // TODO: Implementar lógica para buscar leads
  // Exemplo: const items = await prisma.leads.findMany();
  return NextResponse.json({ message: 'GET request para /api/leads' });
}

export async function POST(request: Request) {
  // TODO: Implementar lógica para criar leads
  // Exemplo: const body = await request.json();
  // const newItem = await prisma.leads.create({ data: body });
  // return NextResponse.json(newItem, { status: 201 });
  const body = await request.json();
  return NextResponse.json({ message: 'POST request para /api/leads', data: body }, { status: 201 });
}
