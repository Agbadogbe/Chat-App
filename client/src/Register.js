import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from 'axios';
import './Register.css';

function Register() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const showAlert = (message, type="error") => {
    alert(message);
  };

  const register = () => {
    if (password !== confirmPassword) {
      showAlert('Les mots de passe ne correspondent pas.');
      return;
    }
    if (nom && prenom && email && password) {
      Axios.post(`http://localhost:8080/register`, { nom, prenom, email, mdp: password })
        .then((response) => {
          if (response.status === 201) {
            showAlert('Utilisateur enregistré avec succès: ' + email, 'success');
            navigate('/login');
          } else {
            showAlert('Erreur avec la réponse de la requête d\'enregistrement.');
          }
        })
        .catch((error) => {
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : 'Erreur lors de l\'enregistrement. Veuillez réessayer.';
          showAlert(errorMessage);
        });
    } else {
      showAlert('Veuillez remplir tous les champs.');
    }
  };

  return (
    <div className="Register">
      <header className="Register-header">
        <img src="logo.png" className="Register-logo" alt="logo" />
        <p className="Register-Title">
          <b>Register to our Chat-app !</b>
        </p>
        <input 
          className="Register-field" 
          placeholder="Nom" 
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <input 
          className="Register-field" 
          placeholder="Prénom" 
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <input 
          className="Register-field" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          className="Register-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input 
          className="Register-field"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="Register-button" onClick={register}>Register</button>
        <Link to="/login" className="RegisterLink">Already have an account? Log in here</Link>
      </header>
    </div>
  );
}

export default Register;