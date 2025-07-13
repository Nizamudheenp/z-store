import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProduct } from '../features/product/productSlice';
import api from '../api/api';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.product);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/products/${id}`);
      dispatch(setSelectedProduct(res.data));
    };
    fetchProduct();
  }, [dispatch, id]);

  if (!selectedProduct) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-96 object-cover rounded" />
      <h2 className="text-3xl font-bold mt-4">{selectedProduct.title}</h2>
      <p className="mt-2 text-gray-600">{selectedProduct.description}</p>
      <p className="mt-4 text-2xl font-semibold text-green-600">₹ {selectedProduct.price}</p>
    </div>
  );
};

export default ProductDetails;
