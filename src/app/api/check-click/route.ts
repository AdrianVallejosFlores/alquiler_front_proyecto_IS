import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

    if (!siteKey) {
      console.error('❌ NEXT_PUBLIC_HCAPTCHA_SITE_KEY no está definida.');
      console.error('📝 Por favor, crea un archivo .env.local con la configuración de hCaptcha.');
      console.error('📖 Lee README_CAPTCHA.md para más información.');
      return NextResponse.json(
        { 
          error: 'Configuración de hCaptcha no encontrada. Por favor, configura las variables de entorno.',
          instructions: 'Consulta README_CAPTCHA.md para instrucciones de configuración.'
        },
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
