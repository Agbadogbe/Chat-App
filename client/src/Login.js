import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = () => {
    if (email && password) {
      Axios.post('http://localhost:8080/login', { email, mdp: password })
        .then(response => {
          console.log("Connexion réussie: " + email);
        
          navigate("/chat");
        })
        .catch(error => {
          const errorMsg = error.response?.data?.message || "Could not log in. Please check your credentials and try again.";
          alert(errorMsg);
        });
    } else {
      alert("Please enter both email and password.");
    }
  };

  const redirectToregister = () => {
    navigate("/register");
  };

  return (
    <div className="Login">
      <header className="Login-header">
        <img src="logo.png" className="Login-logo" alt="logo" />
        <p><b className="LoginTitle">Welcome to our Chat-app !</b></p>
        <input
          className="Login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="Login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="Login-button" onClick={login}>Log In</button>
        <p className="social-login-invite">
          Or continue with <span className="social-option" onClick={redirectToregister}>No account? Register here</span>
        </p>
      </header>
    </div>
  );
}

export default Login;

