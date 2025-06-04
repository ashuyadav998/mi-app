import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

function CategoryPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockCategoryProducts = {
    smartphones: [
      { id: 1, name: 'Smartphone A', price: 499, image: 'https://via.placeholder.com/200/00BCD4/FFFFFF?Text=SmartphoneA' },
      { id: 2, name: 'Smartphone B', price: 699, image: 'https://via.placeholder.com/200/00BCD4/FFFFFF?Text=SmartphoneB' },
    ],
    laptops: [
      { id: 3, name: 'Laptop C', price: 999, image: 'https://via.placeholder.com/200/3F51B5/FFFFFF?Text=LaptopC' },
      { id: 4, name: 'Laptop D', price: 1499, image: 'https://via.placeholder.com/200/3F51B5/FFFFFF?Text=LaptopD' },
    ],
    audio: [
      { id: 5, name: 'Auriculares E', price: 79, image: 'https://via.placeholder.com/200/4CAF50/FFFFFF?Text=AuricularesE' },
      { id: 6, name: 'Altavoz F', price: 129, image: 'https://via.placeholder.com/200/4CAF50/FFFFFF?Text=AltavozF' },
    ],
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (mockCategoryProducts[categoryId]) {
        setProducts(mockCategoryProducts[categoryId]);
        setLoading(false);
      } else {
        setError('Categoría no encontrada.');
        setLoading(false);
      }
    }, 500);
  }, [categoryId]);

  if (loading) {
    return <div className="container py-5">Cargando productos de la categoría...</div>;
  }

  if (error) {
    return <div className="container py-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-capitalize">{categoryId}</h2>
      {products.length === 0 && !loading && <p>No hay productos en esta categoría.</p>}
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

export default CategoryPage;
