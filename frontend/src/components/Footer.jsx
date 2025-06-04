import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 text-center">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Mi Tienda de Electrónica. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
