import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProduct } from '../features/product/productSlice';
import { setCart } from '../features/cart/cartSlice';
import api from '../api/api';
import { toast } from 'sonner';

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


  if (!selectedProduct) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-96 object-cover rounded" />
      <h2 className="text-3xl font-bold mt-4">{selectedProduct.title}</h2>
      <p className="mt-2 text-gray-600">{selectedProduct.description}</p>
      <p className="mt-4 text-2xl font-semibold text-green-600">₹ {selectedProduct.price}</p>

      <button 
        onClick={handleAddToCart} 
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
      <button
  onClick={handleToggleWishlist}
  className="mt-2 bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 ml-4"
>
  ❤️ 
</button>

    </div>
  );
};

export default ProductDetails;
