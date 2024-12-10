import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Class for handling Redis client operations
 * Provides methods for basic Redis operations with async/await support
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance
   * Initializes connection to Redis and sets up error handling
   */
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
  }

  /**
   * Checks if the connection to Redis is active
   * @return {boolean} True if connected, false otherwise
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Retrieves the value for a given key from Redis
   * @param {string} key - The key to retrieve the value for
   * @return {Promise<string|null>} The value associated with the key, or null if not found
   */
  async get(key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    const value = await asyncGet(key);
    return value;
  }

  /**
   * Stores a key-value pair in Redis with an expiration time
   * @param {string} key - The key to store
   * @param {*} value - The value to store
   * @param {number} duration - The expiration time in seconds
   * @return {Promise<void>}
   */
  async set(key, value, duration) {
    const asyncSet = promisify(this.client.setex).bind(this.client);
    await asyncSet(key, duration, value);
  }

  /**
   * Removes a key-value pair from Redis
   * @param {string} key - The key to remove
   * @return {Promise<void>}
   */
  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    await asyncDel(key);
  }
}

// Create and export a single instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
