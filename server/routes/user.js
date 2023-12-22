import express from 'express';
import User from '../model/database_schema.js';

const router = express.Router();

router.get('/profile', async (req, res) => {
  const userId = req.session.userId;
  try {
    const user = await User.findById(userId);
    res.json({ nom: user.nom, prenom: user.prenom, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des informations de l'utilisateur", error: error.message });
  }
});

export default router;
