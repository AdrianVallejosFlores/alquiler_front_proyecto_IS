const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directorio donde guardaremos las imágenes
const OUTPUT_DIR = path.join(__dirname, '..', '..', '..', 'public', 'images', 'portfolio', 'decoracion');

// Asegurarse que el directorio existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Función para procesar y guardar una imagen
async function processImage(imageBuffer, filename) {
  try {
    await sharp(imageBuffer)
      .resize(800, 600, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat('jpeg', { quality: 85 })
      .toFile(path.join(OUTPUT_DIR, filename));
    
    console.log(`✅ Guardada: ${filename}`);
  } catch (error) {
    console.error(`❌ Error al procesar ${filename}:`, error);
  }
}

// Lista de imágenes a procesar (las proporciona el sistema en la variable attachments)
const images = [
  {
    buffer: attachments[0], // Imagen de boda con vista panorámica
    filename: 'boda-elegante.jpg'
  },
  {
    buffer: attachments[1], // Imagen de baby shower con ositos
    filename: 'babyshower-oso.jpg'
  },
  {
    buffer: attachments[2], // Imagen de Frozen
    filename: 'frozen-party.jpg'
  },
  {
    buffer: attachments[3], // Imagen de decoración rose gold
    filename: 'rosegold-party.jpg'
  }
];

// Procesar todas las imágenes
async function processAllImages() {
  console.log('📂 Guardando imágenes en:', OUTPUT_DIR);
  
  for (const image of images) {
    await processImage(image.buffer, image.filename);
  }
  
  console.log('✨ Proceso completado');
}

processAllImages().catch(console.error);