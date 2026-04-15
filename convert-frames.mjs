import sharp from 'sharp';
import { readdir } from 'fs/promises';
import path from 'path';

const SRC_DIR = './v';
const DEST_DIR = './public/hero-frames';

const files = (await readdir(SRC_DIR))
  .filter(f => f.startsWith('KBS') && f.endsWith('.png'))
  .sort();

console.log(`Found ${files.length} PNG frames to convert.`);

for (const file of files) {
  // KBS000.png -> frame-000.webp
  const num = file.replace('KBS', '').replace('.png', '');
  const outName = `frame-${num}.webp`;
  const srcPath = path.join(SRC_DIR, file);
  const destPath = path.join(DEST_DIR, outName);

  await sharp(srcPath)
    .webp({ quality: 80 })
    .toFile(destPath);

  console.log(`✓ ${file} -> ${outName}`);
}

console.log(`\nDone! Converted ${files.length} frames.`);
