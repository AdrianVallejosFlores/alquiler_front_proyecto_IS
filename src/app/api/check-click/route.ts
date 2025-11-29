import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

    if (!siteKey) {
      return NextResponse.json(
        { error: 'Site key no configurada' },
        { status: 500 }
      );
    }

    return NextResponse.json({ siteKey });
  } catch (error) {
    console.error('Error en check-click:', error);
    return NextResponse.json(
      { error: 'Error al obtener la configuración' },
      { status: 500 }
    );
  }
}
