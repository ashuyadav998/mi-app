// src/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage'; // Importa NotFoundPage
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CheckoutPage from './pages/CheckoutPage';

function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Header />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:productId" element={<ProductDetails />} />
              <Route path="/category/:categoryName" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} /> {/* Ruta para la página de perfil */}
              <Route path="*" element={<NotFoundPage />} /> {/* Ruta para la página 404 */}
              <Route path="/checkout" element={<CheckoutPage/>}/>
            </Routes>
          </div>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppRouter;