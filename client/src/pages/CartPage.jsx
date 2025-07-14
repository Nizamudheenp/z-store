import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import { setCart } from '../features/cart/cartSlice';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart');
        dispatch(setCart(res.data.items));
      } catch {
        toast.error('Failed to load cart');
      }
    };
    fetchCart();
  }, [dispatch]);

  const handleRemove = async (productId) => {
    try {
      const res = await api.post('/cart/remove', { productId });
      dispatch(setCart(res.data.cart.items));
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const totalPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty. <Link to="/" className="text-blue-500 underline">Shop now</Link></p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.product._id} className="flex items-center justify-between border p-4 rounded">
                <div className="flex items-center space-x-4">
                  <img src={item.product.image} alt={item.product.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-bold">{item.product.title}</h3>
                    <p>₹ {item.product.price} x {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <p className="text-xl font-bold">Total: ₹ {totalPrice}</p>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
