'use client';

import React, { useState } from 'react';
import { Settings, Bell, Shield, Globe, Mail, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'FoodBox',
    adminEmail: 'admin@foodbox.com',
    phoneNumber: '+8801913945595',
    deliveryCharge: 50,
    minOrderAmount: 300,
    notificationEmail: true,
    notificationSMS: true,
    autoConfirmOrder: false,
  });

  const handleSave = () => {
    toast.success('সেটিংস সেভ হয়েছে!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">সেটিংস</h1>
        <p className="text-gray-500 mt-1">অ্যাডমিন প্যানেলের সেটিংস কনফিগার করুন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe size={24} className="text-[#3B82F6]" />
              <h2 className="text-xl font-bold text-gray-800">জেনারেল সেটিংস</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">সাইটের নাম</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">অ্যাডমিন ইমেইল</label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">ফোন নাম্বার</label>
                <input
                  type="text"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">ডেলিভারি চার্জ (৳)</label>
                  <input
                    type="number"
                    value={settings.deliveryCharge}
                    onChange={(e) => setSettings({ ...settings, deliveryCharge: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">ন্যূনতম অর্ডার (৳)</label>
                  <input
                    type="number"
                    value={settings.minOrderAmount}
                    onChange={(e) => setSettings({ ...settings, minOrderAmount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={24} className="text-[#3B82F6]" />
              <h2 className="text-xl font-bold text-gray-800">নোটিফিকেশন সেটিংস</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">ইমেইল নোটিফিকেশন</span>
                <input
                  type="checkbox"
                  checked={settings.notificationEmail}
                  onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.checked })}
                  className="w-5 h-5 text-[#3B82F6] rounded focus:ring-[#3B82F6]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">এসএমএস নোটিফিকেশন</span>
                <input
                  type="checkbox"
                  checked={settings.notificationSMS}
                  onChange={(e) => setSettings({ ...settings, notificationSMS: e.target.checked })}
                  className="w-5 h-5 text-[#3B82F6] rounded focus:ring-[#3B82F6]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">অটো কনফার্ম অর্ডার</span>
                <input
                  type="checkbox"
                  checked={settings.autoConfirmOrder}
                  onChange={(e) => setSettings({ ...settings, autoConfirmOrder: e.target.checked })}
                  className="w-5 h-5 text-[#3B82F6] rounded focus:ring-[#3B82F6]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={24} className="text-[#3B82F6]" />
              <h2 className="text-xl font-bold text-gray-800">সিকিউরিটি</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">বর্তমান পাসওয়ার্ড</label>
                <input
                  type="password"
                  placeholder="বর্তমান পাসওয়ার্ড"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">নতুন পাসওয়ার্ড</label>
                <input
                  type="password"
                  placeholder="নতুন পাসওয়ার্ড"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">কনফার্ম পাসওয়ার্ড</label>
                <input
                  type="password"
                  placeholder="কনফার্ম পাসওয়ার্ড"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition">
                পাসওয়ার্ড পরিবর্তন করুন
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail size={24} className="text-[#3B82F6]" />
              <h2 className="text-xl font-bold text-gray-800">ব্যাকআপ</h2>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
              ডাটাবেজ ব্যাকআপ নিন
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-gradient-to-br from-[#3B82F6] to-[#111827] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <Save size={18} />
          সেটিংস সেভ করুন
        </button>
      </div>
    </div>
  );
}