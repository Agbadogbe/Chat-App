import express from 'express';
import User from '../model/database_schema.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, mdp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(mdp, user.mdp)) {
      res.json({ message: 'Connexion réussie', user: { id: user._id, email: user.email } });
    } else {
      res.status(401).json({ message: 'Adresse e-mail ou mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la tentative de connexion', error: error.message });
  }
});

export default router;
