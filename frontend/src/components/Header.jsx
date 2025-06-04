import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // Importa el contexto de autenticación
import SearchBar from './SearchBar';
import { FaShoppingCart, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useCart } from '../context/CartContext' //


function Header() {
  const { getTotalItems } = useCart(CartContext);
  const { isLoggedIn, logout } = useCart(AuthContext); // Obtén el estado de login y la función de logout
  const totalItems = getTotalItems();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirige a la página principal después de cerrar sesión
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className="container">
      <Link className="navbar-brand fw-bold" to="/">
  <img
  src={logo}
  alt="Logo"
  style={{ height: '30px', width: 'auto', verticalAlign: 'middle' }}
/>

</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
            <li className="nav-item">
              <Link className="nav-link" to="/products">Productos</Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="true"
              >
                Categorías
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item" to="/category/smartphones">Smartphones</Link></li>
                <li><Link className="dropdown-item" to="/category/laptops">Laptops</Link></li>
                <li><Link className="dropdown-item" to="/category/audio">Audio</Link></li>
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <SearchBar />

            <Link className="btn btn-outline-light position-relative" to="/cart">
              <FaShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems}
                  <span className="visually-hidden">productos en el carrito</span>
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <>
                <Link className="btn btn-outline-light" to="/profile">
                  <FaUser size={20} /> Perfil
                </Link>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  <FaSignOutAlt size={20} /> Salir
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light" to="/login">
                  <FaSignInAlt size={20} /> Login
                </Link>
                <Link className="btn btn-outline-primary" to="/register">
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;