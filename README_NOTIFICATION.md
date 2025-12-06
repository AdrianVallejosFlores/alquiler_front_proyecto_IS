# IU de Notificaciones (Next.js + TypeScript)

## Descripción del servicio

Este proyecto corresponde al **módulo de notificaciones** desarrollado con Next.js y TypeScript.  
Su propósito es ofrecer una interfaz gráfica sencilla y moderna que permite enviar notificaciones o correos electrónicos mediante un formulario integrado.

El usuario puede redactar un mensaje, elegir un destinatario y enviarlo a través de una API de GMAIL.  
El sistema fue diseñado para facilitar pruebas, automatizaciones y envío de mensajes dentro del entorno del sistema principal.

Objetivos principales
- Permitir el **envío de mensajes personalizados** a distintos destinatarios desde una interfaz web.
- Integrarse fácilmente con otros servicios backend o flujos de automatización con n8n
- Servir como entorno de pruebas para notificaciones antes de su despliegue en producción.
- Facilitar la comunicación interna o externa de los módulos del sistema principal.

## Estructura del proyecto##

src/
│
├── app/
│   └── notifications/
│       ├── image.png                  # Imagen ilustrativa
│       ├── page.tsx                   # Página principal del módulo (render de la interfaz)
│       ├── README.md                  # Documentación específica del submódulo
│       ├── SendNotificationForm.tsx   # Componente principal del formulario de notificaciones
│       ├── globals.css                # Hojas de estilo globales del módulo
│       ├── layout.tsx                 # Layout base o plantilla de estructura de página
│       └── README.md
│
└── lib/
    ├── api.ts                         # Configuración de llamadas a la API (endpoints, fetch, etc.)
    └── notifications.ts               # Funciones lógicas relacionadas con el envío de notificaciones


##Dependencias instaladas##
Dependencia	Descripción
next	Framework React para renderizado híbrido (SSR y SSG).
react	Librería base para la construcción de interfaces de usuario.
react-dom	Motor de renderizado del lado del cliente para React.
typescript	Sistema de tipado estático que mejora la mantenibilidad del código.
tailwindcss	Framework CSS utilitario para diseño adaptable y moderno.
postcss	Procesador CSS que permite aplicar transformaciones automáticas.
autoprefixer	Añade compatibilidad CSS entre diferentes navegadores automáticamente.
eslint	Herramienta para analizar y estandarizar el estilo y calidad del código.

**Requisitos previos**
Antes de ejecutar el proyecto, asegúrate de tener:

🟢 Node.js versión 20 o superior

🟣 npm o yarn instalados en tu entorno.

📁 Archivo .env.local configurado con las credenciales solamente necesarias, por ejemplo:

env
Copiar código
NEXT_PUBLIC_API_URL=http://localhost:5000
GMAIL_CLIENT_ID=tu_client_id
GMAIL_CLIENT_SECRET=tu_client_secret
GMAIL_REDIRECT_URI=http://localhost:4000/oauth/callback


**Instrucciones de instalación**
Clonar el repositorio

bash

Instalar dependencias

terminal
    npm install
Esto descargará automáticamente todas las dependencias listadas en el archivo package.json.

Verificar la estructura
Estar ubicado correctamente en la carpeta


**Instrucciones de ejecución**
Ejecutar el servidor en modo desarrollo

terminal

    npm run dev

Abrir el navegador
Por defecto, el servidor se levanta en:

http://localhost:3000
Probar el módulo de notificaciones
Accede a:

http://localhost:3000/notifications
Allí podrás visualizar el formulario interactivo para enviar mensajes o correos de prueba.


**Detalles de dependencias e instalables anotados**
npm install next react react-dom

npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p


























