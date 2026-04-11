'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Truck, Clock, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderAPI } from '@/app/lib/api';

interface Order {
  _id: string;
  orderId: string;
  userId: string;
  userName: string;
  phoneNumber: string;
  package: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  orderDate: string;
  deliveryDate: string;
  address: string;
  zone: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders();
      console.log('Orders response:', response);
      
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('অর্ডার লোড করতে ব্যর্থ হয়েছে');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await orderAPI.updateOrderStatus(orderId, newStatus);
      
      if (response.success) {
        toast.success(`অর্ডার স্ট্যাটাস আপডেট হয়েছে: ${getStatusText(newStatus)}`);
        await fetchOrders(); // Refresh the list
      } else {
        toast.error(response.message || 'স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে');
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'পেন্ডিং';
      case 'confirmed': return 'কনফার্মড';
      case 'preparing': return 'প্রস্তুত হচ্ছে';
      case 'out_for_delivery': return 'ডেলিভারিতে';
      case 'delivered': return 'ডেলিভারি হয়েছে';
      case 'cancelled': return 'বাতিল';
      default: return status;
    }
  };

  const getStatusButtons = (order: Order) => {
    const buttons = [];
    
    switch(order.status) {
      case 'pending':
        buttons.push(
          <button
            key="confirm"
            onClick={() => updateOrderStatus(order._id, 'confirmed')}
            disabled={updatingOrderId === order._id}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {updatingOrderId === order._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            কনফার্ম করুন
          </button>
        );
        break;
      case 'confirmed':
        buttons.push(
          <button
            key="prepare"
            onClick={() => updateOrderStatus(order._id, 'preparing')}
            disabled={updatingOrderId === order._id}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {updatingOrderId === order._id ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
            প্রস্তুত করুন
          </button>
        );
        break;
      case 'preparing':
        buttons.push(
          <button
            key="out_for_delivery"
            onClick={() => updateOrderStatus(order._id, 'out_for_delivery')}
            disabled={updatingOrderId === order._id}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {updatingOrderId === order._id ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
            ডেলিভারিতে পাঠান
          </button>
        );
        break;
      case 'out_for_delivery':
        buttons.push(
          <button
            key="deliver"
            onClick={() => updateOrderStatus(order._id, 'delivered')}
            disabled={updatingOrderId === order._id}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {updatingOrderId === order._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            ডেলিভারি সম্পন্ন করুন
          </button>
        );
        break;
    }
    
    // Add cancel button for non-delivered/non-cancelled orders
    if (!['delivered', 'cancelled'].includes(order.status)) {
      buttons.push(
        <button
          key="cancel"
          onClick={() => updateOrderStatus(order._id, 'cancelled')}
          disabled={updatingOrderId === order._id}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          {updatingOrderId === order._id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
          বাতিল করুন
        </button>
      );
    }
    
    return buttons;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.phoneNumber?.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = [
    { value: 'all', label: 'সব' },
    { value: 'pending', label: 'পেন্ডিং' },
    { value: 'confirmed', label: 'কনফার্মড' },
    { value: 'preparing', label: 'প্রস্তুত হচ্ছে' },
    { value: 'out_for_delivery', label: 'ডেলিভারিতে' },
    { value: 'delivered', label: 'ডেলিভারি হয়েছে' },
    { value: 'cancelled', label: 'বাতিল' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">অর্ডার লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">অর্ডার লিস্ট</h1>
          <p className="text-gray-500 mt-1">সমস্ত অর্ডার এখানে দেখুন এবং ম্যানেজ করুন</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          রিফ্রেশ
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="অর্ডার আইডি, নাম বা ফোন নম্বর দিয়ে সার্চ করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-800"
            />
          </div>
          <div className="flex gap-2">
            <Filter size={20} className="text-gray-400 mt-2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-800"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500">কোনো অর্ডার পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-[#3B82F6]">#{order.orderId || order._id.slice(-6)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800">{order.userName}</p>
                  <p className="text-sm text-gray-600">{order.phoneNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#3B82F6]">৳ {order.totalAmount}</p>
                  <p className="text-sm text-gray-600">{order.package}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">অর্ডারের তারিখ</p>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ডেলিভারির তারিখ</p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('bn-BD') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">জোন</p>
                  <p className="text-sm font-medium text-gray-800">{order.zone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">আইটেম</p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.items?.map(item => item.name).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {getStatusButtons(order)}
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  <Eye size={16} />
                  বিস্তারিত
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}