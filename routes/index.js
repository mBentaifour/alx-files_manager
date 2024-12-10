// routes/index.js
import express from 'express';
import AppController from '../controllers/AppController.js';

const router = express.Router();

// Route pour obtenir le statut de Redis et de la base de données
router.get('/status', AppController.getStatus);

// Route pour obtenir les statistiques des utilisateurs et des fichiers
router.get('/stats', AppController.getStats);

export default router;

