import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Store, 
  Layers, 
  Grid, 
  Settings, 
  FileText, 
  LogOut, 
  Plus, 
  Check, 
  X, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Search,
  Filter,
  RefreshCw,
  Printer,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  BarChart3,
  Sparkles,
  Tag,
  Gift,
  TrendingUp,
  Users,
  Award,
  Download,
  Fingerprint,
  UserPlus,
  Trash2,
  Key
} from 'lucide-react';
import { initialProducts, initialCategories, initialBusinessSettings } from '../../data/initialData';
import { Product, Category, BusinessSettings } from '../../types';
import { 
  apiService, 
  StockMovementItem, 
  LowStockAlertItem, 
  PaymentTransactionItem,
  DealerProfileItem,
  WholesaleQuotationItem,
  ShipmentRecordItem,
  AnalyticsSummary,
  MarketingCouponItem,
  MarketingCampaignItem
} from '../../services/api';
import { DeliveryCoverageManager } from '../../components/admin/DeliveryCoverageManager';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    'orders' | 'analytics' | 'marketing' | 'dealers' | 'quotations' | 'logistics' | 'pincodes' | 'inventory' | 'payments' | 'products' | 'categories' | 'enquiries' | 'settings' | 'team' | 'security'
  >('orders');

  // RBAC Admin Session & Team State
  const [currentAdmin, setCurrentAdmin] = useState<{ id: string; email: string; full_name: string; role: string } | null>(null);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [adminInvites, setAdminInvites] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('ORDER_MANAGER');
  const [inviteMsg, setInviteMsg] = useState('');
  const [passkeyMsg, setPasskeyMsg] = useState('');
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  // Core Data
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [settings, setSettings] = useState<BusinessSettings>(initialBusinessSettings);
  const [orders, setOrders] = useState<any[]>([]);
  const [wholesaleEnquiries, setWholesaleEnquiries] = useState<any[]>([]);

  // Phase 2, 3, 4 & 5 Data
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlertItem[]>([]);
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransactionItem[]>([]);
  const [dealers, setDealers] = useState<DealerProfileItem[]>([]);
  const [quotations, setQuotations] = useState<WholesaleQuotationItem[]>([]);
  const [shipments, setShipments] = useState<ShipmentRecordItem[]>([]);
  const [pincodes, setPincodes] = useState<any[]>([]);

  // Phase 5: Analytics & Marketing Data
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<string>('all');
  const [marketingCoupons, setMarketingCoupons] = useState<MarketingCouponItem[]>([]);
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaignItem[]>([]);
  const [loyaltyAccounts, setLoyaltyAccounts] = useState<any[]>([]);

  // Modals & Forms
  const [orderSearch, setOrderSearch] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Modals
  const [showShipModal, setShowShipModal] = useState(false);
  const [shipCourier, setShipCourier] = useState('Regional Bus Cargo / Lorry');
  const [shipTrackingNum, setShipTrackingNum] = useState('');
  const [shipCharges, setShipCharges] = useState(0);

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponType, setNewCouponType] = useState('PERCENTAGE');
  const [newCouponVal, setNewCouponVal] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(300);
  const [newCouponMax, setNewCouponMax] = useState(100);

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampSub, setNewCampSub] = useState('');
  const [newCampBadge, setNewCampBadge] = useState('FESTIVAL SPECIAL');
  const [newCampCtaText, setNewCampCtaText] = useState('Explore Offers');
  const [newCampCtaLink, setNewCampCtaLink] = useState('/catalog');

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustVariant, setAdjustVariant] = useState<any | null>(null);
  const [adjustType, setAdjustType] = useState<'OPENING_STOCK' | 'PURCHASE_INWARD' | 'DAMAGE_DISCARD' | 'MANUAL_ADJUSTMENT'>('PURCHASE_INWARD');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(10);
  const [adjustNotes, setAdjustNotes] = useState('');

  const loadAllData = async (token: string) => {
    try {
      // 1. Verify authenticated session & fetch administrator role
      const me = await apiService.getAdminMe(token);
      setCurrentAdmin(me);

      // 2. If Superadmin, load access control & security audit tables
      if (me.role === 'SUPERADMIN') {
        apiService.getAdminList(token).then(setAdminsList).catch(() => {});
        apiService.getAdminInvites(token).then(setAdminInvites).catch(() => {});
        apiService.getAuditLogs(token, { limit: 100 }).then(res => setAuditLogs(res.logs || [])).catch(() => {});
      }

      const [prods, cats, sets, ords, enqs, invItms, alerts, txns, dlrs, quotes, ships, pins, analytics, coupons, camps, loyalty] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
        apiService.getSettings(),
        apiService.getAdminOrders(token).catch(() => []),
        apiService.getWholesaleEnquiries(token).catch(() => []),
        apiService.getInventoryItems(token).catch(() => []),
        apiService.getLowStockAlerts(token).catch(() => []),
        apiService.getPaymentTransactions(token).catch(() => []),
        apiService.listDealers(token).catch(() => []),
        apiService.getQuotations(token).catch(() => []),
        apiService.getShipments(token).catch(() => []),
        apiService.listServiceablePincodes().catch(() => []),
        apiService.getAnalyticsSummary(token, analyticsPeriod).catch(() => null),
        apiService.listAdminCoupons(token).catch(() => []),
        apiService.listAdminCampaigns(token).catch(() => []),
        apiService.listLoyaltyAccounts(token).catch(() => [])
      ]);

      if (prods && prods.length > 0) setProducts(prods);
      if (cats && cats.length > 0) setCategories(cats);
      if (sets && Object.keys(sets).length > 0) setSettings((prev) => ({ ...prev, ...sets }));
      if (ords) setOrders(ords);
      if (enqs) setWholesaleEnquiries(enqs);
      if (invItms) setInventoryItems(invItms);
      if (alerts) setLowStockAlerts(alerts);
      if (txns) setPaymentTransactions(txns);
      if (dlrs) setDealers(dlrs);
      if (quotes) setQuotations(quotes);
      if (ships) setShipments(ships);
      if (pins) setPincodes(pins);
      if (analytics) setAnalyticsSummary(analytics);
      if (coupons) setMarketingCoupons(coupons);
      if (camps) setMarketingCampaigns(camps);
      if (loyalty) setLoyaltyAccounts(loyalty);
    } catch (err: any) {
      console.warn('Backend sync failed, checking session validity:', err);
      if (err?.message?.includes('Unauthorized') || err?.message?.includes('expired') || err?.message?.includes('401')) {
        localStorage.removeItem('sri_balaji_admin_token');
        navigate('/admin/login');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('sri_balaji_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadAllData(token);
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('sri_balaji_admin_token');
    if (token) {
      await apiService.adminLogout(token).catch(() => {});
    }
    localStorage.removeItem('sri_balaji_admin_token');
    navigate('/admin/login');
  };

  const handleRegisterPasskey = async () => {
    const token = localStorage.getItem('sri_balaji_admin_token') || '';
    if (!token) return;
    setPasskeyLoading(true);
    setPasskeyMsg('');
    try {
      const challengeData = await apiService.passkeyRegisterChallenge(token);
      const challengeStr = challengeData.challenge;

      const cred = await navigator.credentials.create({
        publicKey: {
          challenge: Uint8Array.from(atob(challengeStr.replace(/-/g, '+').replace(/_/g, '/')), (c: string) => c.charCodeAt(0)),
          rp: { name: "Sri Balaji Special Mixtures", id: window.location.hostname || "localhost" },
          user: {
            id: Uint8Array.from(challengeData.user.id, (c: any) => (typeof c === 'string' ? c.charCodeAt(0) : Number(c))),
            name: challengeData.user.name,
            displayName: challengeData.user.displayName
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
          authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "preferred" },
          timeout: 60000
        }
      }) as any;

      if (!cred) throw new Error("Passkey enrollment was cancelled.");

      await apiService.passkeyRegisterVerify(token, {
        challenge: challengeStr,
        credential_id: cred.id,
        public_key: btoa(String.fromCharCode(...new Uint8Array(cred.response.attestationObject))),
        device_name: "Hardware Platform Authenticator"
      });
      setPasskeyMsg("Device passkey successfully registered! You can now sign in with biometrics on this machine.");
      apiService.getAuditLogs(token, { limit: 100 }).then(res => setAuditLogs(res.logs || [])).catch(() => {});
    } catch (err: any) {
      setPasskeyMsg(err.message || "Failed to register passkey.");
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('sri_balaji_admin_token') || '';
    if (!token || !newAdminEmail) return;
    try {
      const res = await apiService.inviteAdmin(token, { email: newAdminEmail.trim(), role: newAdminRole });
      setInviteMsg(`Invitation generated! Share link: ${window.location.origin}${res.invite_link}`);
      setNewAdminEmail('');
      apiService.getAdminInvites(token).then(setAdminInvites).catch(() => {});
    } catch (err: any) {
      alert(err.message || 'Invitation failed');
    }
  };

  const handleToggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    const token = localStorage.getItem('sri_balaji_admin_token') || '';
    if (!token) return;
    try {
      await apiService.updateAdminUser(token, adminId, { is_active: !currentStatus });
      apiService.getAdminList(token).then(setAdminsList).catch(() => {});
    } catch (err: any) {
      alert(err.message || 'Failed to update admin account');
    }
  };

  const handleRevokeAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to permanently revoke this administrator access?')) return;
    const token = localStorage.getItem('sri_balaji_admin_token') || '';
    if (!token) return;
    try {
      await apiService.revokeAdminUser(token, adminId);
      apiService.getAdminList(token).then(setAdminsList).catch(() => {});
    } catch (err: any) {
      alert(err.message || 'Failed to revoke administrator');
    }
  };

  // Status Update Handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem('sri_balaji_admin_token') || '';
    if (!token) return;
    try {
      await apiService.updateOrderStatus(token, orderId, newStatus, `Updated to ${newStatus} by Admin`);
      setStatusMsg(`Order status updated to ${newStatus}`);
      setTimeout(() => setStatusMsg(''), 3000);
      loadAllData(token);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderTypeFilter !== 'ALL' && o.order_type !== orderTypeFilter) return false;
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      const matchNum = o.order_number?.toLowerCase().includes(q);
      const matchName = o.customer_name?.toLowerCase().includes(q);
      const matchPhone = o.phone_number?.includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-ivory text-cocoa pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-gold/30 shadow-soft flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-imperial to-[#190D2B] border border-gold/40 flex items-center justify-center text-gold font-serif font-black text-xl shadow-royal">
              SB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-extrabold text-imperial">
                  Sri Balaji Central Management Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Phase 5 Live
                </span>
              </div>
              <p className="text-xs text-cocoa-muted mt-0.5">
                Executive OMS • Business Analytics • Multilingual • Marketing &amp; Coupons • B2B Dealers &amp; Logistics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentAdmin && (
              <div className="flex items-center gap-2.5 pr-2 border-r border-ivory-border">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-imperial">{currentAdmin.full_name || currentAdmin.email}</div>
                  <div className="text-[10px] text-cocoa-muted">{currentAdmin.email}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  currentAdmin.role === 'SUPERADMIN'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : currentAdmin.role === 'PRODUCT_MANAGER'
                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                    : currentAdmin.role === 'ORDER_MANAGER'
                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                    : currentAdmin.role === 'INVENTORY_MANAGER'
                    ? 'bg-orange-100 text-orange-900 border border-orange-300'
                    : 'bg-teal-100 text-teal-900 border border-teal-300'
                }`}>
                  {currentAdmin.role.replace('_', ' ')}
                </span>
              </div>
            )}
            <button
              onClick={() => {
                const token = localStorage.getItem('sri_balaji_admin_token');
                if (token) loadAllData(token);
              }}
              className="p-2.5 rounded-xl border border-ivory-border hover:bg-cream text-imperial transition-colors"
              title="Refresh live data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-red-200"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Global KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Total Orders', val: orders.length, color: 'text-imperial' },
            { label: 'Enquiries', val: orders.filter((o) => o.status === 'NEW ENQUIRY').length, color: 'text-amber-700' },
            { label: 'B2B Dealers', val: dealers.length, color: 'text-emerald-700' },
            { label: 'Pending Dealers', val: dealers.filter((d) => d.status === 'PENDING_VERIFICATION').length, color: dealers.filter((d) => d.status === 'PENDING_VERIFICATION').length > 0 ? 'text-amber-600 font-black animate-pulse' : 'text-gray-500' },
            { label: 'Quotations', val: quotations.length, color: 'text-blue-700' },
            { label: 'Shipments', val: shipments.length, color: 'text-purple-700' },
            { label: 'Coupons Active', val: marketingCoupons.filter((c) => c.is_active).length, color: 'text-emerald-700' },
            { label: 'Low Stock Alerts', val: lowStockAlerts.length, color: lowStockAlerts.length > 0 ? 'text-red-600 font-black animate-pulse' : 'text-gray-500' }
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-2xl border border-ivory-border shadow-xs">
              <span className="text-[10px] uppercase font-bold text-cocoa-muted tracking-wider block">{kpi.label}</span>
              <span className={`text-xl font-mono font-bold ${kpi.color}`}>{kpi.val}</span>
            </div>
          ))}
        </div>

        {/* Navigation Tabs (RBAC Filtered) */}
        <div className="flex flex-wrap gap-2 border-b border-ivory-border pb-2">
          {[
            { key: 'orders', label: 'Orders (OMS)', icon: ShoppingBag, count: orders.length, roles: ['SUPERADMIN', 'ORDER_MANAGER', 'CUSTOMER_SUPPORT'] },
            { key: 'analytics', label: 'Analytics & BI', icon: BarChart3, roles: ['SUPERADMIN', 'ORDER_MANAGER', 'PRODUCT_MANAGER'] },
            { key: 'marketing', label: 'Promos & Coupons', icon: Tag, count: marketingCoupons.length, roles: ['SUPERADMIN', 'PRODUCT_MANAGER'] },
            { key: 'dealers', label: 'B2B Dealers (CRM)', icon: Store, count: dealers.length, roles: ['SUPERADMIN', 'ORDER_MANAGER'] },
            { key: 'quotations', label: 'Quotations', icon: FileText, count: quotations.length, roles: ['SUPERADMIN', 'ORDER_MANAGER'] },
            { key: 'logistics', label: 'Logistics & Dispatch', icon: Truck, count: shipments.length, roles: ['SUPERADMIN', 'ORDER_MANAGER'] },
            { key: 'pincodes', label: 'Delivery Zones', icon: MapPin, count: pincodes.length, roles: ['SUPERADMIN', 'ORDER_MANAGER'] },
            { key: 'inventory', label: 'Smart Inventory', icon: Layers, alertCount: lowStockAlerts.length, roles: ['SUPERADMIN', 'INVENTORY_MANAGER'] },
            { key: 'payments', label: 'Payments', icon: CreditCard, count: paymentTransactions.length, roles: ['SUPERADMIN', 'ORDER_MANAGER'] },
            { key: 'products', label: 'Snack Catalog', icon: Package, count: products.length, roles: ['SUPERADMIN', 'PRODUCT_MANAGER'] },
            { key: 'categories', label: 'Categories', icon: Grid, count: categories.length, roles: ['SUPERADMIN', 'PRODUCT_MANAGER'] },
            { key: 'enquiries', label: 'B2B Leads', icon: FileText, count: wholesaleEnquiries.length, roles: ['SUPERADMIN', 'ORDER_MANAGER', 'CUSTOMER_SUPPORT'] },
            { key: 'team', label: 'Team & Roles', icon: Users, count: adminsList.length, roles: ['SUPERADMIN'] },
            { key: 'security', label: 'Security & Audit', icon: ShieldCheck, count: auditLogs.length, roles: ['SUPERADMIN'] },
            { key: 'settings', label: 'Settings', icon: Settings, roles: ['SUPERADMIN'] }
          ]
            .filter((t) => !currentAdmin || t.roles.includes(currentAdmin.role))
            .map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-imperial text-gold shadow-royal'
                      : 'bg-white text-cocoa border border-ivory-border hover:bg-cream'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                  {typeof t.count === 'number' && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-gold text-imperial' : 'bg-cream text-cocoa'
                    }`}>
                      {t.count}
                    </span>
                  )}
                  {typeof t.alertCount === 'number' && t.alertCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black animate-pulse">
                      {t.alertCount}
                    </span>
                  )}
                </button>
              );
            })}
        </div>

        {/* ========================================================
            TAB 1: ORDERS MANAGEMENT (OMS)
        ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white p-4 rounded-2xl border border-ivory-border shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 text-cocoa-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order #, customer, or phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-ivory-border text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value)}
                  className="bg-cream/40 border border-ivory-border rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="ALL">All Types (Retail &amp; Wholesale)</option>
                  <option value="RETAIL">Retail Only</option>
                  <option value="WHOLESALE">Wholesale B2B Only</option>
                </select>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-cream/40 border border-ivory-border rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW ENQUIRY">New Enquiry</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="READY FOR PICKUP / DISPATCHED">Dispatched / Ready</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem('sri_balaji_admin_token') || '';
                    if (token) apiService.exportCsv(token, 'orders');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-deep text-imperial font-black text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  title="Export filtered records to verified CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Orders CSV</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Order Ref</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-cocoa-muted">No orders match the selected filters.</td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-cream/20">
                          <td className="p-4 font-mono font-bold text-imperial">{o.order_number}</td>
                          <td className="p-4">
                            <strong className="text-imperial block">{o.customer_name}</strong>
                            <span className="text-[11px] text-cocoa-muted">{o.phone_number}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.order_type === 'WHOLESALE' ? 'bg-imperial text-gold font-black' : 'bg-gold-light/40 text-imperial'
                            }`}>
                              {o.order_type}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-imperial">₹{o.total_estimated_amount}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.payment_status === 'PAID' ? 'bg-emerald/15 text-emerald-deep' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.payment_status || 'UNPAID'}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              className="text-[11px] font-bold rounded-lg border border-ivory-border bg-ivory px-2 py-1 outline-none"
                            >
                              <option value="NEW ENQUIRY">NEW ENQUIRY</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PREPARING">PREPARING</option>
                              <option value="READY FOR PICKUP / DISPATCHED">DISPATCHED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(o)}
                              className="px-3 py-1 rounded-xl bg-imperial hover:bg-imperial-secondary text-gold font-bold text-[11px] transition-colors"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: EXECUTIVE ANALYTICS & BI
        ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-5 rounded-3xl border border-gold/30 shadow-soft flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-black text-lg text-imperial flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gold-deep" />
                  <span>Executive Business Intelligence &amp; Performance</span>
                </h3>
                <p className="text-xs text-cocoa-muted">
                  Strictly calculates confirmed &amp; delivered revenue. Unpaid enquiries and cancelled orders are excluded.
                </p>
              </div>

              <div className="flex rounded-2xl bg-cream/70 p-1 border border-ivory-border text-xs font-bold">
                {[
                  { key: 'today', label: 'Today' },
                  { key: '7days', label: 'Last 7 Days' },
                  { key: '30days', label: 'Last 30 Days' },
                  { key: 'all', label: 'All Time' }
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={async () => {
                      setAnalyticsPeriod(p.key);
                      const token = localStorage.getItem('sri_balaji_admin_token') || '';
                      if (token) {
                        const data = await apiService.getAnalyticsSummary(token, p.key);
                        setAnalyticsSummary(data);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      analyticsPeriod === p.key
                        ? 'bg-imperial text-gold shadow-xs'
                        : 'text-cocoa hover:text-imperial'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Core Financial Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-ivory-border shadow-soft space-y-1">
                <span className="text-[10px] font-bold text-cocoa-muted uppercase tracking-wider block">Confirmed Revenue</span>
                <div className="text-2xl font-mono font-black text-imperial">
                  ₹{analyticsSummary?.confirmed_revenue?.toLocaleString('en-IN') || '0'}
                </div>
                <div className="text-[11px] text-emerald font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Verified confirmed orders</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-ivory-border shadow-soft space-y-1">
                <span className="text-[10px] font-bold text-cocoa-muted uppercase tracking-wider block">Average Order Value (AOV)</span>
                <div className="text-2xl font-mono font-black text-gold-deep">
                  ₹{analyticsSummary?.average_order_value?.toFixed(2) || '0.00'}
                </div>
                <div className="text-[11px] text-cocoa-muted">
                  Total Weight: <strong>{analyticsSummary?.total_weight_kg || 0} kg</strong>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-ivory-border shadow-soft space-y-1">
                <span className="text-[10px] font-bold text-cocoa-muted uppercase tracking-wider block">Repeat Customer Rate</span>
                <div className="text-2xl font-mono font-black text-emerald-deep">
                  {analyticsSummary?.repeat_customer_rate || 0}%
                </div>
                <div className="text-[11px] text-cocoa-muted">
                  Returning buyers &amp; kirana reorders
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-ivory-border shadow-soft space-y-1">
                <span className="text-[10px] font-bold text-cocoa-muted uppercase tracking-wider block">Retail vs Wholesale Split</span>
                <div className="text-xs font-bold text-imperial pt-1 flex justify-between">
                  <span>Retail: ₹{analyticsSummary?.retail_revenue || 0}</span>
                  <span className="text-gold-deep">B2B: ₹{analyticsSummary?.wholesale_revenue || 0}</span>
                </div>
                <div className="w-full bg-cream rounded-full h-2 overflow-hidden flex mt-2">
                  <div
                    className="bg-imperial h-full"
                    style={{
                      width: `${
                        analyticsSummary && analyticsSummary.confirmed_revenue > 0
                          ? ((analyticsSummary.retail_revenue / analyticsSummary.confirmed_revenue) * 100)
                          : 50
                      }%`
                    }}
                  />
                  <div
                    className="bg-gold h-full"
                    style={{
                      width: `${
                        analyticsSummary && analyticsSummary.confirmed_revenue > 0
                          ? ((analyticsSummary.wholesale_revenue / analyticsSummary.confirmed_revenue) * 100)
                          : 50
                      }%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Top Products & Order Lifecycle */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Top Products */}
              <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft space-y-4">
                <div className="flex items-center justify-between border-b border-ivory-border pb-3">
                  <h4 className="font-serif font-bold text-base text-imperial flex items-center gap-2">
                    <Award className="w-4 h-4 text-gold-deep" />
                    <span>Top-Selling Snack Varieties</span>
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-cocoa-muted">By Verified Quantity</span>
                </div>

                {!analyticsSummary?.top_selling_products || analyticsSummary.top_selling_products.length === 0 ? (
                  <p className="text-xs text-cocoa-muted py-6 text-center">No sales registered in this timeframe.</p>
                ) : (
                  <div className="divide-y divide-ivory-border">
                    {analyticsSummary.top_selling_products.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-gold/15 text-imperial font-mono font-bold flex items-center justify-center text-xs">
                            #{idx + 1}
                          </span>
                          <div>
                            <strong className="text-imperial font-bold block">{item.product_name}</strong>
                            <span className="text-[11px] text-cocoa-muted">Quantity: {item.total_quantity} packs</span>
                          </div>
                        </div>
                        <div className="text-right font-mono font-bold text-gold-deep">
                          ₹{item.total_revenue.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Volume Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-ivory-border shadow-soft space-y-4">
                <div className="flex items-center justify-between border-b border-ivory-border pb-3">
                  <h4 className="font-serif font-bold text-base text-imperial flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gold-deep" />
                    <span>Order Lifecycle Accounting</span>
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-cocoa-muted">Total: {analyticsSummary?.total_orders_count || 0}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-cocoa-muted text-[11px] block">Customer Enquiries</span>
                    <strong className="text-amber-800 text-lg font-mono block mt-0.5">{analyticsSummary?.enquiry_orders_count || 0}</strong>
                    <span className="text-[10px] text-cocoa-muted">Awaiting confirmation</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald/10 border border-emerald/30">
                    <span className="text-cocoa-muted text-[11px] block">Confirmed Orders</span>
                    <strong className="text-emerald-deep text-lg font-mono block mt-0.5">{analyticsSummary?.confirmed_orders_count || 0}</strong>
                    <span className="text-[10px] text-emerald-deep">Stock reserved</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-cocoa-muted text-[11px] block">Delivered Consignments</span>
                    <strong className="text-purple-800 text-lg font-mono block mt-0.5">{analyticsSummary?.delivered_orders_count || 0}</strong>
                    <span className="text-[10px] text-purple-700">Fulfilled</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200">
                    <span className="text-cocoa-muted text-[11px] block">Cancelled / Closed</span>
                    <strong className="text-red-800 text-lg font-mono block mt-0.5">{analyticsSummary?.cancelled_orders_count || 0}</strong>
                    <span className="text-[10px] text-red-600">Stock restored</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: MARKETING, CAMPAIGNS & COUPONS
        ======================================================== */}
        {activeTab === 'marketing' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-5 rounded-3xl border border-ivory-border shadow-soft flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-black text-lg text-imperial flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gold-deep" />
                  <span>Marketing Campaigns &amp; Promotional Coupons</span>
                </h3>
                <p className="text-xs text-cocoa-muted">
                  Manage festival discount coupons, homepage banners, and customer loyalty reward liabilities.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(true)}
                  className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-rich text-imperial font-bold text-xs uppercase tracking-wider transition-all shadow-gold cursor-pointer"
                >
                  + Issue New Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(true)}
                  className="px-4 py-2 rounded-xl bg-imperial hover:bg-imperial-secondary text-gold font-bold text-xs uppercase tracking-wider transition-all shadow-royal cursor-pointer border border-gold/40"
                >
                  + Add Campaign Banner
                </button>
              </div>
            </div>

            {/* Coupons Table */}
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-4 border-b border-ivory-border flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-imperial flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gold-deep" />
                  <span>Active Discount Coupons ({marketingCoupons.length})</span>
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Min Cart</th>
                      <th className="p-4">Usage</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {marketingCoupons.map((c) => (
                      <tr key={c.id} className="hover:bg-cream/20">
                        <td className="p-4 font-mono font-bold text-imperial text-sm">{c.code}</td>
                        <td className="p-4 text-cocoa">{c.description}</td>
                        <td className="p-4 font-bold text-emerald-deep">
                          {c.discount_type === 'PERCENTAGE' ? `${c.discount_value}% Off` : `₹${c.discount_value} Flat`}
                        </td>
                        <td className="p-4 font-mono text-cocoa">₹{c.min_order_amount}</td>
                        <td className="p-4 text-cocoa-muted">{c.usage_count} / {c.usage_limit}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            c.is_active ? 'bg-emerald/15 text-emerald-deep' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {c.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={async () => {
                              const token = localStorage.getItem('sri_balaji_admin_token') || '';
                              if (token) {
                                await apiService.toggleAdminCoupon(token, c.id);
                                const updated = await apiService.listAdminCoupons(token);
                                setMarketingCoupons(updated);
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-cream hover:bg-gold-light/40 text-imperial font-bold text-[11px] transition-colors"
                          >
                            {c.is_active ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Campaign Banners Table */}
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-4 border-b border-ivory-border flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-imperial flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-deep" />
                  <span>Homepage Promotional Banners ({marketingCampaigns.length})</span>
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Banner Title</th>
                      <th className="p-4">Badge</th>
                      <th className="p-4">Call To Action</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {marketingCampaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-cream/20">
                        <td className="p-4">
                          <strong className="text-imperial font-bold block">{camp.title}</strong>
                          <span className="text-[11px] text-cocoa-muted line-clamp-1">{camp.subtitle}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-gold/15 text-imperial font-bold text-[10px]">
                            {camp.badge_text}
                          </span>
                        </td>
                        <td className="p-4 text-cocoa font-mono text-[11px]">{camp.cta_text} → {camp.cta_link}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            camp.is_active ? 'bg-emerald/15 text-emerald-deep' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {camp.is_active ? 'Visible' : 'Hidden'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={async () => {
                              const token = localStorage.getItem('sri_balaji_admin_token') || '';
                              if (token) {
                                await apiService.toggleAdminCampaign(token, camp.id);
                                const updated = await apiService.listAdminCampaigns(token);
                                setMarketingCampaigns(updated);
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-cream hover:bg-gold-light/40 text-imperial font-bold text-[11px] transition-colors"
                          >
                            {camp.is_active ? 'Hide' : 'Show'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Loyalty Accounts Table */}
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-4 border-b border-ivory-border flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-imperial flex items-center gap-2">
                  <Gift className="w-4 h-4 text-gold-deep" />
                  <span>Customer Loyalty &amp; Referral Accounts ({loyaltyAccounts.length})</span>
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Mobile</th>
                      <th className="p-4">Points Balance</th>
                      <th className="p-4">Lifetime Earned</th>
                      <th className="p-4">Referral Code</th>
                      <th className="p-4 text-right">Adjust Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {loyaltyAccounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-cream/20">
                        <td className="p-4 font-bold text-imperial">{acc.customer_name}</td>
                        <td className="p-4 font-mono text-cocoa">{acc.phone_number}</td>
                        <td className="p-4 font-mono font-bold text-gold-deep text-sm">{acc.points_balance} pts</td>
                        <td className="p-4 font-mono text-cocoa-muted">{acc.lifetime_points_earned} pts</td>
                        <td className="p-4 font-mono text-imperial font-bold">{acc.referral_code}</td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={async () => {
                              const token = localStorage.getItem('sri_balaji_admin_token') || '';
                              const input = prompt(`Enter points adjustment for ${acc.customer_name} (+ to credit, - to debit):`, '25');
                              if (input && !isNaN(Number(input))) {
                                const reason = prompt('Enter adjustment reason (mandatory):', 'Festival Bonus') || 'Admin Bonus';
                                await apiService.adjustLoyaltyPoints(token, acc.customer_id, Number(input), reason);
                                const updated = await apiService.listLoyaltyAccounts(token);
                                setLoyaltyAccounts(updated);
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-gold hover:bg-gold-rich text-imperial font-bold text-[11px] transition-colors"
                          >
                            +/- Adjust
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: B2B DEALERS (CRM)
        ======================================================== */}
        {activeTab === 'dealers' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-5 border-b border-ivory-border flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-black text-lg text-imperial">Wholesale Dealer Ecosystem (B2B CRM)</h3>
                  <p className="text-xs text-cocoa-muted">Review applications, approve regional merchants, and assign commercial pricing tiers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem('sri_balaji_admin_token') || '';
                    if (token) apiService.exportCsv(token, 'dealers');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-deep text-imperial font-black text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Dealers CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Business / Firm</th>
                      <th className="p-4">Proprietor</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Tier / Terms</th>
                      <th className="p-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {dealers.map((d) => (
                      <tr key={d.id} className="hover:bg-cream/20">
                        <td className="p-4">
                          <strong className="text-imperial font-bold block">{d.business_name}</strong>
                          <span className="text-[11px] text-cocoa-muted font-mono">{d.gstin || 'GST: Unregistered'}</span>
                        </td>
                        <td className="p-4">
                          <div className="text-imperial font-semibold">{d.owner_name}</div>
                          <div className="text-[11px] text-cocoa-muted">{d.phone_number}</div>
                        </td>
                        <td className="p-4 text-cocoa">{d.business_category}</td>
                        <td className="p-4 text-cocoa">{d.city}, {d.pin_code}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === 'APPROVED' ? 'bg-emerald/15 text-emerald-deep' : d.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-imperial font-semibold">
                          {d.pricing_tier} • ₹{d.credit_limit}
                        </td>
                        <td className="p-4 text-right">
                          {d.status === 'PENDING_VERIFICATION' ? (
                            <button
                              type="button"
                              onClick={async () => {
                                const token = localStorage.getItem('sri_balaji_admin_token') || '';
                                await apiService.updateDealerStatus(token, d.id, {
                                  status: 'APPROVED',
                                  pricing_tier: 'DISTRIBUTOR',
                                  credit_limit: 50000,
                                  credit_days: 15
                                });
                                loadAllData(token);
                              }}
                              className="px-3 py-1 rounded-xl bg-gold hover:bg-gold-rich text-imperial font-black text-xs shadow-gold"
                            >
                              Approve Dealer
                            </button>
                          ) : (
                            <span className="text-[11px] text-cocoa-muted">Verified</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: QUOTATIONS
        ======================================================== */}
        {activeTab === 'quotations' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-5 border-b border-ivory-border">
                <h3 className="font-serif font-black text-lg text-imperial">Wholesale Quotations Ledger</h3>
                <p className="text-xs text-cocoa-muted">Review digital quotations issued to merchants and convert verified quotes into active orders.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Quotation Ref</th>
                      <th className="p-4">Recipient Store</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Valid Until</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {quotations.map((q) => (
                      <tr key={q.id} className="hover:bg-cream/20">
                        <td className="p-4 font-mono font-bold text-imperial">{q.quote_number}</td>
                        <td className="p-4">
                          <strong className="text-imperial block">{q.recipient_name}</strong>
                          <span className="text-[11px] text-cocoa-muted">{q.business_name} • {q.phone_number}</span>
                        </td>
                        <td className="p-4 text-cocoa">{q.city}</td>
                        <td className="p-4 text-cocoa-muted font-mono">{new Date(q.valid_until).toLocaleDateString()}</td>
                        <td className="p-4 font-mono font-bold text-imperial">₹{q.total_amount}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald/15 text-emerald-deep font-bold text-[10px]">
                            {q.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: LOGISTICS & SHIPMENTS
        ======================================================== */}
        {activeTab === 'logistics' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-5 border-b border-ivory-border flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-lg text-imperial">Road Freight &amp; Logistics Dispatches</h3>
                  <p className="text-xs text-cocoa-muted">Manage lorry receipts (LR), transport partners, and destination tracking across regional hubs.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Carrier Partner</th>
                      <th className="p-4">LR / Tracking #</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Dispatched Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {shipments.map((s) => (
                      <tr key={s.id} className="hover:bg-cream/20">
                        <td className="p-4 font-bold text-imperial">{s.courier_partner}</td>
                        <td className="p-4 font-mono font-bold text-gold-deep">{s.tracking_number}</td>
                        <td className="p-4 text-cocoa">{s.destination_pincode}</td>
                        <td className="p-4 text-cocoa-muted">{new Date(s.dispatch_date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'DELIVERED' ? 'bg-emerald/15 text-emerald-deep' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {s.status !== 'DELIVERED' && (
                            <button
                              type="button"
                              onClick={async () => {
                                const token = localStorage.getItem('sri_balaji_admin_token') || '';
                                await apiService.updateShipmentStatus(token, s.id, { status: 'DELIVERED' });
                                loadAllData(token);
                              }}
                              className="px-3 py-1 rounded-xl bg-emerald hover:bg-emerald-deep text-white font-bold text-xs"
                            >
                              Mark Delivered
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: DELIVERY ZONES & PINCODES
        ======================================================== */}
        {activeTab === 'pincodes' && (
          <DeliveryCoverageManager token={localStorage.getItem('sri_balaji_admin_token') || ''} />
        )}

        {/* ========================================================
            TAB 8: SMART INVENTORY
        ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-5 border-b border-ivory-border flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-black text-lg text-imperial">Smart Stock Inventory</h3>
                  <p className="text-xs text-cocoa-muted">Automatic inventory reservation on order confirmation and replenishment logging.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem('sri_balaji_admin_token') || '';
                    if (token) apiService.exportCsv(token, 'inventory');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-deep text-imperial font-black text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Inventory CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Product Variant</th>
                      <th className="p-4">Weight</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4">Threshold</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Inward / Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {inventoryItems.map((inv) => (
                      <tr key={inv.variant_id} className="hover:bg-cream/20">
                        <td className="p-4 font-bold text-imperial">{inv.product_name}</td>
                        <td className="p-4 text-cocoa">{inv.weight_label}</td>
                        <td className="p-4 font-mono font-bold text-imperial">{inv.stock_quantity} units</td>
                        <td className="p-4 font-mono text-cocoa-muted">{inv.low_stock_threshold}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.stock_quantity <= inv.low_stock_threshold ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-emerald/15 text-emerald-deep'
                          }`}>
                            {inv.stock_quantity <= inv.low_stock_threshold ? 'Low Stock' : 'Optimal'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setAdjustVariant(inv);
                              setShowAdjustModal(true);
                            }}
                            className="px-3 py-1 rounded-xl bg-gold hover:bg-gold-rich text-imperial font-bold text-xs"
                          >
                            + Inward Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 9: PAYMENTS
        ======================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-5 border-b border-ivory-border">
                <h3 className="font-serif font-black text-lg text-imperial">Payment Transactions Ledger</h3>
                <p className="text-xs text-cocoa-muted">Monitor online Razorpay UPI payments and offline NEFT transfers.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Transaction Ref</th>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Gateway</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {paymentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-cream/20">
                        <td className="p-4 font-mono font-bold text-imperial">{tx.transaction_reference}</td>
                        <td className="p-4 font-mono text-cocoa">{tx.order_number}</td>
                        <td className="p-4 font-mono font-bold text-imperial">₹{tx.amount}</td>
                        <td className="p-4 text-cocoa">{tx.gateway}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'PAID' ? 'bg-emerald/15 text-emerald-deep' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-4 text-cocoa-muted">{new Date(tx.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 10: SNACK CATALOG
        ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-5 border-b border-ivory-border">
                <h3 className="font-serif font-black text-lg text-imperial">Authentic Savouries Catalog</h3>
                <p className="text-xs text-cocoa-muted">9 authentic varieties handcrafted in Paralakhemundi.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Variety</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Variants</th>
                      <th className="p-4">Base Retail MRP</th>
                      <th className="p-4">Base Wholesale</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {products.map((p) => {
                      const base = p.variants[0];
                      return (
                        <tr key={p.id} className="hover:bg-cream/20">
                          <td className="p-4 font-bold text-imperial">{p.name}</td>
                          <td className="p-4 text-cocoa">{p.category?.name || 'Savouries'}</td>
                          <td className="p-4 text-cocoa">{p.variants.length} options</td>
                          <td className="p-4 font-mono font-bold text-imperial">₹{base.retail_price}</td>
                          <td className="p-4 font-mono font-bold text-gold-deep">₹{base.wholesale_price || base.retail_price}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald/15 text-emerald-deep font-bold text-[10px]">
                              Active in Kitchen
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 11: CATEGORIES
        ======================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-5 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-2">
                  <h4 className="font-serif font-bold text-base text-imperial">{cat.name}</h4>
                  <p className="text-xs text-cocoa-muted">{cat.description || 'Authentic regional savory category.'}</p>
                  <span className="text-[10px] text-gold-deep font-bold uppercase tracking-wider block pt-2">
                    Slug: {cat.slug}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 12: B2B LEADS
        ======================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft p-5">
              <h3 className="font-serif font-black text-lg text-imperial mb-3">Direct Wholesale WhatsApp Inquiries</h3>
              <div className="divide-y divide-ivory-border">
                {wholesaleEnquiries.map((enq) => (
                  <div key={enq.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-imperial font-bold block">{enq.contact_name} ({enq.business_name || 'Individual'})</strong>
                      <span className="text-[11px] text-cocoa-muted">Phone: {enq.phone_number} • City: {enq.city}</span>
                      {enq.message && <p className="text-cocoa text-[11px] mt-0.5">{enq.message}</p>}
                    </div>
                    <span className="text-[10px] text-cocoa-muted font-mono">{new Date(enq.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 13: SETTINGS
        ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft p-6 max-w-2xl space-y-4">
              <h3 className="font-serif font-black text-lg text-imperial">Business Master Settings</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-cocoa-muted block">Enterprise Name:</span>
                  <strong className="text-imperial text-sm">{settings.business_name}</strong>
                </div>
                <div>
                  <span className="text-cocoa-muted block">Dispatches Address:</span>
                  <p className="text-cocoa">{settings.address}</p>
                </div>
                <div>
                  <span className="text-cocoa-muted block">Primary WhatsApp Desk:</span>
                  <strong className="text-imperial font-mono text-sm">+{settings.whatsapp_number}</strong>
                </div>
                <div>
                  <span className="text-cocoa-muted block">Direct Calling Line:</span>
                  <strong className="text-imperial font-mono text-sm">{settings.contact_number}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 14: TEAM & ROLE-BASED ACCESS CONTROL (SUPERADMIN)
        ======================================================== */}
        {activeTab === 'team' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Invite Form */}
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-imperial/10 text-imperial flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5 text-imperial" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-imperial">Invite New Business Administrator</h3>
                  <p className="text-xs text-cocoa-muted">Generate a cryptographically signed invitation link with role-based privileges.</p>
                </div>
              </div>

              {inviteMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{inviteMsg}</span>
                </div>
              )}

              <form onSubmit={handleSendInvite} className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex-1 min-w-[240px]">
                  <input
                    type="email"
                    required
                    placeholder="manager@sribalaji.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="bg-cream/40 border border-ivory-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-imperial"
                >
                  <option value="SUPERADMIN">Super Admin (Full Access)</option>
                  <option value="PRODUCT_MANAGER">Product Manager (Catalog &amp; Pricing)</option>
                  <option value="ORDER_MANAGER">Order Manager (OMS &amp; Dealers)</option>
                  <option value="INVENTORY_MANAGER">Inventory Manager (Stock &amp; Alerts)</option>
                  <option value="CUSTOMER_SUPPORT">Customer Support (Reviews &amp; Leads)</option>
                </select>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-imperial hover:bg-[#190D2B] text-gold font-bold text-xs flex items-center gap-2 shadow-royal cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Send Administrator Invitation</span>
                </button>
              </form>
            </div>

            {/* Administrators Table */}
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-5 border-b border-ivory-border">
                <h3 className="font-serif font-black text-lg text-imperial">Authorized Administrators</h3>
                <p className="text-xs text-cocoa-muted">Current team members with backend authenticated access.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Administrator</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4">Last Login</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {adminsList.map((adm) => (
                      <tr key={adm.id} className="hover:bg-cream/20">
                        <td className="p-4 font-bold text-imperial">{adm.full_name || 'Admin'}</td>
                        <td className="p-4 font-mono text-cocoa-muted">{adm.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            adm.role === 'SUPERADMIN'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-purple-100 text-purple-800 border border-purple-300'
                          }`}>
                            {adm.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          {adm.is_active ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                              Suspended
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-[11px] text-cocoa-muted">
                          {adm.last_login ? new Date(adm.last_login).toLocaleString() : 'Never'}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleToggleAdminStatus(adm.id, adm.is_active)}
                            className="px-2.5 py-1 rounded-lg border border-ivory-border text-[11px] font-bold hover:bg-cream"
                          >
                            {adm.is_active ? 'Suspend' : 'Reactivate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRevokeAdmin(adm.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold border border-red-200"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Invitations Table */}
            {adminInvites.length > 0 && (
              <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
                <div className="p-5 border-b border-ivory-border">
                  <h3 className="font-serif font-black text-lg text-imperial">Pending Admin Invitations</h3>
                  <p className="text-xs text-cocoa-muted">Invites awaiting confirmation and onboarding.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                        <th className="p-4">Invited Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Invited By</th>
                        <th className="p-4">Expiration</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-border">
                      {adminInvites.map((inv) => (
                        <tr key={inv.id} className="hover:bg-cream/20">
                          <td className="p-4 font-mono font-bold text-imperial">{inv.email}</td>
                          <td className="p-4 font-bold">{inv.role}</td>
                          <td className="p-4 text-cocoa-muted">{inv.invited_by}</td>
                          <td className="p-4 text-cocoa-muted">{new Date(inv.expires_at).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                            <button
                              type="button"
                              onClick={async () => {
                                const token = localStorage.getItem('sri_balaji_admin_token') || '';
                                await apiService.cancelAdminInvite(token, inv.id);
                                apiService.getAdminInvites(token).then(setAdminInvites).catch(() => {});
                              }}
                              className="px-2.5 py-1 rounded-lg text-red-600 hover:bg-red-50 text-[11px] font-bold border border-red-200"
                            >
                              Cancel Invite
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 15: SECURITY, HARDWARE BIOMETRICS & AUDIT TRAIL
        ======================================================== */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Passkey Biometrics Registration Card */}
            <div className="bg-gradient-to-r from-imperial to-[#190D2B] text-ivory rounded-3xl p-6 border border-gold/40 shadow-royal space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-bold">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">Hardware Biometric Passkey Enrolment</h3>
                    <p className="text-xs text-gold/80">Bind your physical fingerprint sensor, Windows Hello, or Touch ID to your administrator account.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRegisterPasskey}
                  disabled={passkeyLoading}
                  className="px-5 py-3 rounded-xl bg-gold hover:bg-gold-deep text-imperial font-black text-xs flex items-center gap-2 shadow-gold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>{passkeyLoading ? 'Enrolling Hardware...' : 'Register Device Biometrics / Passkey'}</span>
                </button>
              </div>

              {passkeyMsg && (
                <div className="p-3.5 rounded-2xl bg-white/10 border border-gold/30 text-white text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                  <span>{passkeyMsg}</span>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-white/70">
                <strong>Cryptographic Enclave Guarantee:</strong> Biometric templates (fingerprint and face scans) strictly reside within your client-side hardware security chip (TPM / Apple Secure Enclave). The Sri Balaji server stores only public keys and cryptographic challenges.
              </div>
            </div>

            {/* Audit Trail Table */}
            <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
              <div className="p-5 border-b border-ivory-border flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-black text-lg text-imperial">Administrative Activity Audit Logs</h3>
                  <p className="text-xs text-cocoa-muted">Immutable ledger tracking security events, price updates, stock changes, and logins.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem('sri_balaji_admin_token') || '';
                    if (token) apiService.getAuditLogs(token, { limit: 100 }).then(res => setAuditLogs(res.logs || [])).catch(() => {});
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-ivory-border hover:bg-cream text-xs font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Log</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-cream/50 border-b border-ivory-border text-imperial uppercase font-black text-[11px]">
                      <th className="p-4">Timestamp (UTC)</th>
                      <th className="p-4">Administrator</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Target Entity</th>
                      <th className="p-4">Event Details</th>
                      <th className="p-4">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-border">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-cocoa-muted">
                          No audit entries recorded yet.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-cream/20">
                          <td className="p-4 font-mono text-[11px] text-cocoa-muted whitespace-nowrap">
                            {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-4 font-bold text-imperial">{log.admin_email}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200">
                              {log.action}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-cocoa">{log.entity}</td>
                          <td className="p-4 text-cocoa max-w-md truncate" title={log.details}>
                            {log.details || '—'}
                          </td>
                          <td className="p-4 font-mono text-[11px] text-cocoa-muted">{log.ip_address || '127.0.0.1'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODALS: ORDER DETAILS, COUPONS, CAMPAIGNS, INVENTORY
        ======================================================== */}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-royal border border-gold/40 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-ivory-border pb-3">
                <div>
                  <h4 className="font-serif font-bold text-base text-imperial">Order Ref: {selectedOrder.order_number}</h4>
                  <span className="text-xs text-cocoa-muted">Customer: {selectedOrder.customer_name} ({selectedOrder.phone_number})</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-cocoa-muted hover:text-imperial">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-imperial">Items:</div>
                <div className="divide-y divide-ivory-border bg-ivory p-3 rounded-2xl">
                  {selectedOrder.items?.map((it: any, i: number) => (
                    <div key={i} className="py-1.5 flex justify-between">
                      <span>{it.product_name} ({it.weight_label}) × {it.quantity}</span>
                      <span className="font-mono font-bold">₹{it.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-2 border-t border-ivory-border font-bold text-sm text-imperial">
                  <span>Grand Total:</span>
                  <span className="font-mono text-gold-deep">₹{selectedOrder.total_estimated_amount}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-imperial text-gold font-bold text-xs uppercase"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Coupon Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-royal border border-gold/40 space-y-4">
              <div className="flex items-center justify-between border-b border-ivory-border pb-3">
                <h4 className="font-serif font-black text-lg text-imperial">Issue New Promotional Coupon</h4>
                <button onClick={() => setShowCouponModal(false)} className="text-cocoa-muted hover:text-imperial">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem('sri_balaji_admin_token') || '';
                  if (!token || !newCouponCode.trim()) return;
                  try {
                    await apiService.createAdminCoupon(token, {
                      code: newCouponCode.trim().toUpperCase(),
                      description: newCouponDesc.trim(),
                      discount_type: newCouponType,
                      discount_value: Number(newCouponVal),
                      min_order_amount: Number(newCouponMin),
                      max_discount_cap: newCouponType === 'PERCENTAGE' ? Number(newCouponMax) : null
                    });
                    setShowCouponModal(false);
                    setNewCouponCode('');
                    setNewCouponDesc('');
                    const updated = await apiService.listAdminCoupons(token);
                    setMarketingCoupons(updated);
                  } catch (err: any) {
                    alert(err.message || 'Failed to create coupon');
                  }
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-imperial block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DIWALI20"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-ivory-border font-mono font-bold uppercase focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="font-bold text-imperial block mb-1">Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20% off on festive packs above Rs. 400"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ivory-border focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-imperial block mb-1">Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-border bg-white"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Flat (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-imperial block mb-1">Discount Value *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newCouponVal}
                      onChange={(e) => setNewCouponVal(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-ivory-border font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-imperial block mb-1">Min Order Amount (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={newCouponMin}
                      onChange={(e) => setNewCouponMin(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-ivory-border font-mono"
                    />
                  </div>
                  {newCouponType === 'PERCENTAGE' && (
                    <div>
                      <label className="font-bold text-imperial block mb-1">Max Cap (₹)</label>
                      <input
                        type="number"
                        min={1}
                        value={newCouponMax}
                        onChange={(e) => setNewCouponMax(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-ivory-border font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-cream text-cocoa font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gold hover:bg-gold-rich text-imperial font-black uppercase tracking-wider shadow-gold"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New Campaign Modal */}
        {showCampaignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-royal border border-gold/40 space-y-4">
              <div className="flex items-center justify-between border-b border-ivory-border pb-3">
                <h4 className="font-serif font-black text-lg text-imperial">Launch Homepage Campaign Banner</h4>
                <button onClick={() => setShowCampaignModal(false)} className="text-cocoa-muted hover:text-imperial">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem('sri_balaji_admin_token') || '';
                  if (!token || !newCampTitle.trim()) return;
                  try {
                    await apiService.createAdminCampaign(token, {
                      title: newCampTitle.trim(),
                      subtitle: newCampSub.trim(),
                      badge_text: newCampBadge.trim(),
                      cta_text: newCampCtaText.trim(),
                      cta_link: newCampCtaLink.trim(),
                      banner_theme: 'ROYAL_GOLD'
                    });
                    setShowCampaignModal(false);
                    setNewCampTitle('');
                    setNewCampSub('');
                    const updated = await apiService.listAdminCampaigns(token);
                    setMarketingCampaigns(updated);
                  } catch (err: any) {
                    alert(err.message || 'Failed to create campaign banner');
                  }
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-imperial block mb-1">Banner Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Makar Sankranti Special Crunch"
                    value={newCampTitle}
                    onChange={(e) => setNewCampTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ivory-border font-bold focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="font-bold text-imperial block mb-1">Subtitle / Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Fresh handmade savouries crafted for auspicious family gatherings."
                    value={newCampSub}
                    onChange={(e) => setNewCampSub(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ivory-border focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-imperial block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={newCampBadge}
                      onChange={(e) => setNewCampBadge(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-border"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-imperial block mb-1">Button Text</label>
                    <input
                      type="text"
                      value={newCampCtaText}
                      onChange={(e) => setNewCampCtaText(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-border font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-imperial block mb-1">Destination Link</label>
                  <input
                    type="text"
                    value={newCampCtaLink}
                    onChange={(e) => setNewCampCtaLink(e.target.value)}
                    placeholder="/catalog or /bundles or /dealer"
                    className="w-full p-2.5 rounded-xl border border-ivory-border font-mono"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCampaignModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-cream text-cocoa font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-imperial hover:bg-imperial-secondary text-gold font-bold uppercase tracking-wider border border-gold/40 shadow-royal"
                  >
                    Launch Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stock Adjustment Modal */}
        {showAdjustModal && adjustVariant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-royal border border-gold/40 space-y-4">
              <div className="flex items-center justify-between border-b border-ivory-border pb-3">
                <div>
                  <h4 className="font-serif font-black text-lg text-imperial">Adjust Stock Inventory</h4>
                  <span className="text-xs text-cocoa-muted">{adjustVariant.product_name} ({adjustVariant.weight_label})</span>
                </div>
                <button onClick={() => setShowAdjustModal(false)} className="text-cocoa-muted hover:text-imperial">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const token = localStorage.getItem('sri_balaji_admin_token') || '';
                  if (!token || !adjustVariant) return;
                  try {
                    await apiService.adjustStock(token, adjustVariant.variant_id, {
                      movement_type: adjustType,
                      quantity: Number(adjustQuantity),
                      notes: adjustNotes.trim() || undefined
                    });
                    setShowAdjustModal(false);
                    setAdjustVariant(null);
                    loadAllData(token);
                  } catch (err: any) {
                    alert(err.message || 'Stock adjustment failed');
                  }
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-imperial block mb-1">Adjustment Type</label>
                  <select
                    value={adjustType}
                    onChange={(e: any) => setAdjustType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ivory-border bg-white"
                  >
                    <option value="PURCHASE_INWARD">Purchase Inward (Stock Added +)</option>
                    <option value="OPENING_STOCK">Set Opening Stock</option>
                    <option value="DAMAGE_DISCARD">Damage / Spoilage Discard (-)</option>
                    <option value="MANUAL_ADJUSTMENT">Manual Stock Correction</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-imperial block mb-1">Quantity (Units) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-ivory-border font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-imperial block mb-1">Reference Notes</label>
                  <input
                    type="text"
                    placeholder="Batch # or reason"
                    value={adjustNotes}
                    onChange={(e) => setAdjustNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ivory-border"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdjustModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-cream text-cocoa font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gold hover:bg-gold-rich text-imperial font-black uppercase tracking-wider shadow-gold"
                  >
                    Apply Adjustment
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
