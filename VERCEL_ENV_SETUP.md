# Configuración para Vercel - IMPORTANTE

## Variables de Entorno Requeridas

Este proyecto requiere las siguientes variables de entorno en Vercel para que el botón de WhatsApp con hCaptcha funcione correctamente.

## Cómo Configurar en Vercel

### Paso 1: Acceder a la configuración
1. Ve a: https://vercel.com/dashboard
2. Selecciona el proyecto `alquiler_front`
3. Click en **Settings** (menú superior)
4. Click en **Environment Variables** (menú lateral izquierdo)

### Paso 2: Agregar las variables

#### Variable 1: Site Key (pública)
- **Name:** `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- **Value:** Copia el valor del archivo `.env.local` local
- **Environment:** Marca las 3 opciones:
  - ✅ Production
  - ✅ Preview  
  - ✅ Development
- Click **Save**

#### Variable 2: Secret Key (privada)
- **Name:** `HCAPTCHA_SECRET_KEY`
- **Value:** Copia el valor del archivo `.env.local` local
- **Environment:** Marca las 3 opciones:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Click **Save**

### Paso 3: Re-deployar
1. Ve a la sección **Deployments**
2. Encuentra el deployment más reciente
3. Click en el menú ⋮ (tres puntos)
4. Selecciona **Redeploy**
5. Confirma el redeploy

## ⚠️ Importante

- **NO** subas el archivo `.env.local` al repositorio
- Las credenciales están en tu archivo `.env.local` local
- Sin estas variables, el deployment en Vercel **FALLARÁ**
- Vercel automáticamente hará un nuevo deployment después de configurar las variables

## Verificación

Una vez configurado y redeployado:
1. El status del deployment debe cambiar a ✅ **Ready**
2. Prueba el botón de WhatsApp en el sitio deployado
3. El captcha debe aparecer correctamente
