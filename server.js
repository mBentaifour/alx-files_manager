// server.js
import express from 'express';
import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 5001;

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Charger les routes
app.use(routes);

app.listen(port, '127.0.0.1', () => {
  console.log(`Server running on port ${port}`);
});

