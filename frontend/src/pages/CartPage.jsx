// src/components/CartPage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useContext(CartContext);

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleQuantityChange = (productId, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Tu carrito está vacío</h2>
        <Link to="/products" className="btn btn-primary mt-3">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Tu carrito de compra</h2>
      <ul className="list-group mb-4">
        {cartItems.map(item => (
          <li key={item._id} className="list-group-item d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3 flex-grow-1">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="img-thumbnail"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              ) : (
                <div className="bg-light text-muted d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                  Sin imagen
                </div>
              )}
              <h5 className="mb-0">{item.name}</h5>
              <p>{item._id}</p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <label htmlFor={`quantity-${item._id}`} className="form-label mb-0 me-1">Cantidad:</label>
              <input
                type="number"
                id={`quantity-${item._id}`}
                value={item.quantity}
                min="1"
                onChange={(event) => handleQuantityChange(item._id, event)}
                className="form-control"
                style={{ width: '80px' }}
              />
            </div>

            <div className="fw-bold" style={{ minWidth: '90px', textAlign: 'right' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => handleRemove(item._id)}
              aria-label={`Eliminar ${item.name} del carrito`}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <p className="h5 mb-0">Total: <span className="text-primary">${getTotalPrice().toFixed(2)}</span></p>
        <div className="d-flex gap-2">
          <Link to="/checkout" className="btn btn-success">
            Ir a la caja
          </Link>
          <button className="btn btn-outline-secondary" onClick={clearCart}>Vaciar carrito</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
