'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, Clock, TrendingUp, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatsCard from '../components/admin/StatsCard';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 156,
    totalRevenue: 125000,
    activeSubscribers: 45,
    pendingSubscribers: 12,
  });

  const chartData = [
    { month: 'Jan', orders: 65, revenue: 45000 },
    { month: 'Feb', orders: 85, revenue: 62000 },
    { month: 'Mar', orders: 110, revenue: 78000 },
    { month: 'Apr', orders: 130, revenue: 95000 },
    { month: 'May', orders: 145, revenue: 110000 },
    { month: 'Jun', orders: 156, revenue: 125000 },
  ];

  const recentOrders = [
    { id: 'ORD001', user: 'রহিম', amount: 350, status: 'pending', date: '2024-01-15' },
    { id: 'ORD002', user: 'করিম', amount: 2500, status: 'delivered', date: '2024-01-14' },
    { id: 'ORD003', user: 'জবা', amount: 3500, status: 'preparing', date: '2024-01-14' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#111827] rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">ড্যাশবোর্ড ওভারভিউ</h1>
        <p className="text-blue-200">আজকের সমস্ত আপডেট এখানে দেখুন</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="মোট অর্ডার"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="blue"
          change="+12%"
        />
        <StatsCard
          title="মোট রেভিনিউ"
          value={`৳ ${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          change="+18%"
        />
        <StatsCard
          title="একটিভ সাবস্ক্রাইবার"
          value={stats.activeSubscribers}
          icon={Users}
          color="purple"
          change="+5%"
        />
        <StatsCard
          title="পেন্ডিং রিকোয়েস্ট"
          value={stats.pendingSubscribers}
          icon={Clock}
          color="orange"
          change="+2"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">অর্ডার ট্রেন্ড</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="orders" stroke="#3B82F6" fill="#3B82F680" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">রেভিনিউ ট্রেন্ড</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B98180" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">সাম্প্রতিক অর্ডার</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">অর্ডার আইডি</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ইউজার</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">এমাউন্ট</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">তারিখ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{order.id}</td>
                  <td className="px-4 py-3 text-sm">{order.user}</td>
                  <td className="px-4 py-3 text-sm">৳ {order.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status === 'delivered' ? 'ডেলিভারি হয়েছে' :
                       order.status === 'pending' ? 'পেন্ডিং' : 'প্রস্তুত হচ্ছে'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}   