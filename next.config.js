/** Next.js config: forzar turbopack.root al directorio del proyecto para evitar el warning */
const path = require('path');

module.exports = {
  turbopack: {
    // ajustar a la ruta raíz real de tu proyecto
    root: path.resolve(__dirname),
  },
};
