import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(req, res) {
    // Get token from headers
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    // Get user ID from Redis using token
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Get user from DB
    const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // Get request data
    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    // Validate required fields
    if (!name) return res.status(400).json({ error: 'Missing name' });
    
    const validTypes = ['folder', 'file', 'image'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }

    // Check parentId if provided
    if (parentId !== 0) {
      const parentFile = await dbClient.db.collection('files')
        .findOne({ _id: ObjectId(parentId) });
      
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    // Create file document
    const fileDocument = {
      userId: ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentId === 0 ? 0 : ObjectId(parentId)
    };

    // If it's a folder, just save to DB
    if (type === 'folder') {
      const result = await dbClient.db.collection('files').insertOne(fileDocument);
      fileDocument.id = result.insertedId;
      return res.status(201).json(fileDocument);
    }

    // For files and images, save to disk
    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const localPath = path.join(folderPath, uuidv4());

    // Create folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save file to disk
    const fileContent = Buffer.from(data, 'base64');
    fs.writeFileSync(localPath, fileContent);

    // Add localPath to document and save to DB
    fileDocument.localPath = localPath;
    const result = await dbClient.db.collection('files').insertOne(fileDocument);
    fileDocument.id = result.insertedId;

    return res.status(201).json(fileDocument);
  }
}

export default FilesController;

