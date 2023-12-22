import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mdp: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

export default User;
