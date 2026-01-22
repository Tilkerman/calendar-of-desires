import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const svgPath = join(rootDir, 'public', 'apple-touch-icon.svg');
const pngPath = join(rootDir, 'public', 'apple-touch-icon.png');

try {
  console.log('🔄 Конвертирую SVG в PNG...');
  
  const svgBuffer = readFileSync(svgPath);
  
  await sharp(svgBuffer)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 0, g: 206, b: 209, alpha: 1 } // бирюзовый фон #00CED1
    })
    .png()
    .toFile(pngPath);
  
  console.log('✅ Иконка создана: public/apple-touch-icon.png (180x180px)');
} catch (error) {
  console.error('❌ Ошибка при конвертации:', error.message);
  process.exit(1);
}

