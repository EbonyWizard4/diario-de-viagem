import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // Validação básica
  if (!filename) {
    return NextResponse.json({ error: 'Nome do arquivo não fornecido' }, { status: 400 });
  }

  try {
    // O request.body já é o stream/blob que enviamos do formulário
    const blob = await put(filename, request.body!, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Erro no Vercel Blob:", error);
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 });
  }
}