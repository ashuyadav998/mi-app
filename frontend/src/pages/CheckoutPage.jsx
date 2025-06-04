// src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // Si manejas usuarios logueados
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css'; // Asegúrate de crear este archivo para los estilos

// 1. Carga la clave pública de Stripe (¡desde .env.local!)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Sub-componente para el formulario de pago real (interno de Elements)
const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext); // Asumiendo que `user` contiene `_id`, `name`, `email`
    // Si no tienes AuthContext, puedes pedir al usuario que introduzca su nombre/email en un formulario
    const [customerInfo, setCustomerInfo] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });


    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false); // true cuando se está procesando el pago
    const [disabled, setDisabled] = useState(true); // true si el formulario no es válido o no hay clientSecret
    const [clientSecret, setClientSecret] = useState(''); // Se obtiene del backend
    const [orderId, setOrderId] = useState(''); // El ID de pedido que el backend te devuelve

    // Simulación de precios de envío e impuestos (ajústalos según tu lógica de negocio)
    const shippingPrice = 5.00;
    const taxPrice = getTotalPrice() * 0.21; // 21% de IVA en España

    useEffect(() => {
        // Llama a tu backend para crear un PaymentIntent cuando la página se carga
        const fetchPaymentIntent = async () => {
            const totalPrice = getTotalPrice();
            if (totalPrice <= 0 || cartItems.length === 0) {
                setError('El carrito está vacío o el total es cero. Por favor, añade productos.');
                setDisabled(true);
                return;
            }

            try {
                setProcessing(true); // Activa el estado de procesamiento mientras se obtiene el clientSecret
                setError(null); // Limpia errores anteriores

                const response = await fetch(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Si tu backend requiere un token de autenticación, añádelo aquí:
                        // 'Authorization': user ? `Bearer ${user.token}` : '',
                    },
                    body: JSON.stringify({
                        // Envía los datos necesarios para que el backend calcule el total final
                        cartItems: cartItems.map(item => ({ productId: item._id, quantity: item.quantity })),
                        shippingAddress: customerInfo.address ? customerInfo : null, // Puedes pedir la dirección
                        paymentMethod: 'Stripe Card', // O el método de pago que elijas
                        userId: user ? user._id : 'guest', // ID del usuario o 'guest'
                        shippingPrice: shippingPrice,
                        taxPrice: taxPrice,
                        // Envía el total_frontend como referencia, pero el backend lo recalcula
                        amount: totalPrice + shippingPrice + taxPrice,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setClientSecret(data.clientSecret);
                    setOrderId(data.orderId); // Guarda el orderId devuelto por el backend
                    setDisabled(false); // Habilita el botón de pagar una vez que tenemos el clientSecret
                } else {
                    setError(data.error || 'Error al inicializar el pago desde el servidor.');
                }
            } catch (err) {
                console.error('Error fetching payment intent:', err);
                setError('Error de conexión con el servidor de pago. Por favor, inténtalo más tarde.');
            } finally {
                setProcessing(false); // Desactiva el estado de procesamiento
            }
        };

        fetchPaymentIntent();
    }, [cartItems, getTotalPrice, user, shippingPrice, taxPrice]); // Se ejecuta al cargar y si cambian estos datos

    // Manejador de cambios en el CardElement y el formulario de cliente
    const handleCardChange = async (event) => {
        setDisabled(event.empty || !clientSecret); // Deshabilita si el CardElement está vacío o no hay clientSecret
        setError(event.error ? event.error.message : ''); // Muestra errores de validación de tarjeta
    };

    const handleCustomerInfoChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    // Manejador del envío del formulario de pago
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setProcessing(true); // Activa el estado de procesamiento del botón

        if (!stripe || !elements || !clientSecret) {
            setError('Error: El sistema de pago no está disponible. Inténtalo de nuevo.');
            setProcessing(false);
            return;
        }

        // Confirma el pago con Stripe usando el clientSecret y la información de la tarjeta
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: customerInfo.name,
                    email: customerInfo.email,
                    address: {
                        line1: customerInfo.address,
                        city: customerInfo.city,
                        postal_code: customerInfo.postalCode,
                        country: customerInfo.country,
                    },
                },
            },
        });

        if (stripeError) {
            setError(`Error en el pago: ${stripeError.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setSucceeded(true); // Pago exitoso
            setProcessing(false);

            // Una vez que el pago es exitoso, limpia el carrito y redirige
            clearCart();
            // Redirige a la página de confirmación con los datos del pedido
            navigate('/order-confirmation', { state: { orderId: orderId, paymentIntentId: paymentIntent.id } });
        }
    };

    const totalPrice = getTotalPrice();
    const finalAmount = totalPrice + shippingPrice + taxPrice;

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="payment-form">
            <h3 className="form-title">Información del Cliente y Envío</h3>
            <div className="form-group">
                <label htmlFor="name">Nombre:</label>
                <input type="text" id="name" name="name" value={customerInfo.name} onChange={handleCustomerInfoChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={customerInfo.email} onChange={handleCustomerInfoChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="address">Dirección:</label>
                <input type="text" id="address" name="address" value={customerInfo.address} onChange={handleCustomerInfoChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="city">Ciudad:</label>
                <input type="text" id="city" name="city" value={customerInfo.city} onChange={handleCustomerInfoChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="postalCode">Código Postal:</label>
                <input type="text" id="postalCode" name="postalCode" value={customerInfo.postalCode} onChange={handleCustomerInfoChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="country">País:</label>
                <input type="text" id="country" name="country" value={customerInfo.country} onChange={handleCustomerInfoChange} required />
            </div>

            <h3 className="form-title">Detalles de Tarjeta</h3>
            <div className="card-element-container">
                <CardElement id="card-element" options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} onChange={handleCardChange} />
            </div>

            {error && (
                <div className="card-error" role="alert">
                    {error}
                </div>
            )}

            <button
                className="pay-button"
                disabled={processing || disabled || succeeded}
                id="submit"
            >
                <span id="button-text">
                    {processing ? (
                        <div className="spinner" id="spinner"></div>
                    ) : (
                        `Pagar ${finalAmount.toFixed(2)}€`
                    )}
                </span>
            </button>

            {succeeded && (
                <p className="result-message">
                    ¡Pago exitoso! Redirigiendo a la confirmación de tu pedido...
                </p>
            )}
        </form>
    );
};

// Componente principal de la página de Checkout
const CheckoutPage = () => {
    const { cartItems, getTotalPrice } = useContext(CartContext);
    const totalPrice = getTotalPrice();
    const shippingPrice = 5.00; // Misma simulación de envío
    const taxPrice = totalPrice * 0.21; // Misma simulación de impuestos
    const finalAmount = totalPrice + shippingPrice + taxPrice;

    // Asegúrate de que el carrito no esté vacío para mostrar el formulario de pago
    if (cartItems.length === 0 || totalPrice <= 0) {
        return (
            <div className="checkout-page empty-cart">
                <h2>Carrito Vacío</h2>
                <p>No hay productos en tu carrito para proceder con el pago. <a href="/">Volver a la tienda</a></p>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1 className="page-title">Finalizar Compra</h1>
            <div className="order-summary">
                <h3>Resumen del Pedido</h3>
                <ul>
                    {cartItems.map(item => (
                        <li key={item._id}>
                            <span>{item.name} x {item.quantity}</span>
                            <span>{(item.price * item.quantity).toFixed(2)}€</span>
                        </li>
                    ))}
                    <li>
                        <span>Envío:</span>
                        <span>{shippingPrice.toFixed(2)}€</span>
                    </li>
                    <li>
                        <span>Impuestos (21% IVA):</span>
                        <span>{taxPrice.toFixed(2)}€</span>
                    </li>
                </ul>
                <p className="total">Total a pagar: {finalAmount.toFixed(2)}€</p>
            </div>
            {/* Envuelve el formulario de pago con el componente Elements de Stripe */}
            {stripePromise && (
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
};

export default CheckoutPage;