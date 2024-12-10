import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        // Utilisation des variables d'environnement pour la configuration
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || '27017';
        const database = process.env.DB_DATABASE || 'files_manager';
        this.url = `mongodb://${host}:${port}`;
        this.dbName = database;
        this.client = new MongoClient(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = null;
    }

    // Connexion à MongoDB
    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log('Connected to MongoDB');
        } catch (err) {
            console.error('Failed to connect to MongoDB', err);
        }
    }

    // Vérifie si la connexion est active
    isAlive() {
        return this.db != null;
    }

    // Retourne le nombre d'utilisateurs dans la collection "users"
    async nbUsers() {
        if (this.isAlive()) {
            const collection = this.db.collection('users');
            const count = await collection.countDocuments();
            return count;
        }
        return 0;
    }

    // Retourne le nombre de fichiers dans la collection "files"
    async nbFiles() {
        if (this.isAlive()) {
            const collection = this.db.collection('files');
            const count = await collection.countDocuments();
            return count;
        }
        return 0;
    }
}

// Créer une instance de DBClient et l'exporter
const dbClient = new DBClient();
export default dbClient;

