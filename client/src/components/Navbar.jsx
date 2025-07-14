import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">E-Store</Link>

      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/">Home</Link>
            {user.role === 'admin' ? (
              <Link to="/admin/products">Dashboard</Link>
            ) : (
              <>
                <Link to="/cart">Cart</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/my-orders">My Orders</Link>
              </>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
