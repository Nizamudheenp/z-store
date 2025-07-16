import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { setProducts } from '../features/product/productSlice';
import { toast } from 'sonner';
import { FaCartPlus, FaHeart } from 'react-icons/fa';

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
      const params = { page, limit: 8 };
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

  const addToCart = async (productId) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      await api.post('/wishlist/toggle', { productId });
      toast.success('Wishlist updated');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="pt-20 p-4 bg-[#F9F5FF] min-h-screen">

      <div className="mt-0 flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] shadow-sm"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] shadow-sm"
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
          className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] shadow-sm"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] shadow-sm"
        />
        <button
          onClick={handleFilter}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 rounded-lg font-semibold transition duration-200"
        >
          Apply Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden"
            >
              <Link to={`/product/${p._id}`}>
                <img src={p.image} alt={p.title}   className="w-full h-44 object-contain hover:scale-105 transition duration-300 bg-white" />
                <div className="p-3">
                  <h2 className="text-lg font-bold text-[#4C1D95] truncate">{p.title}</h2>
                  <p className="text-gray-600 mt-1 text-sm">₹ {p.price}</p>
                </div>
              </Link>

              {user && (
                <div className=" p-2">
                  <button
                    onClick={() => addToCart(p._id)}
                    className="text-green-500 hover:text-green-600 mr-3 text-lg"
                  >
                    <FaCartPlus />
                  </button>

                  <button
                    onClick={() => toggleWishlist(p._id)}
                    className="text-pink-500 hover:text-pink-600 text-lg"
                  >
                    <FaHeart />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>


      <div className="flex justify-center mt-10 space-x-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="bg-gray-300 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2 font-semibold text-gray-700">Page {page} of {pages}</span>

        <button
          onClick={handleNext}
          disabled={page === pages}
          className="bg-gray-300 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default Home;
