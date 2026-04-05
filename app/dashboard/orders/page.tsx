'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Truck, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  userId: string;
  userName: string;
  phoneNumber: string;
  package: string;
  items: string[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate: string;
  address: string;
  zone: string;
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [orders] = useState<Order[]>([
    {
      id: 'ORD001',
      userId: 'USER001',
      userName: 'রহিম মিয়া',
      phoneNumber: '+8801712345678',
      package: 'গোল্ডেন প্যাকেজ',
      items: ['মুরগি ভুনা', 'ভাত', 'ডাল'],
      totalAmount: 350,
      status: 'pending',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      address: 'ধানমন্ডি ৩২, ঢাকা',
      zone: 'ধানমন্ডি',
    },
    {
      id: 'ORD002',
      userId: 'USER002',
      userName: 'করিম আহমেদ',
      phoneNumber: '+8801812345678',
      package: 'ডায়মন্ড প্যাকেজ',
      items: ['বিরিয়ানি', 'গরুর মাংস', 'ডেজার্ট'],
      totalAmount: 3500,
      status: 'confirmed',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      address: 'গুলশান ১, ঢাকা',
      zone: 'গুলশান',
    },
    {
      id: 'ORD003',
      userId: 'USER003',
      userName: 'জবা আক্তার',
      phoneNumber: '+8801912345678',
      package: 'গোল্ডেন প্যাকেজ',
      items: ['মাছ ভাজা', 'ভাত', 'ডাল'],
      totalAmount: 350,
      status: 'preparing',
      orderDate: '2024-01-14',
      deliveryDate: '2024-01-15',
      address: 'উত্তরা ১২, ঢাকা',
      zone: 'উত্তরা',
    },
    {
      id: 'ORD004',
      userId: 'USER004',
      userName: 'শাকিল হোসেন',
      phoneNumber: '+8801612345678',
      package: 'ডায়মন্ড প্যাকেজ',
      items: ['পাস্তা', 'গ্রিলড চিকেন', 'স্যুপ'],
      totalAmount: 3500,
      status: 'delivered',
      orderDate: '2024-01-13',
      deliveryDate: '2024-01-14',
      address: 'মিরপুর ১০, ঢাকা',
      zone: 'মিরপুর',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'পেন্ডিং';
      case 'confirmed': return 'কনফার্মড';
      case 'preparing': return 'প্রস্তুত হচ্ছে';
      case 'delivered': return 'ডেলিভারি হয়েছে';
      case 'cancelled': return 'বাতিল';
      default: return status;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    toast.success(`অর্ডার স্ট্যাটাস আপডেট হয়েছে: ${getStatusText(newStatus)}`);
    // Here you would make API call to update status
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.phoneNumber.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = [
    { value: 'all', label: 'সব' },
    { value: 'pending', label: 'পেন্ডিং' },
    { value: 'confirmed', label: 'কনফার্মড' },
    { value: 'preparing', label: 'প্রস্তুত হচ্ছে' },
    { value: 'delivered', label: 'ডেলিভারি হয়েছে' },
    { value: 'cancelled', label: 'বাতিল' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">অর্ডার লিস্ট</h1>
        <p className="text-gray-500 mt-1">সমস্ত অর্ডার এখানে দেখুন এবং ম্যানেজ করুন</p>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <div className="flex gap-2">
            <Filter size={20} className="text-gray-400 mt-2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold text-[#3B82F6]">#{order.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p className="font-semibold text-gray-800">{order.userName}</p>
                <p className="text-sm text-gray-500">{order.phoneNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#3B82F6]">৳ {order.totalAmount}</p>
                <p className="text-sm text-gray-500">{order.package}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">অর্ডারের তারিখ</p>
                <p className="text-sm font-medium">{order.orderDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ডেলিভারির তারিখ</p>
                <p className="text-sm font-medium">{order.deliveryDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">জোন</p>
                <p className="text-sm font-medium">{order.zone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">আইটেম</p>
                <p className="text-sm font-medium">{order.items.join(', ')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {order.status === 'pending' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <CheckCircle size={16} />
                  কনফার্ম করুন
                </button>
              )}
              {order.status === 'confirmed' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <Clock size={16} />
                  প্রস্তুত করুন
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Truck size={16} />
                  ডেলিভারি দিন
                </button>
              )}
              {(order.status === 'pending' || order.status === 'confirmed') && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <XCircle size={16} />
                  বাতিল করুন
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                <Eye size={16} />
                বিস্তারিত
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500">কোনো অর্ডার পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
}