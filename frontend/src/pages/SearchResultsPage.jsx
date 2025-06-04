import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockAllProducts = [
    { id: 1, name: 'Smartphone X', price: 599, image: 'https://via.placeholder.com/200/FFC107/000000?Text=SmartphoneX' },
    { id: 2, name: 'Laptop Pro 15', price: 1299, image: 'https://via.placeholder.com/200/007BFF/FFFFFF?Text=LaptopPro15' },
    { id: 3, name: 'Auriculares Inalámbricos Pro', price: 149, image: 'https://via.placeholder.com/200/28A745/FFFFFF?Text=AuricularesPro' },
    { id: 4, name: 'Smartwatch Lite', price: 199, image: 'https://via.placeholder.com/200/DC3545/FFFFFF?Text=Smartwatch' },
    { id: 5, name: 'Smartphone Y Lite', price: 399, image: 'https://via.placeholder.com/200/FFC107/000000?Text=SmartphoneYLite' },
    { id: 6, name: 'Laptop Gamer Z', price: 1799, image: 'https://via.placeholder.com/200/007BFF/FFFFFF?Text=LaptopGamerZ' },
    { id: 7, name: 'Auriculares Bluetooth', price: 69, image: 'https://via.placeholder.com/200/28A745/FFFFFF?Text=AuricularesBT' },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (query) {
        const filteredResults = mockAllProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
      } else {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }, [query]);

  if (loading) {
    return <div className="p-6">Buscando productos...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Resultados de la búsqueda para: "{query}"</h2>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No se encontraron productos para tu búsqueda.</p>
      )}
    </div>
  );
}

export default SearchResultsPage;
