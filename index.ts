import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { glob } from 'glob';
import sharp from 'sharp';

const inputDir = path.resolve(__dirname, 'maps');
const outputDir = path.resolve(__dirname, 'dist');
mapsExtractor();

async function mapsExtractor() {
  await clean();
  await writeMapSizes();
  await writeMapImages();
  console.log('Done!');
}

async function writeMapSizes() {
  const mapFiles = await glob(path.join(inputDir, '*.elm.gz'));
  const mapSizes: Record<string, { width: number; height: number }> = {};

  for (const mapFile of mapFiles) {
    const mapName = path.basename(mapFile, '.elm.gz');
    const mapDataCompressed = await fs.readFile(mapFile);
    const mapData = zlib.gunzipSync(mapDataCompressed);
    const mapWidth = mapData.readUInt32LE(4) * 6;
    const mapHeight = mapData.readUInt32LE(8) * 6;
    mapSizes[mapName] = { width: mapWidth, height: mapHeight };
  }

  await fs.writeFile(
    path.join(outputDir, 'map-sizes.js'),
    `window.mapSizes = ${JSON.stringify(mapSizes, null, 2)};\n`,
    'utf8'
  );
}

async function writeMapImages() {
  const mapFiles = await glob(path.join(inputDir, '*.png'));

  for (const mapFile of mapFiles) {
    const mapName = path.basename(mapFile, '.png');
    await sharp(mapFile)
      .resize({ width: 300 })
      .toFile(path.join(outputDir, `${mapName}.jpg`));
  }
}

async function clean() {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
}
