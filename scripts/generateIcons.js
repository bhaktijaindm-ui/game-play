/**
 * Glam Blocks - Icon & Asset Generator Script (SVG + PNG)
 * Renders authentic PNG icons for: 48, 72, 96, 144, 192, 512, and 512-maskable
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, '../public/icons/logo.svg');
const logoSvg = fs.readFileSync(logoPath, 'utf8');

const sizes = [48, 72, 96, 144, 192, 512];
const iconsDir = path.join(__dirname, '../public/icons');

async function buildAllIcons() {
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // 1. Generate PNGs for standard sizes
  for (const size of sizes) {
    const pngBuffer = await sharp(Buffer.from(logoSvg))
      .resize(size, size)
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), pngBuffer);
    console.log(`Rendered icon-${size}.png`);
  }

  // 2. Generate 512 Maskable PNG
  const maskableSvg = logoSvg
    .replace('rx="112"', 'rx="0"')
    .replace('x="24" y="24" width="464" height="464"', 'x="0" y="0" width="512" height="512"');

  const maskablePng = await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(iconsDir, 'icon-512-maskable.png'), maskablePng);
  console.log('Rendered icon-512-maskable.png');

  // Also write favicon.ico / favicon.png
  const faviconBuffer = await sharp(Buffer.from(logoSvg)).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, '../public/favicon.png'), faviconBuffer);

  console.log('✅ All PNG & SVG icons successfully created!');
}

buildAllIcons().catch((err) => {
  console.error('Error generating icons:', err);
});
