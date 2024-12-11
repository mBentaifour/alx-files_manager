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
      const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
      const [email, password] = credentials.split(':');

      if (!email || !password) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find user with email and hashed password
      const hashedPassword = sha1(password);
      const user = await dbClient.db.collection('users')
        .findOne({ email, password: hashedPassword });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate token and store in Redis
      const token = uuidv4();
      const key = `auth_${token}`;
      await redisClient.set(key, user._id.toString(), 24 * 3600); // 24 hours

      return res.status(200).json({ token });
    } catch (error) {
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

    await redisClient.del(key);
    return res.status(204).send();
  }
}

export default AuthController;

