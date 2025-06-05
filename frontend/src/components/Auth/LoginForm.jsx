import React, { useState } from 'react';
import Input from '../UI/Input.jsx';
import Button from '../UI/Button.jsx';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <Input
        label="Email"
        type="email"
        id="login-email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Senha"
        type="password"
        id="login-password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="form-actions">
        <Button type="submit">Entrar</Button>
      </div>
    </form>
  );
};

export default LoginForm;