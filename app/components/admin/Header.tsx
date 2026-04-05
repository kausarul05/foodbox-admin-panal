'use client';

import React from 'react';
import { Bell, User, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">স্বাগতম, অ্যাডমিন</h2>
          <p className="text-sm text-gray-500">আজকের ড্যাশবোর্ড ওভারভিউ</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="bg-gradient-to-br from-[#3B82F6] to-[#111827] p-2 rounded-full">
              <User size={18} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">অ্যাডমিন</p>
              <p className="text-xs text-gray-500">সুপার অ্যাডমিন</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;