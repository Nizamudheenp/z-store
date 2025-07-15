import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, inventoryRes, ordersChartRes, bestSellersRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products/inventory'),
        api.get('/orders/charts/orders-per-day'),
        api.get('/products/top-products'),
      ]);

      setOrders(ordersRes.data);
      setInventory(inventoryRes.data);
      setOrdersPerDay(ordersChartRes.data);
      setBestSellers(bestSellersRes.data);
    } catch {
      toast.error('Failed to load admin data');
    }
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
    <div className="p-8 space-y-8">

      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Orders List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="p-2 border">{order._id.slice(0, 8)}...</td>
                <td className="p-2 border">{order.user.name}</td>
                <td className="p-2 border">₹ {order.total}</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border">
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className="border p-1 rounded"
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

      {/* Inventory Stock */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Inventory Stock</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventory.map(item => (
            <li key={item._id} className="border p-2 rounded">
              <strong>{item.title}</strong> - Stock: {item.stock}
            </li>
          ))}
        </ul>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Orders Per Day Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Orders Per Day</h2>
          <BarChart width={400} height={250} data={ordersPerDay}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Best Selling Products</h2>
          <PieChart width={400} height={250}>
            <Pie
              data={bestSellers}
              dataKey="totalSold"
              nameKey="product.title"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#10b981"
              label={({ product }) => product.title}
            >
              {bestSellers.map((_, index) => (
                <Cell key={index} fill={["#10b981", "#3b82f6", "#facc15", "#ef4444", "#8b5cf6"][index % 5]} />
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
