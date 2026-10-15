const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode + ' for ' + url));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => stream.close(resolve));
    }).on('error', reject);
  });
}

const avatars = [
  {
    name: 'daniel',
    // Professional businessman in suit with glasses
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=85',
  },
  {
    name: 'sophia',
    // Professional Asian businesswoman with dark hair
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=85',
  },
  {
    name: 'ahmed',
    // Professional young man in smart suit with trimmed beard
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=85',
  }
];

async function run() {
  const avatarsDir = path.resolve(__dirname, '../assets/images/avatars');
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
  }

  for (const a of avatars) {
    const tempFile = path.resolve(__dirname, `temp_${a.name}.jpg`);
    const finalFile = path.join(avatarsDir, `${a.name}.jpg`);

    console.log(`Downloading ${a.name}...`);
    await download(a.url, tempFile);

    console.log(`Processing ${a.name} with sharp...`);
    await sharp(tempFile)
      .resize(256, 256, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 90 })
      .toFile(finalFile);

    fs.unlinkSync(tempFile);
    console.log(`Saved ${finalFile} (${fs.statSync(finalFile).size} bytes)`);
  }
  console.log('All avatars downloaded and processed!');
}

run().catch(console.error);
