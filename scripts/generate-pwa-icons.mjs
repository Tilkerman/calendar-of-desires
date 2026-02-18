import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const inputPng = join(rootDir, 'src', 'assets', 'Мандала.png');
const outDir = join(rootDir, 'public');

async function write(size, name) {
  const outPath = join(outDir, name);
  await sharp(inputPng)
    .resize(size, size, { fit: 'contain', background: { r: 88, g: 200, b: 199, alpha: 1 } }) // #58C8C7
    .png()
    .toFile(outPath);
  console.log(`✅ ${name} (${size}x${size})`);
}

console.log('🔄 Generating PWA icons from src/assets/Мандала.png ...');
await write(180, 'apple-touch-icon.png');
await write(192, 'icon-192.png');
await write(512, 'icon-512.png');
await write(32, 'favicon-32.png');
await write(16, 'favicon-16.png');




