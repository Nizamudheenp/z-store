import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'sonner';
import { clearCart } from '../features/cart/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  // New: Address state
  const [address, setAddress] = useState({
    fullName: user.name || '',
    line1: '',
    city: '',
    postalCode: '',
    country: 'IN'
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create Payment Intent
      const res = await api.post('/orders/create-payment-intent', { items });
      const clientSecret = res.data.clientSecret;

      // Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: address.fullName,
            address: {
              line1: address.line1,
              city: address.city,
              postal_code: address.postalCode,
              country: address.country
            }
          }
        }
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
      } else {
        // Create Order
        await api.post('/orders/create', {
          userId: user._id,
          items: items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName: address.fullName,
            address: address.line1,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
          },
          totalAmount: items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
          paymentIntentId: result.paymentIntent.id,
        });

        dispatch(clearCart());
        toast.success('Payment Successful');
        navigate('/my-orders');
      }
    } catch (err) {
      toast.error('Payment failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={address.fullName}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="line1"
        placeholder="Address"
        value={address.line1}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={address.city}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="postalCode"
        placeholder="Postal Code"
        value={address.postalCode}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        name="country"
        placeholder="Country (e.g., IN)"
        value={address.country}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <h2 className="text-2xl font-bold mt-6 mb-4">Payment Details</h2>
      <CardElement className="p-4 border rounded mb-4" />

      <button
        disabled={!stripe || loading}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default CheckoutPage;
