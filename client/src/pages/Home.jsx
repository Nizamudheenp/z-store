import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { setProducts } from '../features/product/productSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get('/products');
      dispatch(setProducts(res.data.products));
    };
    fetchProducts();
  }, [dispatch]);

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
  );
};

export default Home;
