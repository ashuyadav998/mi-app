import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaAudioDescription } from 'react-icons/fa';

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { id, name, description, price, image, category} = product;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="card h-100 shadow-sm mb-4">
      <Link to={`/product/${id}`} className="text-decoration-none text-dark">
        <div className="ratio ratio-4x3 bg-light d-flex align-items-center justify-content-center">
          {image ? (
            <img src={image} alt={name} className="card-img-top object-fit-cover" />
          ) : (
            <div className="text-muted">Sin imagen</div>
          )}
        </div>
        <div className="card-body text-center">
          <h5 className="card-title">${name}</h5>
        
          <p className="card-text text-primary fw-bold">${price}</p>
        </div>
      </Link>
      <div className="card-footer bg-transparent border-top-0">
        <button
          className="btn btn-success w-100"
          onClick={handleAddToCart}
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
