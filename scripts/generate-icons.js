const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const root = path.resolve(__dirname, "..");

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function makeIcon(size, maskable = false) {
  const pixels = Buffer.alloc(size * size * 4);
  const scale = size / 512;
  const setPixel = (x, y, color) => {
    const index = (y * size + x) * 4;
    pixels[index] = color[0];
    pixels[index + 1] = color[1];
    pixels[index + 2] = color[2];
    pixels[index + 3] = color[3] ?? 255;
  };
  const insideCircle = (x, y, cx, cy, radius) => (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const px = x / scale;
      const py = y / scale;
      let color = [19, 130, 63, 255];
      if (insideCircle(px, py, 192, 200, maskable ? 122 : 150)) color = [242, 93, 34, 255];
      const wave = 344 + 44 * Math.sin((px - 50) / 118);
      if (py > wave) color = [30, 167, 86, 255];
      const crossWidth = maskable ? 48 : 58;
      const cross = (Math.abs(px - 260) < crossWidth / 2 && py > 112 && py < 360)
        || (Math.abs(py - 205) < crossWidth / 2 && px > 176 && px < 344);
      if (cross) color = [255, 255, 255, 255];
      setPixel(x, y, color);
    }
  }

  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const rowOffset = y * (size * 4 + 1);
    raw[rowOffset] = 0;
    pixels.copy(raw, rowOffset + 1, y * size * 4, (y + 1) * size * 4);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

fs.writeFileSync(path.join(root, "app-icon-192.png"), makeIcon(192));
fs.writeFileSync(path.join(root, "app-icon-512.png"), makeIcon(512));
fs.writeFileSync(path.join(root, "app-icon-maskable-512.png"), makeIcon(512, true));
