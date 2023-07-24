import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { glob } from 'glob';
import sharp from 'sharp';
import parseDDS from 'parse-dds';
import decodeDXT from 'decode-dxt';

const inputDir = path.resolve(__dirname, './data/maps');
const outputDir = path.resolve(__dirname, '../dist');
mapsExtractor();

async function mapsExtractor() {
  await clean();
  await writeMapSizes();
  await writeMapImages();
  await writeMapImagePlaceholder();
  console.log('Done!');
}

async function writeMapSizes() {
  const mapFilePaths = await glob(path.join(inputDir, '*.elm.gz'));
  const mapSizes: Record<string, { width: number; height: number }> = {};

  for (const mapFilePath of mapFilePaths.sort()) {
    const mapName = path.basename(mapFilePath, '.elm.gz');
    const mapDataCompressed = await fs.readFile(mapFilePath);
    const mapData = zlib.gunzipSync(mapDataCompressed);

    // Read the size info from the map header.
    // Lifted from some of the scripts found here: https://github.com/feeltheburn/el-misc-tools
    mapSizes[mapName] = {
      width: mapData.readUInt32LE(4) * 6,
      height: mapData.readUInt32LE(8) * 6,
    };
  }

  await fs.writeFile(
    path.join(outputDir, 'map-sizes.js'),
    `window.mapSizes = ${JSON.stringify(mapSizes, null, 2)};\n`,
    'utf8'
  );
}

async function writeMapImages() {
  const mapFilePaths = await glob(path.join(inputDir, '*.dds'));

  for (const mapFilePath of mapFilePaths) {
    const mapName = path.basename(mapFilePath, '.dds');
    const ddsFile = await fs.readFile(mapFilePath);

    // Extract the first (largest) mipmap texture from the DDS file.
    const ddsInfo = parseDDS(ddsFile.buffer);
    const [image] = ddsInfo.images;
    const [imageWidth, imageHeight] = image.shape;
    const imageDataView = new DataView(
      ddsFile.buffer,
      image.offset,
      image.length
    );

    // Convert the DXT texture to RGBA pixel data.
    const rgbaData = decodeDXT(
      imageDataView,
      imageWidth,
      imageHeight,
      ddsInfo.format as any
    );

    // Write the raw RGBA data to file.
    await sharp(rgbaData, {
      raw: {
        width: imageWidth,
        height: imageHeight,
        channels: 4,
      },
    })
      .resize({ width: 300 })
      .toFile(path.join(outputDir, `map-image-${mapName}.jpg`));
  }
}

async function writeMapImagePlaceholder() {
  await sharp(
    Buffer.from(
      'ffd8ffdb00430006040506050406060506070706080a100a0a09090a140e0f0c1017141818171416161a1d251f1a1b231c1616202c20232627292a29191f2d302d283025282928ffdb0043010707070a080a130a0a13281a161a2828282828282828282828282828282828282828282828282828282828282828282828282828282828282828282828282828ffc00011080032003203012200021101031101ffc4001a000100030101010000000000000000000000040708010605ffc4002d100001040101070302070000000000000001000203040511060708121314213141512261152332627181a2ffc40014010100000000000000000000000000000000ffc40014110100000000000000000000000000000000ffda000c03010002110311003f00ca8888808b446ecf869c96d1e12b65b693267110d960921ab1c3d498b0fa39fa901848f3a793f3a7a2fafb5bc2a5bad4a4b1b2f9f6dcb0cf22adc87a7cff0060f048d7ec401f708330229376acf46e4f52e42f82cc0f31cb14834731c0e8411ec4151901111014bc64b057c9549adc3d7ad1cad7cb16ba73b0104b7fb1a8511105ff00be2e209fb71b26dc2e131f730ed7ccd7d893b80e32c601fcbf007824827f8d1587c17d2cf43b3d9bb57fb8660a7922ec592ebcae78e6ea3d80fb7e9048f048fda566bdd4e3f1395de260aa6d14d5e0c43ac07597d89447196341772b9c74001d00f5f75a2b891df0b70f8ca3b37bbec951e9d880f716f1d331fd0887d2226161d187c1f82069a7ca0a2f883b54aeef976a26c6b9afafdcb585cd3a8323636b64ff0061cabb5dd7e571011110111107badc9d6c05cde76160daf349b827f5bb837261145e21796f3389007d41ba79f5d02f5bc4a63b61f1f97c2b777d2625f59f0486cfe1d684ed0fe61a7310e3a1d3554c220222202222022220222202222022220fffd9',
      'hex'
    )
  ).toFile(path.resolve(outputDir, 'map-image-placeholder.jpg'));
}

async function clean() {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
}
