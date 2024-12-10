import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Création du client Redis
    this.client = createClient();
    this.client.on('error', (err) => {
      console.error(`Redis Client Error: ${err}`);
    });
  }

  // Vérifie si la connexion Redis est active
  isAlive() {
    return this.client.connected;
  }

  // Récupère la valeur associée à une clé Redis
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  // Définit une valeur avec une durée d'expiration
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Supprime une clé Redis
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// Exporter une instance de RedisClient
const redisClient = new RedisClient();
export default redisClient;

