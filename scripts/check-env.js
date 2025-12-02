#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const requiredKeys = [
    'NEXT_PUBLIC_HCAPTCHA_SITE_KEY',
    'HCAPTCHA_SECRET_KEY'
];

const colors = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m'
};

console.log('Validando entorno...');

if (!fs.existsSync(envPath)) {
    console.error(colors.red, '[ERROR] No se encontró el archivo .env.local');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
let missingKeys = [];

requiredKeys.forEach(key => {
    
    const regex = new RegExp(`${key}=(.*)`);
    const match = envContent.match(regex);
    
    if (!match || !match[1] || match[1].trim() === '' || match[1].includes('tu-site-key') || match[1].includes('tu-secret-key')) {
        missingKeys.push(key);
    }
});

if (missingKeys.length > 0) {
    console.error(colors.red, '[ERROR] Faltan o son inválidas las siguientes variables:');
    missingKeys.forEach(k => console.error(` - ${k}`));
    console.log(colors.yellow, '\nPor favor verifica tus credenciales de hCaptcha en .env.local');
    process.exit(1);
}

console.log(colors.green, '✔ Configuración de entorno correcta.');