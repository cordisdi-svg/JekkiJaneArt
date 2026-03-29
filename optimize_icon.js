const fs = require('fs');
const sharp = require('sharp');

sharp('public/Instagram_icon.png')
  .png({ quality: 80, compressionLevel: 9 })
  .toBuffer()
  .then(data => fs.writeFileSync('public/Instagram_icon.png', data))
  .then(() => console.log('Successfully optimized public/Instagram_icon.png'))
  .catch(err => console.error(err));
