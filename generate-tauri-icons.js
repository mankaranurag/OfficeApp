import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const iconsDir = path.resolve('src-tauri', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// DevPulse brand colors (RGBA)
const BRAND = { r: 0x11, g: 0x13, b: 0x17, a: 0xff };
const ACCENT = { r: 0x3b, g: 0x82, b: 0xf6, a: 0xff };

const crcTable = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// Solid brand square with an accent diagonal band, as RGBA rows.
function pixels(size) {
  const data = Buffer.alloc(size * size * 4);
  const bandWidth = Math.max(2, size / 8);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const c = Math.abs(x - y) < bandWidth ? ACCENT : BRAND;
      const o = (y * size + x) * 4;
      data[o] = c.r;
      data[o + 1] = c.g;
      data[o + 2] = c.b;
      data[o + 3] = c.a;
    }
  }
  return data;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(size) {
  const rgba = pixels(size);
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(stride * size);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0; // filter type: none
    rgba.copy(raw, y * stride + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// 32bpp BMP DIB (bottom-up BGRA plus AND mask) as stored inside an .ico entry.
function dibEntry(size) {
  const rgba = pixels(size);
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8); // height field includes the AND mask
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  const xor = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    const src = (size - 1 - y) * size * 4;
    for (let x = 0; x < size; x++) {
      const o = (y * size + x) * 4;
      xor[o] = rgba[src + x * 4 + 2];
      xor[o + 1] = rgba[src + x * 4 + 1];
      xor[o + 2] = rgba[src + x * 4];
      xor[o + 3] = rgba[src + x * 4 + 3];
    }
  }
  const and = Buffer.alloc((((size + 31) >> 5) * 4) * size); // zeroed = fully opaque
  return Buffer.concat([header, xor, and]);
}

function encodeIco(sizes) {
  const images = sizes.map(dibEntry);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  const dir = Buffer.alloc(16 * sizes.length);
  let offset = header.length + dir.length;
  sizes.forEach((size, i) => {
    const o = i * 16;
    dir[o] = size >= 256 ? 0 : size;
    dir[o + 1] = size >= 256 ? 0 : size;
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(images[i].length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += images[i].length;
  });
  return Buffer.concat([header, dir, ...images]);
}

function encodeIcns(size, type) {
  const png = encodePng(size);
  const entry = Buffer.alloc(8);
  entry.write(type, 0, 'ascii');
  entry.writeUInt32BE(png.length + 8, 4);
  const header = Buffer.alloc(8);
  header.write('icns', 0, 'ascii');
  header.writeUInt32BE(png.length + 16, 4);
  return Buffer.concat([header, entry, png]);
}

fs.writeFileSync(path.join(iconsDir, '32x32.png'), encodePng(32));
fs.writeFileSync(path.join(iconsDir, '128x128.png'), encodePng(128));
fs.writeFileSync(path.join(iconsDir, '128x128@2x.png'), encodePng(256));
fs.writeFileSync(path.join(iconsDir, 'icon.png'), encodePng(512));
fs.writeFileSync(path.join(iconsDir, 'icon.ico'), encodeIco([16, 32, 48, 64, 128, 256]));
fs.writeFileSync(path.join(iconsDir, 'icon.icns'), encodeIcns(128, 'ic07'));

console.log('Tauri icons created successfully in src-tauri/icons/');
