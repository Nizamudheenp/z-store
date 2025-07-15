import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { setProducts } from '../features/product/productSlice';
import { toast } from 'sonner';

const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      const params = { page, limit: 6 }; // 6 products per page
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.min = minPrice;
      if (maxPrice) params.max = maxPrice;

      const res = await api.get('/products', { params });
      dispatch(setProducts(res.data.products));
      setPages(res.data.pages);
    } catch {
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    fetchProducts();
  };

  const handleNext = () => {
    if (page < pages) setPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  // Add to Cart
  const addToCart = async (productId) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  // Add to Wishlist
  const toggleWishlist = async (productId) => {
    try {
      await api.post('/wishlist/toggle', { productId });
      toast.success('Wishlist updated');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="p-8">

      {/* Filters */}
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

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow hover:shadow-lg flex flex-col justify-between">
              <Link to={`/product/${p._id}`}>
                <img src={p.image} alt={p.title} className="w-full h-48 object-cover rounded" />
                <h2 className="text-xl font-bold mt-2">{p.title}</h2>
                <p className="text-gray-600">₹ {p.price}</p>
              </Link>

              {user && (
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => addToCart(p._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => toggleWishlist(p._id)}
                    className="bg-pink-500 text-white px-3 py-1 rounded text-sm hover:bg-pink-600"
                  >
                    Wishlist
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2">Page {page} of {pages}</span>

        <button
          onClick={handleNext}
          disabled={page === pages}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default Home;
