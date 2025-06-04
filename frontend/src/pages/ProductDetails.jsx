import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Adaptar los datos de la API al formato que espera tu componente
        const adaptedProduct = {
          id: data.id,
          name: data.title,
          price: data.price,
          description: data.description,
          image: data.image,
          specifications: {
            category: data.category, // Puedes añadir más si la API los proporciona
            rating: `Rate: ${data.rating.rate}, Count: ${data.rating.count}`,
            // ... otros campos que quieras mostrar
          },
          stock: Math.floor(Math.random() * 20) + 5, // Simular stock
        };
        setProduct(adaptedProduct);
      } catch (err) {
        setError('Error al cargar los detalles del producto.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return <div className="p-3">Cargando detalles del producto...</div>;
  }

  if (error) {
    return <div className="p-3 text-danger">Error: {error}</div>;
  }

  if (!product) {
    return <div className="p-3">Producto no encontrado.</div>;
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-6">
          {product.image ? (
            <img src={product.image} alt={product.name} className="img-fluid rounded shadow-sm" width={500}/>
          ) : (
            <div className="bg-light text-center py-5 rounded">Sin imagen</div>
          )}
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <p className="text-primary fs-4 fw-bold mb-3">${product.price}</p>
          <p className="mb-4">{product.description}</p>

          <h5>Especificaciones:</h5>
          <ul className="list-group mb-4">
            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
              <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                <strong className="text-capitalize">{key}:</strong>
                <span>{value}</span>
              </li>
            ))}
          </ul>

          <p className={`mb-4 fw-semibold ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
            Disponibilidad: {product.stock > 0 ? `En stock (${product.stock} unidades)` : 'Agotado'}
          </p>

          {product.stock > 0 && (
            <button
              className="btn btn-success w-100"
              onClick={handleAddToCart}
            >
              Añadir al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;