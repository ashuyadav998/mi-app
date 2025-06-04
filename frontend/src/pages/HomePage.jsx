import React from 'react';
import ProductsPage from './ProductsPage';

function HomePage() {
  return (
   <div style={{ display: 'flex', justifyContent: 'center' }}>
  <div className="container py-4">
    <div
      className="jumbotron bg-light rounded-3 mb-4"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1555041169-21a63113aa68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
      }}
    >
      <div className="container py-5">
        <h1 className="display-4 fw-bold text-center">¡Las Mejores Ofertas en Electrónica!</h1>
        <p className="lead text-center">Descubre nuestra amplia selección de smartphones, laptops, audio y mucho más con descuentos increíbles.</p>
        <div className="d-flex justify-content-center">
          <a className="btn btn-primary btn-lg" href="/products" role="button">Ver Ofertas Ahora</a>
        </div>
      </div>
    </div>
    
    <ProductsPage />
  </div>
</div>
  );
}

export default HomePage;
