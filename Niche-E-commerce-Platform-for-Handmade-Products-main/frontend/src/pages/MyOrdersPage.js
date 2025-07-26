import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/user/${user._id}`);
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/orders/${orderId}/cancel`);
      toast.success(res.data.message || 'Order cancelled successfully');
      fetchOrders();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to cancel order';
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    if (user?._id) fetchOrders();
  }, [user?._id]);

  const filteredOrders = orders.filter(order =>
    statusFilter === 'All' ? true : order.status === statusFilter
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.placedAt) - new Date(a.placedAt);
    if (sortBy === 'total') return b.total - a.total;
    return 0;
  });

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">🧾 My Orders</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="latest">Latest First</option>
          <option value="total">Sort by Total</option>
        </select>
      </div>

      {paginatedOrders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        paginatedOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200"
          >
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span><strong>Order ID:</strong> {order._id}</span>
              <span><strong>Date:</strong> {order.placedAt ? new Date(order.placedAt).toLocaleDateString() : 'N/A'}</span>
            </div>

            <p className="text-gray-800"><strong>Total:</strong> ₹{order.total}</p>
            <p className="text-gray-800"><strong>Payment:</strong> {order.paymentStatus}</p>

            <p className="mt-2">
              <strong>Status: </strong>
              <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium 
                ${
                  order.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'Paid'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'Cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {order.status}
              </span>
            </p>

            <ul className="mt-4 space-y-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <img
                    src={item.productId?.image}
                    alt="Product"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="text-gray-700">
                    {item.productId?.title || 'Unnamed Product'} × {item.quantity}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCancel(order._id)}
              disabled={order.status === 'Cancelled'}
              className={`mt-4 py-2 px-4 rounded transition text-white ${
                order.status === 'Cancelled'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Cancel Order
            </button>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default MyOrdersPage;
