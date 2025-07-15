import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { setProducts } from '../features/product/productSlice';
import { toast } from 'sonner';

const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('products/categories'); 
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.min = minPrice;
      if (maxPrice) params.max = maxPrice;

      const res = await api.get('/products', { params });
      dispatch(setProducts(res.data.products));
    } catch {
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleFilter = () => {
    fetchProducts();
  };

  return (
    <div className="p-8">

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={handleFilter}
          className="md:col-span-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((p) => (
            <Link to={`/product/${p._id}`} key={p._id} className="border p-4 rounded shadow hover:shadow-lg">
              <img src={p.image} alt={p.title} className="w-full h-48 object-cover rounded" />
              <h2 className="text-xl font-bold mt-2">{p.title}</h2>
              <p className="text-gray-600">₹ {p.price}</p>
            </Link>
          ))
        )}
      </div>

    </div>
  );
};

export default Home;
