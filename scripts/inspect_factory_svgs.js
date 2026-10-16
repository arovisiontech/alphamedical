const fs = require('fs');

['factory 2.svg', 'Rectangle 892.svg'].forEach(file => {
  const c = fs.readFileSync(file, 'utf8');
  console.log(file, 'Length:', c.length);
  const vb = c.match(/viewBox="([^"]+)"/);
  const w = c.match(/width="([^"]+)"/);
  const h = c.match(/height="([^"]+)"/);
  const images = c.match(/<image/g) || [];
  console.log(file, {
    viewBox: vb ? vb[1] : null,
    w: w ? w[1] : null,
    h: h ? h[1] : null,
    imageCount: images.length
  });
});
