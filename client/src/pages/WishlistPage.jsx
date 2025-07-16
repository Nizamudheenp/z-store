import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import { setWishlist } from '../features/wishlist/wishlistSlice';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.wishlist);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        dispatch(setWishlist(res.data));
      } catch {
        toast.error('Failed to load wishlist');
      }
    };
    fetchWishlist();
  }, [dispatch]);

  return (
    <div className="pt-20 p-4 min-h-screen bg-[#F9F5FF]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#4C1D95] mb-8 text-center">My Wishlist</h2>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">
            Your wishlist is empty.{" "}
            <Link to="/" className="text-[#8B5CF6] underline hover:text-[#7C3AED]">
              Browse products
            </Link>
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map(product => (
              <li key={product._id} className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition duration-300">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-36 h-36 object-contain mb-4"
                />
                <h3 className="font-semibold text-lg text-center">{product.title}</h3>
                <p className="text-green-600 font-medium mt-2">₹ {product.price}</p>
                
                <Link 
                  to={`/product/${product._id}`} 
                  className="mt-4 bg-[#8B5CF6] text-white px-5 py-2 rounded-xl hover:bg-[#7C3AED] hover:scale-105 transition-transform duration-200"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
