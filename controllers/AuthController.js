import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

/**
 * Controller handling Authentication operations
 */
class AuthController {
  /**
   * Authenticates a user and generates a token
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   */
  static async getConnect(req, res) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Decode Base64 credentials
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString();
      const [email, password] = credentials.split(':');

      if (!email || !password) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find user
      const user = await dbClient.db.collection('users').findOne({
        email,
        password: sha1(password),
      });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate token
      const token = uuidv4();
      const key = `auth_${token}`;

      // Store token in Redis with 24h expiration
      await redisClient.set(key, user._id.toString(), 24 * 3600);

      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  /**
   * Signs out a user by invalidating their token
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   */
  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Delete token from Redis
    await redisClient.del(key);
    return res.status(204).end();
  }
}

export default AuthController;

