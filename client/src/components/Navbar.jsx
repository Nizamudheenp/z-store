import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { toast } from 'sonner';
import { FaUserCircle } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#F9F5FF] shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-[#4C1D95]">Z-Store</Link>

      <div className="flex items-center space-x-6 relative">
        <Link to="/" className="text-[#4C1D95] font-semibold hover:underline">Home</Link>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
              <FaUserCircle size={28} className="text-[#8B5CF6]" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <Link to="/cart" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cart</Link>
                <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Wishlist</Link>
                <Link to="/my-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>

                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                )}

                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="bg-[#8B5CF6] text-white px-4 py-2 rounded-xl hover:bg-[#7C3AED] transition duration-200">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
