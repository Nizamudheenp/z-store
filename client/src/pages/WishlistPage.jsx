
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
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

      {items.length === 0 ? (
        <p>Your wishlist is empty. <Link to="/" className="text-blue-500 underline">Browse products</Link></p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(product => (
            <li key={product._id} className="border p-4 rounded shadow flex flex-col items-center">
              <img src={product.image} alt={product.title} className="w-40 h-40 object-cover mb-4" />
              <h3 className="font-bold text-lg">{product.title}</h3>
              <p className="text-green-600 font-semibold mt-2">₹ {product.price}</p>
              <Link to={`/product/${product._id}`} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
