import { MongoClient } from 'mongodb';

/**
 * Class for handling MongoDB client operations
 * Provides methods for connecting to MongoDB and performing basic operations
 */
class DBClient {
  /**
   * Creates a new DBClient instance
   * Initializes connection to MongoDB using environment variables or default values
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  /**
   * Checks if the connection to MongoDB is active
   * @return {boolean} True if connected, false otherwise
   */
  isAlive() {
    return !!this.client && !!this.client.topology && this.client.topology.isConnected();
  }

  /**
   * Gets the number of documents in the users collection
   * @return {Promise<number>} Number of users in the database
   */
  async nbUsers() {
    if (!this.db) return 0;
    try {
      const users = this.db.collection('users');
      return await users.countDocuments();
    } catch (error) {
      return 0;
    }
  }

  /**
   * Gets the number of documents in the files collection
   * @return {Promise<number>} Number of files in the database
   */
  async nbFiles() {
    if (!this.db) return 0;
    try {
      const files = this.db.collection('files');
      return await files.countDocuments();
    } catch (error) {
      return 0;
    }
  }
}

// Create and export a single instance of DBClient
const dbClient = new DBClient();
export default dbClient;

