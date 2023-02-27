import fs from 'node:fs/promises';
import path from 'node:path';
import * as EL from 'eternal-lands.js';
import sharp from 'sharp';

const outputDir = path.resolve(__dirname, 'images');
itemImagesExtractor();

async function itemImagesExtractor() {
  await clean();
  await writeItemImages();
  await writeItemImageIds();
}

async function writeItemImageIds() {
  const itemNameToImageIds = Object.entries(EL.Constants.ItemNames).reduce(
    (map, entry) => {
      const itemId: EL.Constants.ItemId = Number(entry[0]);
      const itemName = entry[1];
      const imageId = EL.Constants.ItemImageIds[itemId];
      return { ...map, [itemName]: imageId };
    },
    {}
  );
  const jsonPath = path.join(outputDir, 'item-image-ids.json');

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    jsonPath,
    JSON.stringify(itemNameToImageIds, null, 2),
    'utf8'
  );
  console.log(`Saved ${jsonPath}`);
}

async function writeItemImages() {
  const imagesPerTexture = 25;
  const itemImageIds = new Set(Object.values(EL.Constants.ItemImageIds));

  for (const imageId of itemImageIds) {
    const index = imageId % imagesPerTexture;
    const texturePath = path.resolve(
      __dirname,
      `textures/items${Math.floor(imageId / imagesPerTexture) + 1}.png`
    );
    const imagePath = path.resolve(outputDir, `item-image-${imageId}.jpg`);

    await fs.mkdir(outputDir, { recursive: true });
    await sharp(texturePath)
      .extract({
        left: 50 * (index % 5),
        top: 50 * Math.floor(index / 5),
        width: 50,
        height: 50,
      })
      .toFile(imagePath);
    console.log(`Saved ${imagePath}`);
  }
}

async function clean() {
  await fs.rm(outputDir, { recursive: true, force: true });
}
