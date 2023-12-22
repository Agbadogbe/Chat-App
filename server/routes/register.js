import express from 'express';
import User from '../model/database_schema.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, mdp } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'Cette adresse e-mail est déjà utilisée.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mdp, salt);
    const newUser = new User({
      ...req.body,
      mdp: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Utilisateur inscrit avec succès', data: savedUser });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
});

export default router;

