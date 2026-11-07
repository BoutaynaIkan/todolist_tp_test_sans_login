import { useState } from "react";

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isFormValid = email.includes("@") && password.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    // On passe les identifiants au composant parent (App)
    onLoginSuccess(email, password);
  };

  return (
    <div data-cy="login-view">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-cy="login-email-input"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-cy="login-password-input"
        />
        <button
          type="submit"
          data-cy="login-submit-button"
          disabled={!isFormValid}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};