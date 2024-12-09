import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // Récupérer les informations de connexion depuis les variables d'environnement ou utiliser des valeurs par défaut
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.dbName = process.env.DB_DATABASE || 'files_manager';

    // URI de connexion MongoDB
    this.url = `mongodb://${this.host}:${this.port}`;

    // Créer un client MongoDB
    this.client = new MongoClient(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.db = null;
  }

  // Fonction pour établir la connexion à MongoDB
  async connect() {
    try {
      await this.client.connect();
      console.log('MongoDB connected');
      this.db = this.client.db(this.dbName);
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      this.db = null;
    }
  }

  // Vérifie si la connexion MongoDB est active
  isAlive() {
    return this.db != null;
  }

  // Retourne le nombre de documents dans la collection 'users'
  async nbUsers() {
    if (!this.db) {
      throw new Error('Database connection is not established');
    }
    const collection = this.db.collection('users');
    return await collection.countDocuments();
  }

  // Retourne le nombre de documents dans la collection 'files'
  async nbFiles() {
    if (!this.db) {
      throw new Error('Database connection is not established');
    }
    const collection = this.db.collection('files');
    return await collection.countDocuments();
  }
}

// Création de l'instance de DBClient et exportation
const dbClient = new DBClient();
export default dbClient;

