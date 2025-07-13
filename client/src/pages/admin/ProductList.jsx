import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/api';
import { setProducts } from '../../features/product/productSlice';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get('/products');
    dispatch(setProducts(res.data.products));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4 font-bold">Admin Product List</h1>
      <Link to="/admin/add-product" className="bg-blue-500 text-white px-4 py-2 rounded">+ Add Product</Link>

      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.title}</td>
              <td className="p-2">₹ {p.price}</td>
              <td className="p-2">
                <Link to={`/admin/edit-product/${p._id}`} className="text-blue-500 mr-4">Edit</Link>
                <button onClick={() => handleDelete(p._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
