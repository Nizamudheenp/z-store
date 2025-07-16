import { useEffect, useState } from 'react';
import api from '../api/api';
import { toast } from 'sonner';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch {
        toast.error('Failed to load orders');
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-200 text-yellow-700';
      case 'Shipped': return 'bg-blue-200 text-blue-700';
      case 'Delivered': return 'bg-green-200 text-green-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="pt-20 p-4 min-h-screen bg-[#F9F5FF]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#4C1D95] mb-8 text-center">My Orders</h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">You have no orders yet.</p>
        ) : (
          <ul className="space-y-6">
            {orders.map(order => (
              <li 
                key={order._id} 
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: <span className="font-medium">{order._id}</span></p>
                    <p className="text-sm text-gray-500">Date: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <p className="text-lg font-semibold text-green-600 mb-3">Total: ₹{order.totalAmount}</p>

                <div>
                  <strong className="text-gray-700">Items:</strong>
                  <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.product.title} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
