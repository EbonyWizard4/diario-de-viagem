// src/app/api/upload/route.ts
import { put } from "@vercel/blob";
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    //conexão teste para o vercel blob
    const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename || !request.body) {
        return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 });
    }

    // Envia o arquivo para o armazenamento da Vercel
    const blob = await put(filename, request.body, {
        access: 'public',
    });

    return NextResponse.json(blob);
}