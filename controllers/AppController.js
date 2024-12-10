import redisClient from '../utils/redis';
import dbClient from '../utils/db';

/**
 * Controller handling App related operations
 */
class AppController {
  /**
   * Gets the status of Redis and DB connections
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   */
  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).json(status);
  }

  /**
   * Gets statistics about the number of users and files
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   */
  static async getStats(req, res) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    res.status(200).json(stats);
  }
}

export default AppController;

