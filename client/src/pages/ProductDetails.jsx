import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProduct } from '../features/product/productSlice';
import { setCart } from '../features/cart/cartSlice';
import api from '../api/api';
import { toast } from 'sonner';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        dispatch(setSelectedProduct(res.data));
      } catch (err) {
        toast.error('Failed to load product');
      }
    };
    fetchProduct();
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    try {
      const res = await api.post('/cart/add', {
        productId: selectedProduct._id,
        quantity: 1,
      });
      dispatch(setCart(res.data.cart.items));
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      const res = await api.post('/wishlist/toggle', { productId: selectedProduct._id });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Wishlist action failed');
    }
  };

  if (!selectedProduct) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="pt-20 p-4 min-h-screen bg-[#F9F5FF] flex justify-center items-center">
      <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-2xl shadow-lg p-6 max-w-4xl w-full">

        {/* Product Image */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <img 
            src={selectedProduct.image} 
            alt={selectedProduct.title} 
            className="max-w-xs w-full object-contain rounded-xl shadow-md"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4C1D95] mb-4">{selectedProduct.title}</h2>
          
          <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
          
          <p className="text-xl font-semibold text-green-600 mb-6">₹ {selectedProduct.price}</p>

          <div className="flex justify-center md:justify-start items-center gap-4">
            <button 
              onClick={handleAddToCart} 
              className="flex items-center gap-2 bg-[#8B5CF6] text-white px-6 py-3 rounded-xl hover:bg-[#7C3AED] hover:scale-105 transition duration-200"
            >
              <FaShoppingCart />
              Add to Cart
            </button>

            <button
              onClick={handleToggleWishlist}
              className="text-pink-500 hover:text-pink-600 text-2xl hover:scale-110 transition-transform duration-200"
              title="Add to Wishlist"
            >
              <FaHeart />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
