import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Grid, 
  Settings, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  Store, 
  Save, 
  Layers, 
  AlertCircle 
} from 'lucide-react';
import { initialProducts, initialCategories, initialBusinessSettings, initialBundles } from '../../data/initialData';
import { Product, Category, BusinessSettings } from '../../types';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Protect Admin route
  useEffect(() => {
    const token = localStorage.getItem('sri_balaji_admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings' | 'enquiries'>('products');

  // Local state for admin modifications
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [settings, setSettings] = useState<BusinessSettings>(initialBusinessSettings);
  const [saveNotice, setSaveNotice] = useState('');

  // New product modal state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || '');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSpice, setNewProdSpice] = useState<'MILD' | 'MEDIUM' | 'SPICY'>('MEDIUM');
  const [newProdRetailPrice, setNewProdRetailPrice] = useState(100);
  const [newProdWholesalePrice, setNewProdWholesalePrice] = useState(75);
  const [newProdWeight, setNewProdWeight] = useState('250g');

  const handleLogout = () => {
    localStorage.removeItem('sri_balaji_admin_token');
    navigate('/admin/login');
  };

  const toggleStock = (productId: string, variantId: string) => {
    setProducts(products.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        variants: p.variants.map(v => {
          if (v.id !== variantId) return v;
          return { ...v, is_in_stock: !v.is_in_stock };
        })
      };
    }));
    triggerSaveNotice('Stock availability status toggled.');
  };

  const handlePriceChange = (productId: string, variantId: string, wholesale: number, retail: number) => {
    setProducts(products.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        variants: p.variants.map(v => {
          if (v.id !== variantId) return v;
          return { ...v, wholesale_price: wholesale, retail_price: retail };
        })
      };
    }));
    triggerSaveNotice('Pricing updated successfully.');
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      triggerSaveNotice('Product deleted.');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      category_id: newProdCategory,
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: newProdDesc,
      food_classification: 'VEGETARIAN',
      spice_level: newProdSpice,
      taste_profiles: ['Crunchy', 'Traditional'],
      minimum_order_qty: 3,
      is_available: true,
      is_featured: false,
      variants: [
        {
          id: `var-${Date.now()}`,
          product_id: `prod-${Date.now()}`,
          weight_label: newProdWeight,
          weight_in_grams: 250,
          retail_price: Number(newProdRetailPrice),
          wholesale_price: Number(newProdWholesalePrice),
          stock_quantity: 100,
          is_in_stock: true
        }
      ],
      images: [
        {
          id: `img-${Date.now()}`,
          product_id: `prod-${Date.now()}`,
          image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
          is_primary: true,
          display_order: 1
        }
      ]
    };

    setProducts([newProduct, ...products]);
    setShowAddProduct(false);
    setNewProdName('');
    setNewProdDesc('');
    triggerSaveNotice(`Added product: "${newProdName}"`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSaveNotice('Business information and contact channels saved!');
  };

  const triggerSaveNotice = (msg: string) => {
    setSaveNotice(msg);
    setTimeout(() => setSaveNotice(''), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-crimson-900 text-cream-warm shadow-elevated border-2 border-gold-400/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-400 flex items-center justify-center font-bold text-gold-300">
            SB
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white">
              Sri Balaji Administration
            </h1>
            <p className="text-xs text-gold-200">
              Live Product Catalog, Pricing &amp; Wholesale Operations Control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream-warm text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {saveNotice && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-border pb-2 text-xs sm:text-sm overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-crimson-800 text-cream-warm shadow-sm'
              : 'text-spice hover:bg-cream-surface'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'categories'
              ? 'bg-crimson-800 text-cream-warm shadow-sm'
              : 'text-spice hover:bg-cream-surface'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-crimson-800 text-cream-warm shadow-sm'
              : 'text-spice hover:bg-cream-surface'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Business Information</span>
        </button>
      </div>

      {/* Tab 1: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-spice-dark">
              Manage Products &amp; Wholesale Pricing
            </h2>
            <button
              type="button"
              onClick={() => setShowAddProduct(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm text-xs font-bold shadow-soft transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Snack</span>
            </button>
          </div>

          {/* Add Product Modal Form */}
          {showAddProduct && (
            <div className="p-6 rounded-3xl bg-white border-2 border-gold-400/50 shadow-elevated space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cream-border">
                <h3 className="font-display font-bold text-lg text-spice-dark">Add New Snack Item</h3>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="text-spice-muted hover:text-spice text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-spice-dark mb-1">Snack Name</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Special Cashew Murukku"
                    className="w-full px-3 py-2 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-spice-dark mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Crispness, ingredients, and key flavours..."
                    className="w-full px-3 py-2 rounded-xl border border-cream-border bg-cream-warm/40 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">Default Weight Label</label>
                  <input
                    type="text"
                    value={newProdWeight}
                    onChange={(e) => setNewProdWeight(e.target.value)}
                    placeholder="e.g. 250g or 1kg"
                    className="w-full px-3 py-2 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">Spice Level</label>
                  <select
                    value={newProdSpice}
                    onChange={(e) => setNewProdSpice(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
                  >
                    <option value="MILD">Mild</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="SPICY">Spicy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    value={newProdRetailPrice}
                    onChange={(e) => setNewProdRetailPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-spice-dark mb-1">Wholesale Price (₹)</label>
                  <input
                    type="number"
                    value={newProdWholesalePrice}
                    onChange={(e) => setNewProdWholesalePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="px-4 py-2 rounded-xl border border-cream-border text-spice font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-crimson-800 text-cream-warm font-bold"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product Table */}
          <div className="bg-white rounded-3xl border border-cream-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-surface border-b border-cream-border text-spice-muted font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Snack Item</th>
                    <th className="py-3.5 px-4">Spice / Veg</th>
                    <th className="py-3.5 px-4">Variant &amp; Rates</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border">
                  {products.map((product) => {
                    const firstVariant = product.variants[0];
                    return (
                      <tr key={product.id} className="hover:bg-cream-warm/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cream-surface overflow-hidden shrink-0 border border-cream-border">
                              <img
                                src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=150&q=80'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-spice-dark block">{product.name}</span>
                              <span className="text-[11px] text-spice-muted">{product.slug}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {product.spice_level}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {firstVariant && (
                            <div className="space-y-1">
                              <span className="font-semibold text-spice-dark block">
                                {firstVariant.weight_label}: Wholesale ₹{firstVariant.wholesale_price} | Retail ₹{firstVariant.retail_price}
                              </span>
                              <span className="text-[10px] text-spice-muted">
                                {product.variants.length} weight variants configured
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {firstVariant && (
                            <button
                              type="button"
                              onClick={() => toggleStock(product.id, firstVariant.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                                firstVariant.is_in_stock
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-red-50 text-red-800 border-red-300'
                              }`}
                            >
                              {firstVariant.is_in_stock ? (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>In Stock</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                                  <span>Out of Stock</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-spice-muted hover:text-crimson-700 transition-colors"
                            title="Delete snack"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Tab 2: Categories */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-spice-dark">
              Snack Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="p-5 rounded-2xl bg-white border border-cream-border shadow-soft flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-cream-surface overflow-hidden shrink-0 border border-cream-border">
                  <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-spice-dark">{category.name}</h3>
                  <p className="text-xs text-spice-muted line-clamp-2 mt-0.5">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Business Information & Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-border shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-cream-border">
            <div>
              <h2 className="font-display font-bold text-xl text-spice-dark">
                Business Information &amp; Contact Metadata
              </h2>
              <p className="text-xs text-spice-muted">
                Changes here dynamically update the homepage, footer, contact page, and WhatsApp order routing.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-crimson-800 hover:bg-crimson-900 text-cream-warm text-xs font-bold shadow-soft"
            >
              <Save className="w-4 h-4 text-gold-300" />
              <span>Save Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-spice-dark mb-1">Business Name</label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-spice-dark mb-1">WhatsApp Number (e.g. 919876543210)</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-spice-dark mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contact_number}
                onChange={(e) => setSettings({ ...settings, contact_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-spice-dark mb-1">Email Address</label>
              <input
                type="email"
                value={settings.email_address}
                onChange={(e) => setSettings({ ...settings, email_address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-spice-dark mb-1">Factory / Wholesale Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-spice-dark mb-1">City</label>
              <input
                type="text"
                value={settings.city}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-spice-dark mb-1">Operating Hours</label>
              <input
                type="text"
                value={settings.business_hours}
                onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-spice-dark mb-1">
                FSSAI Registration / Licence (Optional)
              </label>
              <input
                type="text"
                value={settings.fssai_number}
                onChange={(e) => setSettings({ ...settings, fssai_number: e.target.value })}
                placeholder="Leave blank until verified license provided"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-spice-dark mb-1">Wholesale Supply Locations</label>
              <input
                type="text"
                value={settings.wholesale_locations}
                onChange={(e) => setSettings({ ...settings, wholesale_locations: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-border bg-cream-warm/40 outline-none"
              />
            </div>
          </div>
        </form>
      )}

    </div>
  );
};

