// src/pages/OrderConfirmationPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './OrderConfirmationPage.css'; // Asegúrate de crear este archivo para los estilos

const OrderConfirmationPage = () => {
    const location = useLocation();
    const [orderId, setOrderId] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');

    useEffect(() => {
        // Obtenemos los datos pasados desde la página de checkout
        if (location.state) {
            setOrderId(location.state.orderId);
            setPaymentIntentId(location.state.paymentIntentId);
        }
    }, [location.state]);

    return (
        <div className="order-confirmation-page">
            <h1 className="confirmation-title">¡Pedido Confirmado!</h1>
            <p className="thank-you-message">Gracias por tu compra. Tu pedido ha sido procesado exitosamente.</p>

            <div className="details-card">
                <h3>Detalles del Pedido</h3>
                {orderId ? (
                    <p>Tu número de pedido es: <strong>{orderId}</strong></p>
                ) : (
                    <p>No se pudo obtener el número de pedido.</p>
                )}
                {paymentIntentId && (
                    <p>ID de la transacción: <code>{paymentIntentId}</code></p>
                )}
                <p>Te hemos enviado un email con los detalles completos de tu pedido a tu dirección de correo electrónico.</p>
            </div>

            <div className="action-links">
                <Link to="/" className="btn-primary">Volver a la tienda</Link>
                {/* Puedes añadir un enlace para ver el historial de pedidos si lo implementas */}
                {/* {orderId && <Link to={`/my-orders/${orderId}`} className="btn-secondary">Ver mi pedido</Link>} */}
            </div>
        </div>
    );
};

export default OrderConfirmationPage;