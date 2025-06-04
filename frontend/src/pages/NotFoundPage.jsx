// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-4">404</h1>
      <p className="lead">Página no encontrada.</p>
      <p>La página que estás buscando no existe o ha sido movida.</p>
      <Link to="/" className="btn btn-primary">
        Volver a la página principal
      </Link>
    </div>
  );
}

export default NotFoundPage;