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
      const res = await api.post('/orders/create-payment-intent', { items });
      const clientSecret = res.data.clientSecret;

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
        navigate('/success');
      }
    } catch (err) {
      toast.error('Payment failed');
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-8 max-w-xl mx-auto rounded-2xl shadow-lg mt-12 space-y-5"
    >
      <h2 className="text-2xl font-bold text-[#4C1D95] mb-4 text-center">Shipping Address</h2>

      {["fullName", "line1", "city", "postalCode", "country"].map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={field === "line1" ? "Address" : field === "postalCode" ? "Postal Code" : field === "country" ? "Country (e.g., IN)" : "Full Name"}
          value={address[field]}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition"
          required
        />
      ))}

      <h2 className="text-2xl font-bold text-[#4C1D95] mt-8 mb-4 text-center">Payment Details</h2>

      <div className="bg-gray-100 p-4 rounded-lg border">
        <CardElement className="p-2 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" />
      </div>

      <button
        disabled={!stripe || loading}
        className={`w-full mt-6 px-6 py-3 rounded-xl text-white text-lg transition 
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8B5CF6] hover:bg-[#7C3AED] hover:scale-105'}
        `}
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
