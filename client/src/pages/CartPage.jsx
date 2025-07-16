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

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await api.post('/cart/update', { productId, quantity: Number(newQuantity) });
      const res = await api.get('/cart');
      dispatch(setCart(res.data.items));
      toast.success('Quantity updated');
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  return (
    <div className="pt-20 p-4 min-h-screen bg-[#F9F5FF]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#4C1D95] mb-8 text-center">Your Cart</h2>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">
            Your cart is empty.{" "}
            <Link to="/" className="text-[#8B5CF6] underline hover:text-[#7C3AED]">
              Shop now
            </Link>
          </p>
        ) : (
          <>
            <ul className="space-y-6">
              {items.map((item) => (
                <li 
                  key={item.product._id} 
                  className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.title} 
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{item.product.title}</h3>
                      <p className="text-gray-600 text-sm">₹ {item.product.price} × {item.quantity}</p>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.product._id, e.target.value)}
                        className="mt-2 border border-gray-300 rounded px-3 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 bg-white rounded-2xl shadow-md p-6 text-center">
              <p className="text-xl font-bold text-gray-700">Total: ₹ {totalPrice}</p>
              <button
                onClick={handleCheckout}
                className="mt-4 bg-[#8B5CF6] text-white px-8 py-3 rounded-xl hover:bg-[#7C3AED] hover:scale-105 transition-transform duration-200"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
