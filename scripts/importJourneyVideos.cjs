/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const seedPath = path.resolve(__dirname, '..', 'journeyVideos.seed.json');

if (!fs.existsSync(seedPath)) {
  console.error(`Seed file not found at: ${seedPath}`);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

async function run() {
  const db = admin.firestore();
  const raw = fs.readFileSync(seedPath, 'utf8');
  const items = JSON.parse(raw);

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('journeyVideos.seed.json must contain a non-empty array.');
  }

  const batch = db.batch();
  items.forEach((item) => {
    const ref = db.collection('journeyVideos').doc();
    batch.set(ref, {
      title: item.title || '',
      description: item.description || '',
      videoUrl: item.videoUrl || '',
      language: item.language || 'en',
      order: Number(item.order) || 0,
    });
  });

  await batch.commit();
  console.log(`Imported ${items.length} documents to "journeyVideos".`);
}

run().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
