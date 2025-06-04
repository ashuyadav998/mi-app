import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useParams } from 'react-router-dom';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryName } = useParams(); // Obtener el parámetro de la categoría desde la URL

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      let apiUrl = 'https://fakestoreapi.com/products';

      if (categoryName) {
        apiUrl = `https://fakestoreapi.com/products/category/${categoryName}`;
      }

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Error al cargar los productos.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]); // Volver a ejecutar el efecto si cambia la categoría

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Error al cargar los productos: {error.message}</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        {categoryName ? `Productos en la categoría: ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}` : 'Todos los Productos'}
      </h2>
      <div className="row g-4">
        {products.map(product => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;