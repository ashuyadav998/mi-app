// Ejemplo muy simplificado de un endpoint en tu backend Node.js
// Asegúrate de tener Express configurado

// const express = require('express');
// const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Usa variables de entorno para la clave secreta

// Endpoint para crear un PaymentIntent (Paso 1 del flujo de pago de Stripe)
// Se llamará desde el frontend cuando el usuario inicie el checkout
app.post('/api/create-payment-intent', async (req, res) => {
    const { amount, currency, items } = req.body; // Recibe el monto y los artículos desde el frontend

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Cantidad en la unidad más pequeña de la moneda (ej: céntimos para EUR)
            currency: currency, // 'eur' para euros
            automatic_payment_methods: {
                enabled: true,
            },
            // Puedes añadir metadatos, descripción, etc.
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (e) {
        console.error('Error creating payment intent:', e);
        res.status(500).json({ error: e.message });
    }
});

// Endpoint para manejar webhooks (opcional pero recomendado para actualizaciones de estado)
// Esto es para que Stripe te notifique sobre eventos importantes (pagos completados, reembolsos, etc.)
// Requiere un poco más de configuración y seguridad (firma de webhook)
app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Luego de un pago exitoso, actualiza el estado del pedido en tu base de datos
            console.log(`PaymentIntent for ${paymentIntentSucceeded.amount} was successful!`);
            // Aquí podrías llamar a una función para actualizar el pedido en MongoDB
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});