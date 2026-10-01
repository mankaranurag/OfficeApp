import fs from 'fs';
import path from 'path';

const iconsDir = path.resolve('src-tauri', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Minimal valid PNG buffer
const png1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// Minimal valid ICO buffer (single 16x16 32bpp)
const icoBuffer = Buffer.from([
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00,
  0x68, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00, 0x00, 0x00, 0x10, 0x00,
  0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

fs.writeFileSync(path.join(iconsDir, '32x32.png'), png1x1);
fs.writeFileSync(path.join(iconsDir, '128x128.png'), png1x1);
fs.writeFileSync(path.join(iconsDir, '128x128@2x.png'), png1x1);
fs.writeFileSync(path.join(iconsDir, 'icon.png'), png1x1);
fs.writeFileSync(path.join(iconsDir, 'icon.ico'), icoBuffer);
fs.writeFileSync(path.join(iconsDir, 'icon.icns'), png1x1);

console.log('Tauri icons created successfully in src-tauri/icons/');
