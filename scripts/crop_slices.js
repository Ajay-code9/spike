const sharp = require('sharp');

(async () => {
  for (const top of [2500, 3100, 3700, 4300]) {
    await sharp('scripts/preview_updated.png')
      .extract({ left: 0, top: top, width: 1440, height: Math.min(600, 5000 - top) })
      .toFile('scripts/slice_' + top + '.png');
    console.log('Saved slice_' + top + '.png');
  }
})();
