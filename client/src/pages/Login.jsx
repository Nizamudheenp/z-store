import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { loginSuccess } from '../features/auth/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 5) newErrors.password = 'Password must be at least 5 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await api.post('/auth/login', formData);
      dispatch(loginSuccess(res.data));
      toast.success('Login successful');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F5FF] px-4">
      <div className="flex bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full h-[500px]">

        <div className="hidden md:block w-1/2 relative">
          <img src="/images/z-store.jpg" alt="Z-Store" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>

        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] bg-white shadow-sm"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] bg-white shadow-sm"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3 rounded-xl font-semibold transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-[#8B5CF6] font-semibold hover:underline">Register here</Link>
          </p>
        </div>

      </div>
    </div>


  );
};

export default Login;
