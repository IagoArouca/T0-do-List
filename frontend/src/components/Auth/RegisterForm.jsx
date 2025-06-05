import React, { useState } from 'react';
import Input from '../UI/Input.jsx';
import Button from '../UI/Button.jsx';
import './RegisterForm.css';
import * as api from '../../services/api.js'

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <Input
        label="Nome de Usuário"
        type="text"
        id="register-username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        id="register-email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Senha"
        type="password"
        id="register-password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Registrar</Button>
    </form>
  );
};

export default RegisterForm;