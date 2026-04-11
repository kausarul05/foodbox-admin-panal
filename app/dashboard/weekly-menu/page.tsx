'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Save, X, Plus, Loader2, RefreshCw, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';
import { menuAPI } from '@/app/lib/api';

interface MenuItem {
  _id?: string;
  day: string;
  morning: string;
  lunch: string;
  dinner: string;
  package: 'golden' | 'diamond';
  price: number;
  isActive?: boolean;
}

export default function WeeklyMenuPage() {
  const [selectedPackage, setSelectedPackage] = useState<'golden' | 'diamond'>('golden');
  const [editingCell, setEditingCell] = useState<{ day: string; meal: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [goldenMenu, setGoldenMenu] = useState<MenuItem[]>([]);
  const [diamondMenu, setDiamondMenu] = useState<MenuItem[]>([]);

  const days = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];

  // Fetch menu data on load and when package changes
  useEffect(() => {
    fetchMenuData();
  }, [selectedPackage]);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getMenuByPackage(selectedPackage);
      console.log('Menu response:', response);
      
      if (response.success && response.data && response.data.length > 0) {
        // Sort by day order
        const sortedData = response.data.sort((a: MenuItem, b: MenuItem) => 
          days.indexOf(a.day) - days.indexOf(b.day)
        );
        
        if (selectedPackage === 'golden') {
          setGoldenMenu(sortedData);
        } else {
          setDiamondMenu(sortedData);
        }
      } else {
        // No data from API - set empty array
        if (selectedPackage === 'golden') {
          setGoldenMenu([]);
        } else {
          setDiamondMenu([]);
        }
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('মেনু লোড করতে ব্যর্থ হয়েছে');
      // Set empty array on error
      if (selectedPackage === 'golden') {
        setGoldenMenu([]);
      } else {
        setDiamondMenu([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewMenu = async () => {
    // Create default menu for all days
    const defaultMenuItems = days.map(day => ({
      day,
      package: selectedPackage,
      morning: 'নতুন আইটেম যোগ করুন',
      lunch: 'নতুন আইটেম যোগ করুন',
      dinner: 'নতুন আইটেম যোগ করুন',
      price: 50,
    }));

    try {
      setSaving(true);
      
      // Create all menu items
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
    const defaultMenuItem = {
      day,
      package: selectedPackage,
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

    try {
      setSaving(true);
      
      let updatedMenu;
      if (selectedPackage === 'golden') {
        updatedMenu = goldenMenu.map(item => {
          if (item.day === editingCell.day) {
            return { ...item, [editingCell.meal]: editValue };
          }
          return item;
        });
        setGoldenMenu(updatedMenu);
      } else {
        updatedMenu = diamondMenu.map(item => {
          if (item.day === editingCell.day) {
            return { ...item, [editingCell.meal]: editValue };
          }
          return item;
        });
        setDiamondMenu(updatedMenu);
      }

      // Find the updated item
      const updatedItem = updatedMenu.find(item => item.day === editingCell.day);
      
      if (updatedItem) {
        // Prepare data for API
        const menuData = {
          day: updatedItem.day,
          package: selectedPackage,
          morning: updatedItem.morning,
          lunch: updatedItem.lunch,
          dinner: updatedItem.dinner,
          price: updatedItem.price,
        };

        // If item has _id, update existing, otherwise create new
        if (updatedItem._id) {
          await menuAPI.updateMenuItem(updatedItem._id, menuData);
        } else {
          await menuAPI.createMenuItem(menuData);
        }
        
        toast.success('মেনু আপডেট হয়েছে!');
      }
      
      setEditingCell(null);
      setEditValue('');
      
      // Refresh data from API
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

  const currentMenu = selectedPackage === 'golden' ? goldenMenu : diamondMenu;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">মেনু লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no menu exists
  if (currentMenu.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">উইকলি মেনু ম্যানেজমেন্ট</h1>
            <p className="text-gray-500 mt-1">গোল্ডেন ও ডায়মন্ড প্যাকেজের মেনু এডিট করুন</p>
          </div>
        </div>

        {/* Package Toggle */}
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedPackage('golden')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              selectedPackage === 'golden'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            ✨ গোল্ডেন প্যাকেজ
          </button>
          <button
            onClick={() => setSelectedPackage('diamond')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              selectedPackage === 'diamond'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            💎 ডায়মন্ড প্যাকেজ
          </button>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">কোনো মেনু পাওয়া যায়নি</h3>
          <p className="text-gray-500 mb-6">
            {selectedPackage === 'golden' ? 'গোল্ডেন প্যাকেজের' : 'ডায়মন্ড প্যাকেজের'} জন্য এখনো কোনো মেনু তৈরি করা হয়নি।
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
          <p className="text-gray-500 mt-1">গোল্ডেন ও ডায়মন্ড প্যাকেজের মেনু এডিট করুন</p>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={fetchMenuData}
          disabled={loading}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          রিফ্রেশ
        </button>
      </div>

      {/* Package Toggle */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedPackage('golden')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            selectedPackage === 'golden'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          ✨ গোল্ডেন প্যাকেজ
        </button>
        <button
          onClick={() => setSelectedPackage('diamond')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            selectedPackage === 'diamond'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          💎 ডায়মন্ড প্যাকেজ
        </button>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={selectedPackage === 'golden' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'}>
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
                    <tr key={day} className="hover:bg-gray-50 text-black">
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
                      <td key={meal.key} className="px-4 py-3 text-black">
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