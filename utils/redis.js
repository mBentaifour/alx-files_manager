import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    const value = await asyncGet(key);
    return value;
  }

  async set(key, value, duration) {
    const asyncSet = promisify(this.client.setex).bind(this.client);
    await asyncSet(key, duration, value);
  }

  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    await asyncDel(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;

