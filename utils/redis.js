import { createClient } from 'redis';

// Définition de la classe RedisClient
class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.error(`Redis Client Error: ${error}`);
    });
  }

  // Vérifie si la connexion à Redis est active
  isAlive() {
    return this.client.connected;
  }

  // Récupère la valeur d'une clé donnée
  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la clé ${key}: ${error}`);
      return null;
    }
  }

  // Stocke une valeur avec expiration en secondes
  async set(key, value, duration) {
    try {
      await this.client.setex(key, duration, value);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la définition de la clé ${key}: ${error}`);
      return false;
    }
  }

  // Supprime une clé
  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la clé ${key}: ${error}`);
      return false;
    }
  }
}

// Création et exportation de l'instance RedisClient
const redisClient = new RedisClient();
export default redisClient;

