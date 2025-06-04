// src/pages/ProfilePage.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { currentUser, logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isLoggedIn) {
    // Redirigir a la página de inicio de sesión si no está logueado
    return (
      <div className="container py-5">
        <h2>Acceso Denegado</h2>
        <p>Debes iniciar sesión para ver tu perfil.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Perfil de Usuario</h2>
      {currentUser ? (
        <div>
          <p><strong>Nombre de usuario:</strong> {currentUser.username}</p>
          {/* Puedes mostrar más información del usuario aquí si la tienes */}
          <button onClick={handleLogout} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <p>No hay información de usuario disponible.</p>
      )}
    </div>
  );
}

export default ProfilePage;