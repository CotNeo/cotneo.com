const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(process.cwd(), 'public', 'images', 'profile.png');
const outputPath = path.join(process.cwd(), 'public', 'images', 'profile-optimized.webp');

sharp(inputPath)
  .resize(800, 800, {
    fit: 'cover',
    position: 'center'
  })
  .webp({ quality: 80 })
  .toFile(outputPath)
  .then(info => {
    console.log('Image optimized:', info);
  })
  .catch(err => {
    console.error('Error optimizing image:', err);
  }); 