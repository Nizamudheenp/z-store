import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'sonner';

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    tags: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error('Image is required');

    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    data.append('image', image);

    try {
      await api.post('/products', data);
      toast.success('Product added');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5FF] flex items-center justify-center px-4 pt-20">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-[#4C1D95] mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            name="title"
            onChange={handleChange}
            placeholder="Product Title"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] bg-white shadow-sm"
          />
          <input
            name="price"
            onChange={handleChange}
            placeholder="Price"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] bg-white shadow-sm"
          />
          <input
            name="category"
            onChange={handleChange}
            placeholder="Category"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] bg-white shadow-sm"
          />
          <input
            name="stock"
            onChange={handleChange}
            placeholder="Stock"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] bg-white shadow-sm"
          />
          <input
            name="tags"
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] bg-white shadow-sm"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm cursor-pointer"
          />
          <textarea
            name="description"
            onChange={handleChange}
            placeholder="Product Description"
            className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] bg-white shadow-sm"
            rows={4}
          />
          <button
            type="submit"
            className="md:col-span-2 w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3 rounded-xl font-semibold transition duration-200"
          >
            + Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
