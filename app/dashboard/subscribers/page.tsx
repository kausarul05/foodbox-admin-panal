'use client';

import React, { useState } from 'react';
import { Users, Search, Eye, CheckCircle, XCircle, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

interface Subscriber {
  id: string;
  userName: string;
  phoneNumber: string;
  email: string;
  package: 'golden' | 'diamond';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  totalAmount: number;
}

export default function SubscribersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [subscribers] = useState<Subscriber[]>([
    {
      id: 'SUB001',
      userName: 'রহিম মিয়া',
      phoneNumber: '+8801712345678',
      email: 'rahim@gmail.com',
      package: 'golden',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'active',
      paymentStatus: 'paid',
      totalAmount: 2500,
    },
    {
      id: 'SUB002',
      userName: 'করিম আহমেদ',
      phoneNumber: '+8801812345678',
      email: 'karim@gmail.com',
      package: 'diamond',
      startDate: '2024-01-05',
      endDate: '2024-02-04',
      status: 'active',
      paymentStatus: 'paid',
      totalAmount: 3500,
    },
    {
      id: 'SUB003',
      userName: 'জবা আক্তার',
      phoneNumber: '+8801912345678',
      email: 'joba@gmail.com',
      package: 'golden',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      status: 'expired',
      paymentStatus: 'paid',
      totalAmount: 2500,
    },
  ]);

  const getPackageBadge = (pkg: string) => {
    return pkg === 'golden' 
      ? 'bg-amber-100 text-amber-700' 
      : 'bg-purple-100 text-purple-700';
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'expired': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentBadge = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.phoneNumber.includes(searchTerm) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">সাবস্ক্রাইবার লিস্ট</h1>
        <p className="text-gray-500 mt-1">সমস্ত সক্রিয় সাবস্ক্রাইবারদের তালিকা</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="নাম, ফোন বা ইমেইল দিয়ে সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
      </div>

      {/* Subscribers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscribers.map((sub) => (
          <div key={sub.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className={`p-4 text-white ${sub.package === 'golden' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{sub.userName}</h3>
                  <p className="text-white/80 text-sm">{sub.phoneNumber}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPackageBadge(sub.package)}`}>
                  {sub.package === 'golden' ? 'গোল্ডেন' : 'ডায়মন্ড'}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">স্ট্যাটাস</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(sub.status)}`}>
                  {sub.status === 'active' ? 'সক্রিয়' : sub.status === 'expired' ? 'মেয়াদ উত্তীর্ণ' : 'বাতিল'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">পেমেন্ট</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(sub.paymentStatus)}`}>
                  {sub.paymentStatus === 'paid' ? 'পেইড' : sub.paymentStatus === 'pending' ? 'পেন্ডিং' : 'ফেইলড'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-gray-600">
                  {sub.startDate} - {sub.endDate}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign size={14} className="text-gray-400" />
                <span className="text-gray-600 font-semibold">৳ {sub.totalAmount}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                  <Eye size={14} />
                  বিস্তারিত
                </button>
                <button className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2 rounded-lg text-sm font-medium transition">
                  মেসেজ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSubscribers.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">কোনো সাবস্ক্রাইবার পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
}