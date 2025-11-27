import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const targetDir = './public/images/portfolio/decoracion';

// Crear las imágenes de ejemplo (por ahora usaremos un gradiente SVG simple)
const createSampleImage = (color1, color2, text) => `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
    ${text}
  </text>
</svg>`;

const images = [
  {
    filename: 'restauracion-silla.jpg',
    content: createSampleImage('#795548', '#5D4037', 'Restauración de Silla')
  },
  {
    filename: 'mueble-modular.jpg',
    content: createSampleImage('#8D6E63', '#6D4C41', 'Mueble Modular')
  },
  {
    filename: 'mesa-comedor.jpg',
    content: createSampleImage('#A1887F', '#8D6E63', 'Mesa de Comedor')
  },
  {
    filename: 'set-sillas.jpg',
    content: createSampleImage('#BCAAA4', '#A1887F', 'Set de Sillas')
  }
];

async function saveImages() {
  try {
    // Crear el directorio si no existe
    await mkdir(targetDir, { recursive: true });
    console.log('📂 Directorio creado:', targetDir);

    // Guardar cada imagen
    for (const image of images) {
      const filepath = join(targetDir, image.filename);
      await writeFile(filepath, image.content);
      console.log(`✅ Guardada: ${image.filename}`);
    }

    console.log('✨ Todas las imágenes han sido guardadas');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

saveImages();