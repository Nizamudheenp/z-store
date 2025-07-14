import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'sonner';
import { clearCart } from '../features/cart/cartSlice';

const CheckoutPage = () => {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkout = async () => {
      try {
        const res = await api.post('/orders/create-checkout-session', {
          userId: user._id,
          items: items.map((i) => ({
            product: {
              title: i.product.title,
              image: i.product.image,
              price: i.product.price,
            },
            quantity: i.quantity,
            product_id: i.product._id,
            
          })),
        });

        window.location.href = res.data.url; 
      } catch {
        toast.error('Checkout failed');
        navigate('/cart');
      }
    };

    checkout();
  }, [items, navigate, dispatch]);

  return (
    <div className="p-8 text-center">
      <p>Redirecting to payment...</p>
    </div>
  );
};

export default CheckoutPage;
