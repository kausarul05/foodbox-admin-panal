'use client';

import React, { useState } from 'react';
import { Package, Edit, Trash2, Plus, Crown, Diamond, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PackageType {
  id: string;
  name: 'golden' | 'diamond';
  title: string;
  price: number;
  originalPrice: number;
  features: string[];
  isActive: boolean;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageType[]>([
    {
      id: '1',
      name: 'golden',
      title: 'গোল্ডেন প্যাকেজ',
      price: 2500,
      originalPrice: 3500,
      features: ['সপ্তাহের ৭ দিন ডেলিভারি', 'প্রতিদিন ৩ বেলা খাবার', 'ফ্রি হোম ডেলিভারি', 'এক্সট্রা আইটেম ফ্রি'],
      isActive: true,
    },
    {
      id: '2',
      name: 'diamond',
      title: 'ডায়মন্ড প্যাকেজ',
      price: 3500,
      originalPrice: 4500,
      features: ['সপ্তাহের ৭ দিন ডেলিভারি', 'প্রতিদিন ৩ বেলা খাবার', 'ফ্রি হোম ডেলিভারি + হট ব্যাগ', 'এক্সট্রা ডেজার্ট আইটেম ফ্রি', 'প্রায়োরিটি সাপোর্ট'],
      isActive: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    originalPrice: '',
    features: '',
  });

  const handleEdit = (pkg: PackageType) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      price: pkg.price.toString(),
      originalPrice: pkg.originalPrice.toString(),
      features: pkg.features.join(', '),
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingPackage) {
      const updatedPackages = packages.map(pkg =>
        pkg.id === editingPackage.id
          ? {
              ...pkg,
              title: formData.title,
              price: parseInt(formData.price),
              originalPrice: parseInt(formData.originalPrice),
              features: formData.features.split(',').map(f => f.trim()),
            }
          : pkg
      );
      setPackages(updatedPackages);
      toast.success('প্যাকেজ আপডেট হয়েছে!');
    }
    setShowModal(false);
    setEditingPackage(null);
    setFormData({ title: '', price: '', originalPrice: '', features: '' });
  };

  const toggleStatus = (id: string) => {
    setPackages(packages.map(pkg =>
      pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg
    ));
    toast.success('স্ট্যাটাস আপডেট হয়েছে!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">প্যাকেজ ম্যানেজমেন্ট</h1>
          <p className="text-gray-500 mt-1">গোল্ডেন ও ডায়মন্ড প্যাকেজ পরিচালনা করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${pkg.isActive ? 'border-[#3B82F6]' : 'border-gray-300'}`}>
            <div className={`p-6 ${pkg.name === 'golden' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {pkg.name === 'golden' ? <Crown size={32} /> : <Diamond size={32} />}
                  <div>
                    <h2 className="text-2xl font-bold">{pkg.title}</h2>
                    <p className="text-white/80 text-sm">
                      {pkg.isActive ? '✅ সক্রিয়' : '❌ নিষ্ক্রিয়'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(pkg.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    pkg.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  } transition-colors`}
                >
                  {pkg.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#3B82F6]">৳ {pkg.price}</span>
                <span className="text-gray-400 line-through ml-2">৳ {pkg.originalPrice}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleEdit(pkg)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                এডিট করুন
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">প্যাকেজ এডিট করুন</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">টাইটেল</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">মূল্য (৳)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">মূল মূল্য (৳)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">ফিচারসমূহ (কমা দিয়ে আলাদা করুন)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-br from-[#3B82F6] to-[#111827] text-white py-2 rounded-lg font-semibold"
              >
                সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}