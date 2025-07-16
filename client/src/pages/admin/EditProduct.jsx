import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'sonner';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    price: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setForm({ title: res.data.title, price: res.data.price });
      } catch {
        toast.error('Failed to fetch product');
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${id}`, form);
      toast.success('Product updated');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Failed to update product');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5FF] flex items-center justify-center px-4 pt-20">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-[#4C1D95] mb-6">Edit Product</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] bg-white shadow-sm"
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] bg-white shadow-sm"
          />
          <button
            type="submit"
            className="md:col-span-2 w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3 rounded-xl font-semibold transition duration-200"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
