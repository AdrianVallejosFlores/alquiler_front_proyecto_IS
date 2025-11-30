import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token no proporcionado' 
      }, { status: 400 });
    }

    // Usa la variable de entorno HCAPTCHA_SECRET_KEY
    const SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY;

    if (!SECRET_KEY) {
      console.error('❌ HCAPTCHA_SECRET_KEY no está definida en las variables de entorno');
      console.error('📝 Por favor, agrega HCAPTCHA_SECRET_KEY en tu archivo .env.local');
      console.error('📖 Lee README_CAPTCHA.md para obtener instrucciones detalladas.');
      return NextResponse.json({ 
        success: false, 
        error: 'Configuración del servidor incorrecta. Las variables de entorno de hCaptcha no están configuradas.' 
      }, { status: 500 });
    }

    const verifyResponse = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: SECRET_KEY,
        response: token,
      }),
    });

    const data = await verifyResponse.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      console.error('Error hCaptcha:', data['error-codes']);
      return NextResponse.json({ 
        success: false, 
        error: 'Captcha inválido' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error del servidor:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error del servidor' 
    }, { status: 500 });
  }
}
