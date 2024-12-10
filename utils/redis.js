import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.error(`Redis client not connected to the server: ${error.message}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    try {
      const value = await asyncGet(key);
      return value;
    } catch (error) {
      console.error(`Error getting key ${key}: ${error.message}`);
      return null;
    }
  }

  async set(key, value, duration) {
    const asyncSet = promisify(this.client.setex).bind(this.client);
    try {
      await asyncSet(key, duration, value);
      return true;
    } catch (error) {
      console.error(`Error setting key ${key}: ${error.message}`);
      return false;
    }
  }

  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    try {
      await asyncDel(key);
      return true;
    } catch (error) {
      console.error(`Error deleting key ${key}: ${error.message}`);
      return false;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
