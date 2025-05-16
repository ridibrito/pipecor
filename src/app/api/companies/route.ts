// src/app/api/companies/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

export async function GET(request: Request) {
  // TODO: Implementar lógica para buscar companies
  // Exemplo: const items = await prisma.companies.findMany();
  return NextResponse.json({ message: 'GET request para /api/companies' });
}

export async function POST(request: Request) {
  // TODO: Implementar lógica para criar companies
  // Exemplo: const body = await request.json();
  // const newItem = await prisma.companies.create({ data: body });
  // return NextResponse.json(newItem, { status: 201 });
  const body = await request.json();
  return NextResponse.json({ message: 'POST request para /api/companies', data: body }, { status: 201 });
}
