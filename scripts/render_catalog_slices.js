const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, '..', 'ALPHA Medical Supplies Store (4).svg');
const tempDir = 'C:\\Users\\Hp\\.gemini\\antigravity-ide\\brain\\6242f05c-ec05-4bdb-b93f-f69eb6f3f7eb\\.tempmediaStorage';

async function renderCatalogSlices() {
  console.log('Rendering Catalog SVG to buffer...');
  const imgBuffer = await sharp(svgPath, { density: 72 })
    .resize(1440)
    .png()
    .toBuffer();

  const meta = await sharp(imgBuffer).metadata();
  console.log('Rendered dimensions:', meta.width, 'x', meta.height);

  const totalSlices = 4;
  const sliceHeight = Math.floor(meta.height / totalSlices);

  for (let i = 0; i < totalSlices; i++) {
    const top = i * sliceHeight;
    const height = Math.min(sliceHeight, meta.height - top);
    const outFile = path.join(tempDir, `catalog_slice_${i+1}.png`);
    await sharp(imgBuffer)
      .extract({ left: 0, top, width: meta.width, height })
      .toFile(outFile);
    console.log(`Saved catalog_slice_${i+1}.png (top: ${top}, h: ${height})`);
  }
}

renderCatalogSlices().catch(err => {
  console.error('Error rendering catalog SVG:', err.message);
});
