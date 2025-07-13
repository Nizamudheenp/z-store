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
      const res = await api.get(`/products/${id}`);
      setForm({ title: res.data.title, price: res.data.price });
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/products/${id}`, form);
    toast.success('Product updated');
    navigate('/admin/products');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4 font-bold">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border p-2 w-full" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2 w-full" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default EditProduct;
