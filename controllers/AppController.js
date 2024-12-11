import redisClient from '../utils/redis';
import dbClient from '../utils/db';

/**
 * Controller handling App related operations
 */
class AppController {
  /**
   * Gets the status of Redis and DB connections
   * @param {Request} _req Express request object
   * @param {Response} res Express response object
   */
  static getStatus(_req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    return res.status(200).json(status);
  }

  /**
   * Gets statistics about the number of users and files
   * @param {Request} _req Express request object
   * @param {Response} res Express response object
   */
  static async getStats(_req, res) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    return res.status(200).json(stats);
  }
}

export default AppController;
