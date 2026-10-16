const fs = require('fs');
const content = fs.readFileSync('ALPHA Medical Supplies Store (4).svg', 'utf8');
const images = content.match(/<image[^>]+>/g) || [];
images.forEach((img, i) => {
  const w = img.match(/width="([^"]+)"/)?.[1];
  const h = img.match(/height="([^"]+)"/)?.[1];
  const x = img.match(/x="([^"]+)"/)?.[1];
  const y = img.match(/y="([^"]+)"/)?.[1];
  const id = img.match(/id="([^"]+)"/)?.[1];
  console.log('Image', i, { id, w, h, x, y, len: img.length });
});

// Also check <use> tags that reference this image
if (images.length > 0) {
  const imgId = images[0].match(/id="([^"]+)"/)?.[1];
  console.log('Looking for uses of', imgId);
  const uses = content.match(new RegExp(`<use[^>]+href="#?${imgId}"[^>]*>`, 'g')) || [];
  console.log('Found uses:', uses.length);
  uses.forEach((u, idx) => console.log('Use', idx, u));

  // Also check pattern
  const patterns = content.match(new RegExp(`<pattern[^>]+id="([^"]+)"[\\s\\S]*?href="#?${imgId}"[\\s\\S]*?</pattern>`, 'g')) || [];
  console.log('Found patterns:', patterns.length);
  patterns.forEach((p, idx) => console.log('Pattern', idx, p.slice(0, 200)));
}
