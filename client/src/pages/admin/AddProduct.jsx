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
    data.append('image', image);
    data.append('title', form.title);
    data.append('price', form.price);
    data.append('category', form.category);
    data.append('stock', form.stock);
    data.append('description', form.description);
    data.append('tags', form.tags);

    try {
      await api.post('/products', data);
      toast.success('Product added');
      navigate('/admin/products');
    } catch (err) {
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4 font-bold">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" onChange={handleChange} placeholder="Title" className="border p-2 w-full" />
        <input name="price" onChange={handleChange} placeholder="Price" className="border p-2 w-full" />
        <input name="category" onChange={handleChange} placeholder="Category" className="border p-2 w-full" />
        <input name="stock" onChange={handleChange} placeholder="Stock" className="border p-2 w-full" />
        <input name="tags" onChange={handleChange} placeholder="Tags (comma separated)" className="border p-2 w-full" />
        <textarea name="description" onChange={handleChange} placeholder="Description" className="border p-2 w-full" />
        <input type="file" onChange={handleImageChange} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
