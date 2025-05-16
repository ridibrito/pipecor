// src/app/api/contacts/route.ts
import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Descomente quando for usar

export async function GET(request: Request) {
  // TODO: Implementar lógica para buscar contacts
  // Exemplo: const items = await prisma.contacts.findMany();
  return NextResponse.json({ message: 'GET request para /api/contacts' });
}

export async function POST(request: Request) {
  // TODO: Implementar lógica para criar contacts
  // Exemplo: const body = await request.json();
  // const newItem = await prisma.contacts.create({ data: body });
  // return NextResponse.json(newItem, { status: 201 });
  const body = await request.json();
  return NextResponse.json({ message: 'POST request para /api/contacts', data: body }, { status: 201 });
}
