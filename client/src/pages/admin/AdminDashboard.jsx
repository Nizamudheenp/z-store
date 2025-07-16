import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  

  const fetchData = async () => {
    try {
      const [ordersRes, inventoryRes, ordersChartRes, bestSellersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products/inventory'),
        api.get('/orders/charts/orders-per-day'),
        api.get('/products/top-products'),
        api.get('/products'),
      ]);

      setOrders(ordersRes.data);
      setInventory(inventoryRes.data);
      setOrdersPerDay(ordersChartRes.data);
      setBestSellers(bestSellersRes.data);
      setProducts(productsRes.data.products);
    } catch {
      toast.error('Failed to load admin data');
    }
  };

  const handleDeleteProduct = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center space-y-4">
            <h2 className="text-xl font-bold text-[#4C1D95]">Delete Product?</h2>
            <p className="text-gray-600">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4 pt-4">
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await api.delete(`/products/${id}`);
                  toast.success('Product deleted');
                  fetchData();
                  onClose();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition"
              >
                Delete
              </button>
            </div>
          </div>
        );
      }
    });
  };


  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const statusOptions = ['Processing', 'Shipped', 'Delivered'];

  return (
    <div className="min-h-screen bg-[#F9F5FF] p-8 pt-24 space-y-10">

      <h1 className="text-3xl font-bold text-[#4C1D95]">Admin Dashboard</h1>

      <div className="bg-white p-6 rounded-3xl shadow-md">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-[#4C1D95]">Product Management</h2>
          <Link to="/admin/add-product" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2 rounded-xl transition">
            + Add Product
          </Link>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F9F5FF]">
              <th className="p-3">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="hover:bg-[#FAF8FF] transition">
                <td className="p-3">{p.title}</td>
                <td className="p-3">₹ {p.price}</td>
                <td className="p-3 space-x-4">
                  <Link to={`/admin/edit-product/${p._id}`} className="text-[#8B5CF6] font-medium hover:underline">Edit</Link>
                  <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 font-medium hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h2 className="text-xl font-semibold text-[#4C1D95] mb-4">Orders</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F9F5FF]">
              <th className="p-3">Order ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-[#FAF8FF] transition">
                <td className="p-3">{order._id.slice(0, 8)}...</td>
                <td className="p-3">{order.user.name}</td>
                <td className="p-3">₹ {order.total}</td>
                <td className="p-3">{order.status}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className="border px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h2 className="text-xl font-semibold text-[#4C1D95] mb-4">Inventory Stock</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventory.map(item => (
            <li key={item._id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <strong>{item.title}</strong> - Stock: {item.stock}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h2 className="text-xl font-semibold text-[#4C1D95] mb-4">Orders Per Day</h2>
          <BarChart width={400} height={250} data={ordersPerDay}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalOrders" fill="#8B5CF6" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h2 className="text-xl font-semibold text-[#4C1D95] mb-4">Best Sellers</h2>
          <PieChart width={400} height={250}>
            <Pie
              data={bestSellers}
              dataKey="totalSold"
              nameKey="product.title"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8B5CF6"
              label={({ product }) => product.title}
            >
              {bestSellers.map((_, index) => (
                <Cell key={index} fill={["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"][index % 5]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
