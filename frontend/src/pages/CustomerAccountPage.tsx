import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  Bell, 
  Settings, 
  LogOut, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Truck, 
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Share2,
  Gift
} from 'lucide-react';
import { useCustomerAuthStore } from '../store/useCustomerAuthStore';
import { apiService, CustomerAddress, LoyaltyAccountItem, NotificationPreferences } from '../services/api';
import { useCartStore } from '../store/useCartStore';

export const CustomerAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    token, 
    customer, 
    addresses, 
    notifications, 
    login, 
    register, 
    logout, 
    fetchProfile, 
    fetchAddresses, 
    fetchNotifications 
  } = useCustomerAuthStore();

  const { addItem, setWholesaleMode } = useCartStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'rewards' | 'addresses' | 'notifications' | 'profile'>('orders');

  // Loyalty & Rewards State
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccountItem | null>(null);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Login & Registration state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrRecipient, setAddrRecipient] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('Paralakhemundi');
  const [addrState, setAddrState] = useState('Odisha');
  const [addrPin, setAddrPin] = useState('761200');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState('');

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchAddresses();
      fetchNotifications();
      loadOrders();
      apiService.getMyLoyaltyAccount(token).then((acc) => setLoyaltyAccount(acc)).catch(() => {});
      apiService.getNotificationPreferences(token).then((p) => setNotifPrefs(p)).catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    if (customer) {
      setEditName(customer.full_name || '');
      setEditEmail(customer.email || '');
      setAddrRecipient(customer.full_name || '');
      setAddrPhone(customer.phone_number || '');
    }
  }, [customer]);

  const loadOrders = async () => {
    if (!token) return;
    setOrdersLoading(true);
    try {
      const data = await apiService.getCustomerOrders(token);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!phone || phone.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      await apiService.customerRequestOtp(phone);
      setOtpSent(true);
      setOtp('123456'); // pre-fill sandbox test OTP
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send OTP.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'login') {
        await login(phone, password || undefined, otp || undefined);
      } else {
        await register({
          phone_number: phone,
          full_name: fullName,
          email: email || undefined,
          password: password || undefined
        });
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const payload: Partial<CustomerAddress> = {
        label: addrLabel,
        recipient_name: addrRecipient,
        phone_number: addrPhone,
        address_line: addrLine,
        city: addrCity,
        state: addrState,
        pin_code: addrPin,
        is_default: addrIsDefault
      };

      if (editingAddressId) {
        await apiService.updateCustomerAddress(token, editingAddressId, payload);
      } else {
        await apiService.createCustomerAddress(token, payload);
      }

      setShowAddressModal(false);
      setEditingAddressId(null);
      fetchAddresses();
    } catch (err: any) {
      alert(err.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!token || !confirm('Are you sure you want to remove this address?')) return;
    try {
      await apiService.deleteCustomerAddress(token, id);
      fetchAddresses();
    } catch (err: any) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiService.updateCustomerProfile(token, { full_name: editName, email: editEmail });
      fetchProfile();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to update profile');
    }
  };

  const handleQuickReorder = async (orderItem: any) => {
    try {
      const allProducts = await apiService.getProducts();
      setWholesaleMode(orderItem.order_type === 'WHOLESALE');

      let count = 0;
      for (const item of orderItem.items) {
        const prod = allProducts.find(p => p.name.toLowerCase() === item.product_name.toLowerCase());
        if (prod) {
          const variant = prod.variants.find(v => v.weight_label === item.weight_label) || prod.variants[0];
          if (variant) {
            addItem(prod, variant, item.quantity);
            count++;
          }
        }
      }

      if (count > 0) {
        setReorderSuccessMsg(`Added ${count} item(s) from #${orderItem.order_number} to your Bag!`);
        setTimeout(() => setReorderSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If not logged in, render Login / Register view
  if (!token || !customer) {
    return (
      <div className="min-h-screen bg-[#190D2B] text-white pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#392052] to-[#28143F] border border-[#F4C45E]/40 flex items-center justify-center mx-auto shadow-lg">
              <User className="w-8 h-8 text-[#F4C45E]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4C45E]">
              {authMode === 'login' ? 'Customer Sign In' : 'Create Account'}
            </h1>
            <p className="text-xs text-gray-300">
              {authMode === 'login' 
                ? 'Sign in to access saved addresses, track previous orders, and 1-click reorder.' 
                : 'Join Sri Balaji to manage your delivery addresses and purchases.'}
            </p>
          </div>

          <div className="bg-[#28143F] border border-[#F4C45E]/30 rounded-2xl p-6 shadow-2xl space-y-5">
            
            {/* Toggle Tabs */}
            <div className="flex rounded-xl bg-[#190D2B] p-1 border border-gray-700">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(null); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'login' ? 'bg-[#F4C45E] text-[#190D2B]' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(null); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'register' ? 'bg-[#F4C45E] text-[#190D2B]' : 'text-gray-400 hover:text-white'
                }`}
              >
                New Customer
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patnaik"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-gray-300 font-semibold mb-1 block">Mobile Number *</label>
                <div className="flex gap-2">
                  <span className="bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-400 font-mono flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98617 89602"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="text-xs text-gray-300 font-semibold mb-1 block">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              )}

              {/* OTP section for login */}
              {authMode === 'login' && !password && (
                <div>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={authLoading}
                      className="w-full py-2.5 rounded-xl bg-[#392052] hover:bg-[#51336B] border border-[#F4C45E]/40 text-[#F4C45E] text-xs font-semibold tracking-wider uppercase transition-colors"
                    >
                      {authLoading ? 'Sending OTP...' : 'Send OTP to Phone'}
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-gray-300 font-semibold">Verification Code (OTP) *</label>
                        <span className="text-[11px] text-[#F4C45E]">Demo Code: 123456</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-4 py-2.5 text-sm text-white font-mono text-center tracking-widest focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs text-gray-300 font-semibold mb-1 block">
                  {authMode === 'register' ? 'Set Password (Optional)' : 'Or Sign In with Password'}
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4C45E] to-[#D6A52D] hover:from-[#FFE7A3] hover:to-[#F4C45E] text-[#190D2B] font-bold text-sm tracking-wide transition-all shadow-lg cursor-pointer disabled:opacity-50 mt-2"
              >
                {authLoading ? 'Processing...' : authMode === 'login' ? 'Sign In Securely' : 'Create My Account'}
              </button>
            </form>

            <div className="text-center pt-2 space-y-1.5">
              <Link to="/track" className="block text-xs text-gray-400 hover:text-[#F4C45E] transition-colors">
                Just want to track a single order? <span className="underline">Track without logging in →</span>
              </Link>
              <Link to="/admin/login" className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#F4C45E] transition-colors pt-1">
                <span>Authorized Store Administrator?</span> <span className="underline font-bold text-[#F4C45E]">Staff &amp; Admin Portal →</span>
              </Link>
            </div>
          </div>

          {/* Account Benefits */}
          <div className="p-4 rounded-xl bg-[#28143F]/50 border border-gray-800 text-xs text-gray-400 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F4C45E]" /> Customer Account Privileges
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Save multiple delivery locations for fast 1-click checkout.</li>
              <li>Real-time shipment tracking with direct WhatsApp support.</li>
              <li>Instantly re-order your favorite mixture batches.</li>
            </ul>
          </div>

        </div>
      </div>
    );
  }

  // Signed in Account Dashboard
  return (
    <div className="min-h-screen bg-[#190D2B] text-white pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-[#28143F] border border-[#F4C45E]/30 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#392052] border border-[#F4C45E]/40 flex items-center justify-center font-serif text-xl font-bold text-[#F4C45E]">
              {customer.full_name?.charAt(0) || 'C'}
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-white">
                Namaste, <span className="text-[#F4C45E]">{customer.full_name}</span>
              </h1>
              <div className="flex items-center gap-4 text-xs text-gray-300 mt-1">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#F4C45E]" /> +91 {customer.phone_number}</span>
                {customer.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gray-400" /> {customer.email}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/track"
              className="px-4 py-2 rounded-xl bg-[#392052] hover:bg-[#51336B] border border-[#F4C45E]/40 text-[#F4C45E] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Truck className="w-3.5 h-3.5" /> Track Order
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Global Reorder notice */}
        {reorderSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs text-center flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{reorderSuccessMsg}</span>
            <Link to="/cart" className="underline font-bold text-white hover:text-[#F4C45E] ml-2">View Bag →</Link>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-3">
          {[
            { key: 'orders', label: 'My Orders', icon: Package, count: orders.length },
            { key: 'rewards', label: 'Rewards & Referrals', icon: Sparkles, count: loyaltyAccount?.points_balance },
            { key: 'addresses', label: 'Saved Addresses', icon: MapPin, count: addresses.length },
            { key: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter(n => !n.is_read).length },
            { key: 'profile', label: 'Profile Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#F4C45E] text-[#190D2B] shadow-md' 
                    : 'bg-[#28143F] text-gray-300 hover:text-white border border-gray-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#190D2B] text-[#F4C45E]' : 'bg-[#392052] text-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#F4C45E]" />
                Loading your order history...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#28143F] border border-gray-800 rounded-2xl p-12 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-white">No orders placed yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Browse our fresh authentic mixture and snack collection and place your first order.
                </p>
                <Link
                  to="/catalog"
                  className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-[#F4C45E] text-[#190D2B] font-bold text-xs uppercase tracking-wider"
                >
                  Explore Catalogue
                </Link>
              </div>
            ) : (
              orders.map((ord: any) => (
                <div key={ord.id} className="bg-[#28143F] border border-[#F4C45E]/20 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
                    <div>
                      <div className="text-sm font-mono font-bold text-[#F4C45E]">{ord.order_number}</div>
                      <div className="text-[11px] text-gray-400">
                        {new Date(ord.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                        ord.status === 'DELIVERED' 
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                          : ord.status === 'CANCELLED'
                          ? 'bg-red-950 border border-red-500/40 text-red-300'
                          : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                      }`}>
                        {ord.status}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1 ${
                        ord.payment_status === 'PAID'
                          ? 'bg-emerald-900/60 border border-emerald-500/40 text-emerald-300'
                          : 'bg-yellow-900/40 border border-yellow-500/40 text-yellow-300'
                      }`}>
                        <CreditCard className="w-3 h-3" /> {ord.payment_status || 'UNPAID'}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1.5 text-xs text-gray-300">
                    {ord.items?.map((it: any, i: number) => (
                      <div key={i} className="flex justify-between">
                        <span>{it.quantity}x {it.product_name} ({it.weight_label})</span>
                        <span className="font-mono text-gray-200">Rs. {it.subtotal}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-800 pt-3">
                    <div>
                      <span className="text-xs text-gray-400">Total: </span>
                      <span className="text-base font-mono font-bold text-[#F4C45E]">Rs. {ord.total_estimated_amount}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/track/${ord.order_number}`}
                        className="px-3 py-1.5 rounded-lg bg-[#392052] hover:bg-[#51336B] border border-[#F4C45E]/40 text-[#F4C45E] text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Truck className="w-3 h-3" /> Track Order
                      </Link>
                      <button
                        onClick={() => handleQuickReorder(ord)}
                        className="px-3 py-1.5 rounded-lg bg-[#F4C45E] hover:bg-[#FFE7A3] text-[#190D2B] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Reorder
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Rewards & Referrals */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Balance */}
              <div className="bg-[#28143F] border border-[#F4C45E]/30 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-700/60 pb-3">
                  <div className="flex items-center gap-2 text-[#F4C45E] font-serif font-bold text-base">
                    <Sparkles className="w-5 h-5 text-[#F4C45E]" />
                    <span>Crunch Points Balance</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    1 Point = ₹1.00 Off
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-mono font-extrabold text-[#F4C45E]">
                    {loyaltyAccount?.points_balance || 50}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    Redeemable Points
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#190D2B] border border-gray-700/60">
                    <span className="text-gray-400 block text-[11px]">Lifetime Earned</span>
                    <strong className="text-white text-sm mt-0.5 block">{loyaltyAccount?.lifetime_points_earned || 50} pts</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#190D2B] border border-gray-700/60">
                    <span className="text-gray-400 block text-[11px]">Lifetime Redeemed</span>
                    <strong className="text-emerald-400 text-sm mt-0.5 block">{loyaltyAccount?.lifetime_points_redeemed || 0} pts</strong>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Earn 1 point for every ₹20 spent on confirmed orders. Redeem up to 25% of your cart value directly at checkout!
                </p>
              </div>

              {/* Card 2: Referral Programme */}
              <div className="bg-[#28143F] border border-[#F4C45E]/30 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-700/60 pb-3">
                  <div className="flex items-center gap-2 text-[#F4C45E] font-serif font-bold text-base">
                    <Gift className="w-5 h-5 text-[#F4C45E]" />
                    <span>Refer Friends &amp; Family</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#392052] text-[#F4C45E] border border-[#F4C45E]/30 text-[10px] font-bold">
                    Earn Bonus Points
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  Share your unique referral code with family, friends, or retail store owners. They get 50 bonus points on registration, and you earn reward points upon their first confirmed order!
                </p>

                <div className="p-3.5 rounded-xl bg-[#190D2B] border border-dashed border-[#F4C45E]/50 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Your Referral Code</span>
                    <strong className="text-lg font-mono font-bold text-[#F4C45E]">{loyaltyAccount?.referral_code || 'SB-BALAJI-2026'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(loyaltyAccount?.referral_code || 'SB-BALAJI-2026');
                        setCopiedRef(true);
                        setTimeout(() => setCopiedRef(false), 3000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#392052] hover:bg-[#51336B] text-xs font-bold text-white transition-colors"
                    >
                      {copiedRef ? 'Copied!' : 'Copy Code'}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Namaste! Try authentic Sri Balaji Special Mixtures from Paralakhemundi. Use my referral code ${loyaltyAccount?.referral_code || ''} to get welcome reward points on ${window.location.origin}/account`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#F4C45E] hover:bg-[#FFE7A3] text-xs font-bold text-[#190D2B] transition-colors flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Notification Preferences Card */}
            <div className="bg-[#28143F] border border-[#F4C45E]/20 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-serif font-bold text-[#F4C45E] text-base border-b border-gray-700/60 pb-3">
                Communication &amp; Order Notification Channels
              </h3>
              <p className="text-xs text-gray-300">
                Choose how you wish to receive order dispatches, lorry tracking updates, and festival promotions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <label className="p-3 rounded-xl bg-[#190D2B] border border-gray-700 flex items-center justify-between cursor-pointer">
                  <span>WhatsApp Order &amp; Dispatch Updates</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs?.whatsapp_updates ?? true}
                    onChange={async (e) => {
                      if (!token) return;
                      const updated = await apiService.updateNotificationPreferences(token, { whatsapp_updates: e.target.checked });
                      setNotifPrefs(updated);
                    }}
                    className="rounded text-gold focus:ring-gold"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#190D2B] border border-gray-700 flex items-center justify-between cursor-pointer">
                  <span>SMS Shipment &amp; Lorry Tracking</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs?.sms_updates ?? true}
                    onChange={async (e) => {
                      if (!token) return;
                      const updated = await apiService.updateNotificationPreferences(token, { sms_updates: e.target.checked });
                      setNotifPrefs(updated);
                    }}
                    className="rounded text-gold focus:ring-gold"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#190D2B] border border-gray-700 flex items-center justify-between cursor-pointer">
                  <span>Email Invoices &amp; Receipts</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs?.email_updates ?? true}
                    onChange={async (e) => {
                      if (!token) return;
                      const updated = await apiService.updateNotificationPreferences(token, { email_updates: e.target.checked });
                      setNotifPrefs(updated);
                    }}
                    className="rounded text-gold focus:ring-gold"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#190D2B] border border-gray-700 flex items-center justify-between cursor-pointer">
                  <span>Festival Discounts &amp; Special Crunch Offers</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs?.promotional_push ?? false}
                    onChange={async (e) => {
                      if (!token) return;
                      const updated = await apiService.updateNotificationPreferences(token, { promotional_push: e.target.checked });
                      setNotifPrefs(updated);
                    }}
                    className="rounded text-gold focus:ring-gold"
                  />
                </label>
              </div>
            </div>

            {/* Points Transactions Ledger */}
            <div className="bg-[#28143F] border border-[#F4C45E]/20 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-serif font-bold text-[#F4C45E] text-base border-b border-gray-700/60 pb-3">
                Points History &amp; Activity Log
              </h3>

              {!loyaltyAccount?.recent_transactions || loyaltyAccount.recent_transactions.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">No points activity yet. Start snacking to earn points!</p>
              ) : (
                <div className="divide-y divide-gray-800">
                  {loyaltyAccount.recent_transactions.map((txn) => (
                    <div key={txn.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <strong className="text-white block font-semibold">{txn.description}</strong>
                        <span className="text-[11px] text-gray-400">
                          {new Date(txn.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold text-sm ${txn.points > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {txn.points > 0 ? `+${txn.points}` : txn.points} pts
                        </span>
                        <div className="text-[10px] text-gray-400">Bal: {txn.balance_after} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-serif font-bold text-[#F4C45E]">Saved Delivery Locations</h2>
              <button
                onClick={() => {
                  setEditingAddressId(null);
                  setAddrLabel('Home');
                  setAddrLine('');
                  setAddrIsDefault(addresses.length === 0);
                  setShowAddressModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#F4C45E] hover:bg-[#FFE7A3] text-[#190D2B] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="bg-[#28143F] border border-gray-800 rounded-2xl p-8 text-center text-gray-400 text-xs">
                No saved addresses found. Add an address for faster checkout.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-[#28143F] border border-[#F4C45E]/20 rounded-2xl p-5 shadow-lg relative space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{addr.label}</span>
                        {addr.is_default && (
                          <span className="px-2 py-0.5 rounded-full bg-[#126044] text-white text-[10px] font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <button
                          onClick={() => {
                            setEditingAddressId(addr.id);
                            setAddrLabel(addr.label);
                            setAddrRecipient(addr.recipient_name);
                            setAddrPhone(addr.phone_number);
                            setAddrLine(addr.address_line);
                            setAddrCity(addr.city);
                            setAddrState(addr.state);
                            setAddrPin(addr.pin_code);
                            setAddrIsDefault(addr.is_default);
                            setShowAddressModal(true);
                          }}
                          className="hover:text-[#F4C45E] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-300">
                      <div className="font-semibold text-white">{addr.recipient_name} ({addr.phone_number})</div>
                      <div className="mt-1 leading-relaxed text-gray-400">
                        {addr.address_line}, {addr.city}, {addr.state} - {addr.pin_code}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#F4C45E]">Account Notifications</h2>
            {notifications.length === 0 ? (
              <div className="bg-[#28143F] border border-gray-800 rounded-2xl p-8 text-center text-gray-400 text-xs">
                No notifications yet. Status updates regarding your orders will appear here.
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div key={notif.id} className="bg-[#28143F] border border-gray-800 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#F4C45E] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                        <span className="text-[10px] text-gray-500">
                          {new Date(notif.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-[#28143F] border border-[#F4C45E]/20 rounded-2xl p-6 shadow-xl max-w-lg space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#F4C45E]">Profile Settings</h2>
            
            {profileSaved && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-semibold mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold mb-1 block">Registered Mobile (Read Only)</label>
                <input
                  type="text"
                  disabled
                  value={`+91 ${customer.phone_number}`}
                  className="w-full bg-[#190D2B]/50 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold mb-1 block">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#190D2B] border border-gray-700 focus:border-[#F4C45E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F4C45E] text-[#190D2B] font-bold text-xs uppercase tracking-wider hover:bg-[#FFE7A3] transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#28143F] border border-[#F4C45E]/40 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-scaleUp">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <h3 className="font-serif font-bold text-white text-base">
                  {editingAddressId ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold mb-1 block">Label (e.g. Home, Office, Store)</label>
                  <input
                    type="text"
                    required
                    value={addrLabel}
                    onChange={(e) => setAddrLabel(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F4C45E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-300 font-semibold mb-1 block">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={addrRecipient}
                      onChange={(e) => setAddrRecipient(e.target.value)}
                      className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F4C45E]"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-semibold mb-1 block">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#F4C45E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold mb-1 block">Address Details</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Shop No, Street, Landmark"
                    value={addrLine}
                    onChange={(e) => setAddrLine(e.target.value)}
                    className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F4C45E]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-gray-300 font-semibold mb-1 block">City</label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-semibold mb-1 block">State</label>
                    <input
                      type="text"
                      required
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-semibold mb-1 block">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={addrPin}
                      onChange={(e) => setAddrPin(e.target.value)}
                      className="w-full bg-[#190D2B] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="addrDefault"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    className="accent-[#F4C45E]"
                  />
                  <label htmlFor="addrDefault" className="text-gray-300 cursor-pointer">
                    Set as default delivery address
                  </label>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#F4C45E] text-[#190D2B] font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
