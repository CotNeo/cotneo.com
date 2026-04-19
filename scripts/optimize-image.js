const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(process.cwd(), 'public', 'images', 'profile.png');
const outputPath = path.join(process.cwd(), 'public', 'images', 'profile-optimized.webp');

// fit: inside — no crop; full photo (head/hair) preserved, only scaled down for file size
sharp(inputPath)
  .resize(800, 1200, {
    fit: 'inside',
    withoutEnlargement: true,
  })
  .webp({ quality: 80 })
  .toFile(outputPath)
  .then(info => {
    console.log('Image optimized:', info);
  })
  .catch(err => {
    console.error('Error optimizing image:', err);
  }); 