'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Loader2,
  RefreshCw,
  DollarSign,
  ShoppingBag,
  Users,
  User,
  Calendar,
  MapPin,
  Phone,
  Package as PackageIcon,
  X,
  CreditCard,
  Home,
  Utensils
} from 'lucide-react';
import { orderAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderId: string;
  userId: string;
  userName: string;
  phoneNumber: string;
  package: string;
  paymentMethod: string;
  orderType?: 'self' | 'guest';
  items: Array<{ name: string; price: number; quantity: number }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  orderDate: string;
  deliveryDate: string;
  address: string;
  zone: string;
  specialInstructions?: string;
  deliveryTime?: string;
  deliveryCharge?: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchSubscriptionOrders();
  }, []);

  const fetchSubscriptionOrders = async () => {
    try {
      setLoading(true);
      // Only fetch wallet/subscription orders
      const response = await orderAPI.getAllOrders({ paymentMethod: 'wallet' });
      console.log('Subscription Orders response:', response);
      
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching subscription orders:', error);
      toast.error('অর্ডার লোড করতে ব্যর্থ হয়েছে');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await orderAPI.updateOrderStatus(orderId, newStatus);
      
      if (response.success) {
        toast.success(`অর্ডার স্ট্যাটাস আপডেট হয়েছে: ${getStatusText(newStatus)}`);
        await fetchSubscriptionOrders();
      } else {
        toast.error(response.message || 'স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে');
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const openDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'পেন্ডিং';
      case 'confirmed': return 'কনফার্মড';
      case 'preparing': return 'প্রস্তুত হচ্ছে';
      case 'out_for_delivery': return 'ডেলিভারিতে';
      case 'delivered': return 'ডেলিভারি হয়েছে';
      case 'cancelled': return 'বাতিল';
      default: return status;
    }
  };

  const getPaymentMethodBadge = (paymentMethod: string) => {
    switch(paymentMethod) {
      case 'wallet':
        return { color: 'bg-green-100 text-green-700', text: 'ওয়ালেট' };
      case 'subscription':
        return { color: 'bg-blue-100 text-blue-700', text: 'সাবস্ক্রিপশন' };
      default:
        return { color: 'bg-gray-100 text-gray-700', text: paymentMethod };
    }
  };

  const getMealTimeText = (time?: string) => {
    switch(time) {
      case 'morning': return 'সকালের খাবার';
      case 'lunch': return 'দুপুরের খাবার';
      case 'dinner': return 'রাতের খাবার';
      default: return 'N/A';
    }
  };

  const getStatusButtons = (order: Order) => {
    const buttons = [];
    
    switch(order.status) {
      case 'pending':
        buttons.push(
          <button
            key="confirm"
            onClick={() => updateOrderStatus(order._id, 'confirmed')}
            disabled={updatingOrderId === order._id}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm"
          >
            {updatingOrderId === order._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            কনফার্ম
          </button>
        );
        break;
      case 'confirmed':
        buttons.push(
          <button
            key="prepare"
            onClick={() => updateOrderStatus(order._id, 'preparing')}
            disabled={updatingOrderId === order._id}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 text-sm"
          >
            {updatingOrderId === order._id ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
            প্রস্তুত
          </button>
        );
        break;
      case 'preparing':
        buttons.push(
          <button
            key="out_for_delivery"
            onClick={() => updateOrderStatus(order._id, 'out_for_delivery')}
            disabled={updatingOrderId === order._id}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
          >
            {updatingOrderId === order._id ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
            ডেলিভারি
          </button>
        );
        break;
      case 'out_for_delivery':
        buttons.push(
          <button
            key="deliver"
            onClick={() => updateOrderStatus(order._id, 'delivered')}
            disabled={updatingOrderId === order._id}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm"
          >
            {updatingOrderId === order._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            সম্পন্ন
          </button>
        );
        break;
    }
    
    if (!['delivered', 'cancelled'].includes(order.status)) {
      buttons.push(
        <button
          key="cancel"
          onClick={() => updateOrderStatus(order._id, 'cancelled')}
          disabled={updatingOrderId === order._id}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm"
        >
          {updatingOrderId === order._id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
          বাতিল
        </button>
      );
    }
    
    return buttons;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.phoneNumber?.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'সব স্ট্যাটাস' },
    { value: 'pending', label: 'পেন্ডিং' },
    { value: 'confirmed', label: 'কনফার্মড' },
    { value: 'preparing', label: 'প্রস্তুত হচ্ছে' },
    { value: 'out_for_delivery', label: 'ডেলিভারিতে' },
    { value: 'delivered', label: 'ডেলিভারি হয়েছে' },
    { value: 'cancelled', label: 'বাতিল' },
  ];

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">অর্ডার লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">সাবস্ক্রিপশন অর্ডার লিস্ট</h1>
          <p className="text-gray-500 mt-1">সাবস্ক্রিপশন/ওয়ালেট এর অর্ডার দেখুন এবং ম্যানেজ করুন</p>
        </div>
        <button
          onClick={fetchSubscriptionOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          রিফ্রেশ
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">মোট সাবস্ক্রিপশন অর্ডার</p>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">পেন্ডিং অর্ডার</p>
              <p className="text-2xl font-bold text-gray-800">{pendingOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ডেলিভারি সম্পন্ন</p>
              <p className="text-2xl font-bold text-gray-800">{deliveredOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">মোট রেভিনিউ</p>
              <p className="text-2xl font-bold text-green-600">৳ {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="অর্ডার আইডি, নাম বা ফোন নম্বর দিয়ে সার্চ করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-800"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-800 appearance-none bg-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500">কোনো সাবস্ক্রিপশন অর্ডার পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const paymentBadge = getPaymentMethodBadge(order.paymentMethod);

            return (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                {/* Card Header */}
                <div className="p-4 bg-gradient-to-r from-[#3B82F6] to-[#111827] text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono opacity-80">#{order.orderId || order._id.slice(-8)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">৳ {order.totalAmount}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${paymentBadge.color}`}>
                        {paymentBadge.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800">{order.userName}</p>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <Phone size={14} />
                      <span>{order.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">অর্ডারের তারিখ</p>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ডেলিভারির তারিখ</p>
                      <p className="text-sm font-medium text-gray-800">
                        {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('bn-BD') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">জোন</p>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" />
                        <p className="text-sm font-medium text-gray-800">{order.zone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">প্যাকেজ</p>
                      <div className="flex items-center gap-1">
                        <PackageIcon size={12} className="text-gray-400" />
                        <p className="text-sm font-medium text-gray-800">{order.package}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">আইটেম</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {order.items?.map(item => `${item.name} (x${item.quantity})`).join(', ') || 'N/A'}
                    </p>
                  </div>

                  <div className="pt-1">
                    <p className="text-xs text-gray-500 mb-1">ডেলিভারি ঠিকানা</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{order.address}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                    {getStatusButtons(order)}
                    <button
                      onClick={() => openDetailsModal(order)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      <Eye size={14} />
                      বিস্তারিত
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">অর্ডার বিস্তারিত</h2>
                <p className="text-sm text-gray-500">অর্ডার আইডি: #{selectedOrder.orderId || selectedOrder._id.slice(-8)}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status and Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${selectedOrder.status === 'delivered' ? 'bg-green-500' : selectedOrder.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    <p className="text-sm font-medium text-gray-600">বর্তমান স্ট্যাটাস</p>
                  </div>
                  <p className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">পেমেন্ট তথ্য</p>
                  <div className="space-y-1">
                    <p className="text-sm">পেমেন্ট মেথড: <span className="font-semibold">{getPaymentMethodBadge(selectedOrder.paymentMethod).text}</span></p>
                    <p className="text-2xl font-bold text-[#3B82F6]">৳ {selectedOrder.totalAmount}</p>
                    {selectedOrder.deliveryCharge && (
                      <p className="text-sm text-gray-500">ডেলিভারি চার্জ: ৳ {selectedOrder.deliveryCharge}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User size={18} className="text-[#3B82F6]" />
                  গ্রাহকের তথ্য
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">নাম</p>
                    <p className="text-sm font-medium">{selectedOrder.userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ফোন নাম্বার</p>
                    <p className="text-sm font-medium">{selectedOrder.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">জোন</p>
                    <p className="text-sm font-medium">{selectedOrder.zone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ঠিকানা</p>
                    <p className="text-sm font-medium">{selectedOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-[#3B82F6]" />
                  অর্ডারের তথ্য
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">অর্ডারের তারিখ</p>
                    <p className="text-sm font-medium">{new Date(selectedOrder.createdAt).toLocaleString('bn-BD')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ডেলিভারির তারিখ</p>
                    <p className="text-sm font-medium">
                      {selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString('bn-BD') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ডেলিভারির সময়</p>
                    <p className="text-sm font-medium">{getMealTimeText(selectedOrder.deliveryTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">প্যাকেজ</p>
                    <p className="text-sm font-medium">{selectedOrder.package}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Utensils size={18} className="text-[#3B82F6]" />
                  অর্ডারকৃত আইটেম
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">পরিমাণ: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#3B82F6]">৳ {item.price * item.quantity}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-300">
                    <p className="font-bold text-gray-800">মোট</p>
                    <p className="text-xl font-bold text-[#3B82F6]">৳ {selectedOrder.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-yellow-800 mb-1">বিশেষ নির্দেশনা</p>
                  <p className="text-sm text-yellow-700">{selectedOrder.specialInstructions}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                বন্ধ করুন
              </button>
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    updateOrderStatus(selectedOrder._id, 'cancelled');
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  অর্ডার বাতিল করুন
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}