'use client';

import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, UserPlus, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface PendingSubscriber {
  id: string;
  userName: string;
  phoneNumber: string;
  email: string;
  package: 'golden' | 'diamond';
  requestedDate: string;
  address: string;
  zone: string;
  paymentMethod: string;
}

export default function PendingSubscribersPage() {
  const [pendingSubscribers, setPendingSubscribers] = useState<PendingSubscriber[]>([
    {
      id: 'PEND001',
      userName: 'শাকিল হোসেন',
      phoneNumber: '+8801712345678',
      email: 'shakil@gmail.com',
      package: 'golden',
      requestedDate: '2024-01-15',
      address: 'ধানমন্ডি ৩২, ঢাকা',
      zone: 'ধানমন্ডি',
      paymentMethod: 'bkash',
    },
    {
      id: 'PEND002',
      userName: 'নাজমুল হাসান',
      phoneNumber: '+8801812345678',
      email: 'nazmul@gmail.com',
      package: 'diamond',
      requestedDate: '2024-01-14',
      address: 'গুলশান ১, ঢাকা',
      zone: 'গুলশান',
      paymentMethod: 'nagad',
    },
    {
      id: 'PEND003',
      userName: 'ফারজানা আক্তার',
      phoneNumber: '+8801912345678',
      email: 'farzana@gmail.com',
      package: 'golden',
      requestedDate: '2024-01-14',
      address: 'উত্তরা ১২, ঢাকা',
      zone: 'উত্তরা',
      paymentMethod: 'bank',
    },
  ]);

  const handleApprove = (id: string) => {
    setPendingSubscribers(pendingSubscribers.filter(sub => sub.id !== id));
    toast.success('সাবস্ক্রিপশন অনুমোদন করা হয়েছে!');
  };

  const handleReject = (id: string) => {
    setPendingSubscribers(pendingSubscribers.filter(sub => sub.id !== id));
    toast.error('সাবস্ক্রিপশন বাতিল করা হয়েছে!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">পেন্ডিং সাবস্ক্রাইবার</h1>
        <p className="text-gray-500 mt-1">অ্যাডমিন কনফার্মেশনের অপেক্ষায় থাকা সাবস্ক্রাইবার</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingSubscribers.map((sub) => (
          <div key={sub.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className={`p-4 ${sub.package === 'golden' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{sub.userName}</h3>
                  <p className="text-white/80 text-sm">রিকোয়েস্টেড: {sub.requestedDate}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(sub.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    <CheckCircle size={16} />
                    অনুমোদন
                  </button>
                  <button
                    onClick={() => handleReject(sub.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    <XCircle size={16} />
                    বাতিল
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">ফোন নাম্বার</p>
                    <p className="font-medium">{sub.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">ইমেইল</p>
                    <p className="font-medium">{sub.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">জোন</p>
                    <p className="font-medium">{sub.zone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">প্যাকেজ</p>
                    <p className={`font-semibold ${sub.package === 'golden' ? 'text-amber-600' : 'text-purple-600'}`}>
                      {sub.package === 'golden' ? 'গোল্ডেন প্যাকেজ' : 'ডায়মন্ড প্যাকেজ'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">পেমেন্ট মেথড</p>
                    <p className="font-medium capitalize">{sub.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ঠিকানা</p>
                    <p className="font-medium text-sm">{sub.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pendingSubscribers.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <UserPlus size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">কোনো পেন্ডিং সাবস্ক্রাইবার নেই</p>
          <p className="text-sm text-gray-400 mt-1">সমস্ত রিকোয়েস্ট প্রসেস করা হয়েছে</p>
        </div>
      )}
    </div>
  );
}