'use client';

import React, { useState } from 'react';
import { Calendar, Edit, Save, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  day: string;
  morning: string;
  lunch: string;
  dinner: string;
  package: 'golden' | 'diamond';
  price: number;
}

export default function WeeklyMenuPage() {
  const [selectedPackage, setSelectedPackage] = useState<'golden' | 'diamond'>('golden');
  const [editingCell, setEditingCell] = useState<{ day: string; meal: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const [goldenMenu, setGoldenMenu] = useState([
    { day: 'শনিবার', morning: 'খিচুড়ি-ডিম (৫০)', lunch: 'মুরগি-ভাত-ডাল (৫০)', dinner: 'মাছ-ভাত-ডাল (৫০)' },
    { day: 'রবিবার', morning: 'ভাত-ডাল-ভাজি (৫০)', lunch: 'মাছ-ভাত-ডাল (৫০)', dinner: 'ডিম ভুনা-ভাত-ডাল (৫০)' },
    { day: 'সোমবার', morning: 'খিচুড়ি-ডিম (৫০)', lunch: 'মুরগি-ভাত-ডাল (৫০)', dinner: 'স্টিকি-ভাত-ডাল (৫০)' },
    { day: 'মঙ্গলবার', morning: 'ভাত-ডাল-ভাজি (৫০)', lunch: 'মাছ-ভাত-ডাল (৫০)', dinner: 'ডিম ভুনা-ভাত-ডাল (৫০)' },
    { day: 'বুধবার', morning: 'খিচুড়ি-ডিম (৫০)', lunch: 'স্টিকি-ভাত-ডাল (৫০)', dinner: 'মুরগি-ভাত-ডাল (৫০)' },
    { day: 'বৃহস্পতিবার', morning: 'ডিম ভুনা-ভাত (৫০)', lunch: 'ডিম ভুনা-ভাত-ডাল (৫০)', dinner: 'মাছ-ভাত-ডাল (৫০)' },
    { day: 'শুক্রবার', morning: 'ভাত-ডাল-ভাজি (৫০)', lunch: 'FoodBox Special (৫০)', dinner: 'স্টিকি-ভাত-ডাল (৫০)' },
  ]);

  const [diamondMenu, setDiamondMenu] = useState([
    { day: 'শনিবার', morning: 'বিরিয়ানি + ডিম (১২০)', lunch: 'গরুর মাংস + পোলাও (১৫০)', dinner: 'রুটি + মুরগি মুসল্লম (১৩০)' },
    { day: 'রবিবার', morning: 'নুডুলস + ডিম (১০০)', lunch: 'খাসির মাংস + ভাত (১৬০)', dinner: 'ফিশ ফ্রাই + ফ্রাই (১৪০)' },
    { day: 'সোমবার', morning: 'পরোটা + গরুর মাংস (১১০)', lunch: 'চিকেন ফ্রাইড রাইস (১৪০)', dinner: 'স্যুপ + বার্গার (১২০)' },
    { day: 'মঙ্গলবার', morning: 'পাস্তা + চিজ (৯০)', lunch: 'গরুর কিডনি ভুনা (১৫০)', dinner: 'গ্রিলড চিকেন (১৩০)' },
    { day: 'বুধবার', morning: 'ফুচকা + চটপটি (৮০)', lunch: 'ইলিশ মাছ + ভাত (১৮০)', dinner: 'চিংড়ি মালাইকারি (১৬০)' },
    { day: 'বৃহস্পতিবার', morning: 'কাচ্চি বিরিয়ানি (১৫০)', lunch: 'তেহারি + গরুর মাংস (১৪০)', dinner: 'পিৎজা + ড্রিংকস (১৩০)' },
    { day: 'শুক্রবার', morning: 'বার্গার + ফ্রাই (১২০)', lunch: 'স্পেশাল প্লেটার (২০০)', dinner: 'বুফে ডিনার (২৫০)' },
  ]);

  const currentMenu = selectedPackage === 'golden' ? goldenMenu : diamondMenu;

  const handleEdit = (day: string, meal: string, currentValue: string) => {
    setEditingCell({ day, meal });
    setEditValue(currentValue);
  };

  const handleSave = () => {
    if (!editingCell) return;

    if (selectedPackage === 'golden') {
      const updatedMenu = goldenMenu.map(item => {
        if (item.day === editingCell.day) {
          return { ...item, [editingCell.meal]: editValue };
        }
        return item;
      });
      setGoldenMenu(updatedMenu);
    } else {
      const updatedMenu = diamondMenu.map(item => {
        if (item.day === editingCell.day) {
          return { ...item, [editingCell.meal]: editValue };
        }
        return item;
      });
      setDiamondMenu(updatedMenu);
    }

    toast.success('মেনু আপডেট হয়েছে!');
    setEditingCell(null);
    setEditValue('');
  };

  const meals = [
    { key: 'morning', label: 'সকালের খাবার', icon: '🌅' },
    { key: 'lunch', label: 'দুপুরের খাবার', icon: '☀️' },
    { key: 'dinner', label: 'রাতের খাবার', icon: '🌙' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">উইকলি মেনু ম্যানেজমেন্ট</h1>
        <p className="text-gray-500 mt-1">গোল্ডেন ও ডায়মন্ড প্যাকেজের মেনু এডিট করুন</p>
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
              {currentMenu.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.day}</td>
                  {meals.map(meal => (
                    <td key={meal.key} className="px-4 py-3">
                      {editingCell?.day === item.day && editingCell?.meal === meal.key ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                            autoFocus
                          />
                          <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <Save size={16} />
                          </button>
                          <button onClick={() => setEditingCell(null)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center group">
                          <span className="text-gray-700">{item[meal.key as keyof typeof item]}</span>
                          <button
                            onClick={() => handleEdit(item.day, meal.key, item[meal.key as keyof typeof item] as string)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-[#3B82F6] transition"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Edit Note */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 টিপ: কোনো খাবারের নামের উপর ক্লিক করলে এডিট করতে পারবেন
        </p>
      </div>
    </div>
  );
}