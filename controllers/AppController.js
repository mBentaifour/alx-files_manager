// controllers/AppController.js
import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
  // Méthode pour vérifier si Redis et la DB sont vivants
  static async getStatus(req, res) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();

    res.status(200).json({
      redis: redisStatus,
      db: dbStatus,
    });
  }

  // Méthode pour obtenir les statistiques des utilisateurs et des fichiers
  static async getStats(req, res) {
    try {
      const nbUsers = await dbClient.nbUsers();
      const nbFiles = await dbClient.nbFiles();

      res.status(200).json({
        users: nbUsers,
        files: nbFiles,
      });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching stats' });
    }
  }
}

export default AppController;

