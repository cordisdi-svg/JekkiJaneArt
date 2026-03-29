const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      results.push(filePath);
    }
  });

  return results;
}

async function convert() {
  const files = walk('./public');

  for (const file of files) {
    if (!file.match(/\.(png|jpg|jpeg)$/i)) continue;

    const output = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    try {
      await sharp(file)
        .webp({ quality: 80 })
        .toFile(output);

      console.log('✔', output);
    } catch (err) {
      console.log('✖ ERROR:', file);
    }
  }
}

convert();
