import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// src/app/api/upload/route.ts
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    console.log("📡 API de Upload recebendo arquivo:", filename);

    if (!filename) return NextResponse.json({ error: 'Nome ausente' }, { status: 400 });

    // Tenta fazer o 'put' e captura o erro específico da biblioteca
    const blob = await put(filename, request.body!, {
      access: 'public',
      // Se você manteve o nome personalizado do token:
      token: process.env.TCC_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN
    });

    console.log("🚀 Vercel Blob confirmou o upload!");
    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("🔥 ERRO FATAL NO VERCEL BLOB:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}