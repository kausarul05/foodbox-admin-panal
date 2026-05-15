'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Save, X, Plus, Loader2, RefreshCw, Utensils, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { menuAPI, packageAPI } from '@/app/lib/api';

interface MenuItem {
  _id?: string;
  day: string;
  morning: string;
  lunch: string;
  dinner: string;
  package: string;
  price: number;
  isActive?: boolean;
}

interface PackageType {
  _id: string;
  name: string;
  title: string;
  price: number;
  originalPrice: number;
  features: string[];
  isActive: boolean;
}

export default function WeeklyMenuPage() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [editingCell, setEditingCell] = useState<{ day: string; meal: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [menuData, setMenuData] = useState<{ [key: string]: MenuItem[] }>({});

  const days = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];

  // Fetch packages on load
  useEffect(() => {
    fetchPackages();
  }, []);

  // Fetch menu data when package changes
  useEffect(() => {
    if (selectedPackageId) {
      fetchMenuData();
    }
  }, [selectedPackageId]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await packageAPI.getAllPackages();
      console.log('Packages response:', response);
      
      if (response.success && response.data && response.data.length > 0) {
        const activePackages = response.data.filter((pkg: PackageType) => pkg.isActive);
        setPackages(activePackages);
        if (activePackages.length > 0) {
          setSelectedPackageId(activePackages[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('প্যাকেজ লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuData = async () => {
    try {
      setSaving(true);
      const selectedPkg = packages.find(p => p._id === selectedPackageId);
      if (!selectedPkg) return;
      
      const response = await menuAPI.getMenuByPackage(selectedPkg.name);
      console.log('Menu response:', response);
      
      if (response.success && response.data && response.data.length > 0) {
        const sortedData = response.data.sort((a: MenuItem, b: MenuItem) => 
          days.indexOf(a.day) - days.indexOf(b.day)
        );
        setMenuData(prev => ({ ...prev, [selectedPackageId]: sortedData }));
      } else {
        setMenuData(prev => ({ ...prev, [selectedPackageId]: [] }));
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('মেনু লোড করতে ব্যর্থ হয়েছে');
      setMenuData(prev => ({ ...prev, [selectedPackageId]: [] }));
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewMenu = async () => {
    const selectedPkg = packages.find(p => p._id === selectedPackageId);
    if (!selectedPkg) return;

    const defaultMenuItems = days.map(day => ({
      day,
      package: selectedPkg.name,
      morning: 'নতুন আইটেম যোগ করুন',
      lunch: 'নতুন আইটেম যোগ করুন',
      dinner: 'নতুন আইটেম যোগ করুন',
      price: 50,
    }));

    try {
      setSaving(true);
      
      for (const item of defaultMenuItems) {
        await menuAPI.createMenuItem(item);
      }
      
      toast.success('নতুন মেনু তৈরি হয়েছে!');
      await fetchMenuData();
      
    } catch (error) {
      console.error('Error creating menu:', error);
      toast.error('মেনু তৈরি করতে ব্যর্থ হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSingleDayMenu = async (day: string) => {
    const selectedPkg = packages.find(p => p._id === selectedPackageId);
    if (!selectedPkg) return;

    const defaultMenuItem = {
      day,
      package: selectedPkg.name,
      morning: 'নতুন আইটেম যোগ করুন',
      lunch: 'নতুন আইটেম যোগ করুন',
      dinner: 'নতুন আইটেম যোগ করুন',
      price: 50,
    };

    try {
      setSaving(true);
      const response = await menuAPI.createMenuItem(defaultMenuItem);
      
      if (response.success) {
        toast.success(`${day} এর মেনু যোগ হয়েছে!`);
        await fetchMenuData();
      }
    } catch (error) {
      console.error('Error creating menu item:', error);
      toast.error('মেনু আইটেম তৈরি করতে ব্যর্থ হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (day: string, meal: string, currentValue: string) => {
    setEditingCell({ day, meal });
    setEditValue(currentValue);
  };

  const handleSave = async () => {
    if (!editingCell) return;

    const selectedPkg = packages.find(p => p._id === selectedPackageId);
    if (!selectedPkg) return;

    try {
      setSaving(true);
      
      const currentMenu = menuData[selectedPackageId] || [];
      const updatedMenu = currentMenu.map(item => {
        if (item.day === editingCell.day) {
          return { ...item, [editingCell.meal]: editValue };
        }
        return item;
      });
      
      setMenuData(prev => ({ ...prev, [selectedPackageId]: updatedMenu }));

      const updatedItem = updatedMenu.find(item => item.day === editingCell.day);
      
      if (updatedItem) {
        const menuDataToSave = {
          day: updatedItem.day,
          package: selectedPkg.name,
          morning: updatedItem.morning,
          lunch: updatedItem.lunch,
          dinner: updatedItem.dinner,
          price: updatedItem.price,
        };

        if (updatedItem._id) {
          await menuAPI.updateMenuItem(updatedItem._id, menuDataToSave);
        } else {
          await menuAPI.createMenuItem(menuDataToSave);
        }
        
        toast.success('মেনু আপডেট হয়েছে!');
      }
      
      setEditingCell(null);
      setEditValue('');
      await fetchMenuData();
      
    } catch (error: any) {
      console.error('Error saving menu:', error);
      toast.error(error.message || 'মেনু সেভ করতে ব্যর্থ হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const meals = [
    { key: 'morning', label: 'সকালের খাবার', icon: '🌅' },
    { key: 'lunch', label: 'দুপুরের খাবার', icon: '☀️' },
    { key: 'dinner', label: 'রাতের খাবার', icon: '🌙' },
  ];

  const currentMenu = menuData[selectedPackageId] || [];
  const selectedPackage = packages.find(p => p._id === selectedPackageId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">উইকলি মেনু ম্যানেজমেন্ট</h1>
          <p className="text-gray-500 mt-1">প্যাকেজের মেনু এডিট করুন</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">কোনো প্যাকেজ নেই</h3>
          <p className="text-gray-500 mb-6">প্যাকেজ ম্যানেজমেন্ট থেকে প্রথমে একটি প্যাকেজ তৈরি করুন</p>
        </div>
      </div>
    );
  }

  // Show empty state if no menu exists
  if (currentMenu.length === 0 && !saving) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">উইকলি মেনু ম্যানেজমেন্ট</h1>
            <p className="text-gray-500 mt-1">{selectedPackage?.title} প্যাকেজের মেনু এডিট করুন</p>
          </div>
        </div>

        {/* Package Selection Buttons - Dynamic */}
        <div className="flex flex-wrap gap-4">
          {packages.map((pkg) => (
            <button
              key={pkg._id}
              onClick={() => setSelectedPackageId(pkg._id)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                selectedPackageId === pkg._id
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#111827] text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {pkg.title}
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">কোনো মেনু পাওয়া যায়নি</h3>
          <p className="text-gray-500 mb-6">
            {selectedPackage?.title} প্যাকেজের জন্য এখনো কোনো মেনু তৈরি করা হয়নি।
          </p>
          <button
            onClick={handleAddNewMenu}
            disabled={saving}
            className="bg-gradient-to-br from-[#3B82F6] to-[#111827] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
            নতুন মেনু তৈরি করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">উইকলি মেনু ম্যানেজমেন্ট</h1>
          <p className="text-gray-500 mt-1">{selectedPackage?.title} প্যাকেজের মেনু এডিট করুন</p>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={fetchMenuData}
          disabled={saving}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
        >
          <RefreshCw size={18} className={saving ? 'animate-spin' : ''} />
          রিফ্রেশ
        </button>
      </div>

      {/* Package Selection Buttons - Dynamic */}
      <div className="flex flex-wrap gap-4">
        {packages.map((pkg) => (
          <button
            key={pkg._id}
            onClick={() => setSelectedPackageId(pkg._id)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              selectedPackageId === pkg._id
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#111827] text-white shadow-lg'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {pkg.title}
          </button>
        ))}
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#3B82F6] to-[#111827]">
              <tr>
                <th className="px-4 py-3 text-left text-white font-semibold">দিন</th>
                {meals.map(meal => (
                  <th key={meal.key} className="px-4 py-3 text-left text-white font-semibold">
                    {meal.icon} {meal.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {days.map((day) => {
                const menuItem = currentMenu.find(item => item.day === day);
                
                if (!menuItem) {
                  return (
                    <tr key={day} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{day}</td>
                      <td colSpan={3} className="px-4 py-3 text-center text-gray-400">
                        <button
                          onClick={() => handleAddSingleDayMenu(day)}
                          disabled={saving}
                          className="text-[#3B82F6] hover:text-blue-700 text-sm flex items-center gap-1 mx-auto"
                        >
                          <Plus size={14} />
                          মেনু যোগ করুন
                        </button>
                      </td>
                    </tr>
                  );
                }
                
                return (
                  <tr key={day} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{menuItem.day}</td>
                    {meals.map(meal => (
                      <td key={meal.key} className="px-4 py-3">
                        {editingCell?.day === menuItem.day && editingCell?.meal === meal.key ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                              autoFocus
                            />
                            <button 
                              onClick={handleSave} 
                              disabled={saving}
                              className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                            >
                              <Save size={16} />
                            </button>
                            <button 
                              onClick={() => setEditingCell(null)} 
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center group">
                            <span className="text-gray-700">{menuItem[meal.key as keyof MenuItem]}</span>
                            <button
                              onClick={() => handleEdit(menuItem.day, meal.key, menuItem[meal.key as keyof MenuItem] as string)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-[#3B82F6] transition"
                            >
                              <Edit size={14} />
                            </button>
                          </div>
                        )}
                       </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            💡 টিপ: কোনো খাবারের নামের উপর ক্লিক করলে এডিট করতে পারবেন
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-800 flex items-center gap-2">
            💾 প্রতিটি পরিবর্তন স্বয়ংক্রিয়ভাবে সেভ হয়ে যায়
          </p>
        </div>
      </div>
    </div>
  );
}