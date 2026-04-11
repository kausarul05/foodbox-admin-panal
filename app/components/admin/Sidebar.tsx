'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Calendar,
  ShoppingBag,
  Users,
  Clock,
  Settings,
  LogOut,
  Crown,
  Diamond
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/app/lib/api';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'ড্যাশবোর্ড', href: '/dashboard', icon: LayoutDashboard },
    { name: 'প্যাকেজ ম্যানেজ', href: '/dashboard/packages', icon: Package },
    { name: 'উইকলি মেনু', href: '/dashboard/weekly-menu', icon: Calendar },
    { name: 'অর্ডার লিস্ট', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'সাবস্ক্রাইবার লিস্ট', href: '/dashboard/subscribers', icon: Users },
    { name: 'পেন্ডিং সাবস্ক্রাইবার', href: '/dashboard/pending-subscribers', icon: Clock },
    { name: 'সেটিংস', href: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');

    // Clear sessionStorage if used
    sessionStorage.clear();

    // Show success message
    toast.success('লগআউট সফল হয়েছে!');

    // Redirect to login page
    router.push('/login');
  };

  return (
    <aside className="w-72 bg-gradient-to-br from-[#3B82F6] to-[#111827] text-white flex flex-col">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">FoodBox Admin</h1>
            <p className="text-blue-200 text-xs">ম্যানেজমেন্ট প্যানেল</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  এখন
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">লগআউট</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;