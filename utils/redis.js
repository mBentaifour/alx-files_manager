// Inside the folder utils, create a file redis.js 
// that contains the class RedisClient
import { createClient } from 'redis';

// Définition de la classe RedisClient
class RedisClient {
  constructor() {
    // Création du client Redis
    this.client = createClient();
    this.client.on('error', (error) => console.error(`Redis Client Error: ${error}`));
  }

  // Vérifie si la connexion à Redis est active
  isAlive() {
    return this.client.connected;
  }

  // Récupère la valeur d'une clé donnée
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) reject(err);
        resolve(value);
      });
    });
  }

  // Stocke une valeur avec expiration en secondes
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  // Supprime une clé
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
}

// Création et exportation de l'instance RedisClient
const redisClient = new RedisClient();
export default redisClient;

