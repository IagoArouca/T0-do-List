import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm.jsx';
import RegisterForm from '../components/Auth/RegisterForm.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import * as api from '../services/api.js'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth(); 
  const navigate = useNavigate(); 

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Credenciais inválidas ou erro no login.');
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await api.registerUser(userData);
      console.log('Registro bem-sucedido:', response);
      alert('Registro realizado com sucesso! Faça login.');
      setIsLogin(true); 
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert(error.message || 'Erro ao registrar usuário.');
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-page" >
      <div className='auth-page-img'>
        <img src='/img/listimg.png'></img>
      </div>
      <div className="auth-page-container">
        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? 'Entrar' : 'Registrar'}</h2>
          {isLogin ? <LoginForm onLogin={handleLogin} /> : <RegisterForm onRegister={handleRegister} />}
          <button onClick={toggleAuthMode} className="auth-toggle-button">
            {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>
    </div>
    </div>
  );
};

export default AuthPage;