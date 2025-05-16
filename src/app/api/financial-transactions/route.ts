// src/app/api/financial-transactions/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

export async function GET(request: Request) {
  // TODO: Implementar lógica para buscar financial-transactions
  // Exemplo: const items = await prisma.financial_transactions.findMany();
  return NextResponse.json({ message: 'GET request para /api/financial-transactions' });
}

export async function POST(request: Request) {
  // TODO: Implementar lógica para criar financial-transactions
  // Exemplo: const body = await request.json();
  // const newItem = await prisma.financial_transactions.create({ data: body });
  // return NextResponse.json(newItem, { status: 201 });
  const body = await request.json();
  return NextResponse.json({ message: 'POST request para /api/financial-transactions', data: body }, { status: 201 });
}
