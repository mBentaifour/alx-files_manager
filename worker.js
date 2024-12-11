const Queue = require('bull');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs').promises;
const path = require('path');
const dbClient = require('./utils/db');

const fileQueue = new Queue('fileQueue');

fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  // Vérification des paramètres
  if (!fileId) throw new Error('Missing fileId');
  if (!userId) throw new Error('Missing userId');

  // Récupérer le fichier depuis la base de données
  const file = await dbClient.db.collection('files').findOne({ _id: fileId, userId });

  if (!file) throw new Error('File not found');
  if (file.type !== 'image') return; // Process uniquement les images

  const filePath = path.join('/tmp/files_manager/', file.localPath);

  // Vérifier si le fichier existe
  try {
    await fs.access(filePath);
  } catch {
    throw new Error('File not found on disk');
  }

  // Générer les vignettes
  const sizes = [100, 250, 500];
  for (const size of sizes) {
    const options = { width: size };
    const thumbnail = await imageThumbnail(filePath, options);
    const thumbPath = `${filePath}_${size}`;
    await fs.writeFile(thumbPath, thumbnail);
  }
});

console.log('Worker started and waiting for jobs...');

