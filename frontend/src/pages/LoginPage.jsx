import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === 'test@example.com' && password === 'password') {
      const userData = { email: email, name: 'Test User' };
      login(userData);
      navigate('/');
    } else {
      alert('Credenciales incorrectas.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="text-center mt-3">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="link-primary">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
