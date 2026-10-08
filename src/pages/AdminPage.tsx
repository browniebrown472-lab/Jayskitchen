import React, { useState, useEffect } from 'react';
import { MenuItem, Category, OrderRecord, OrderStatus } from '../types';
import {
  getMenuItems,
  getCategories,
  saveMenuItem,
  deleteMenuItem,
  resetMenuToDefaults,
} from '../services/menuService';
import { fetchAllOrders, updateOrderStatus } from '../services/orderService';
import {
  uploadFoodImage,
  isSupabaseConfigured,
  getSupabaseConfig,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  testSupabaseConnection,
} from '../lib/supabase';
import { FULL_SUPABASE_SCHEMA_SQL } from '../lib/supabaseSchemaSql';
import { RESTAURANT_INFO } from '../lib/constants';
import {
  LayoutDashboard,
  Utensils,
  FolderTree,
  ShoppingBag,
  Settings,
  Database,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Upload,
  MessageCircle,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';

const ADMIN_STORAGE_KEY = 'jays_kitchen_admin_auth_v1';
const ADMIN_PASSWORD_KEY = 'jays_kitchen_admin_pwd_hash';

export const AdminPage: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'authenticated';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin Section
  const [activeTab, setActiveTab] = useState<
    'overview' | 'menu' | 'categories' | 'orders' | 'supabase' | 'settings'
  >('overview');

  // Data States
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [menuSearch, setMenuSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal States
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<MenuItem | null>(null);

  // Form State for Adding / Editing Dish
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    price: 45,
    category: 'Rice',
    image_url: '/src/assets/images/hero_nigerian_feast_1791373699915.jpg',
    available: true,
    featured: false,
    display_order: 10,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase Configuration Manager State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseConfig().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseConfig().anonKey);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [migratingDishes, setMigratingDishes] = useState(false);

  // Load Admin Data
  const refreshData = async () => {
    setLoading(true);
    try {
      const [items, cats, ords] = await Promise.all([
        getMenuItems(),
        getCategories(),
        fetchAllOrders(),
      ]);
      setDishes(items);
      setCategories(cats);
      setOrders(ords);
    } catch (e) {
      console.error('Failed refreshing admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Retrieve custom password or initial default
    const storedPwd = localStorage.getItem(ADMIN_PASSWORD_KEY) || 'Jaykitchen';

    if (passwordInput === storedPwd) {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'authenticated');
      setIsAuthenticated(true);
      showToast('Welcome to Jay’s Kitchen Owner Portal');
    } else {
      setAuthError('Incorrect password. Please verify credentials.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Open Dish Edit Modal
  const openEdit = (dish: MenuItem) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      image_url: dish.image_url,
      available: dish.available,
      featured: dish.featured,
      display_order: dish.display_order,
    });
    setImageFile(null);
    setIsAddModalOpen(true);
  };

  const openAddNew = () => {
    setEditingDish(null);
    setDishForm({
      name: '',
      description: '',
      price: 45,
      category: categories[0]?.name || 'Rice',
      image_url: '/src/assets/images/hero_nigerian_feast_1791373699915.jpg',
      available: true,
      featured: false,
      display_order: dishes.length + 1,
    });
    setImageFile(null);
    setIsAddModalOpen(true);
  };

  // Save Dish
  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = dishForm.image_url;

    if (imageFile) {
      setUploadingImage(true);
      const uploadRes = await uploadFoodImage(imageFile);
      setUploadingImage(false);

      if (uploadRes.error) {
        showToast(uploadRes.error);
        return;
      }
      if (uploadRes.url) {
        finalImageUrl = uploadRes.url;
      }
    }

    const payload = {
      ...(editingDish ? { id: editingDish.id } : {}),
      name: dishForm.name,
      description: dishForm.description,
      price: Number(dishForm.price),
      category: dishForm.category,
      image_url: finalImageUrl,
      available: dishForm.available,
      featured: dishForm.featured,
      display_order: Number(dishForm.display_order),
    };

    const res = await saveMenuItem(payload);
    if (res.success) {
      showToast(editingDish ? 'Dish updated successfully' : 'New meal added to menu');
      setIsAddModalOpen(false);
      refreshData();
    }
  };

  // Delete Dish
  const handleDeleteDish = async () => {
    if (!deleteCandidate) return;
    await deleteMenuItem(deleteCandidate.id);
    showToast(`Removed "${deleteCandidate.name}" from menu`);
    setDeleteCandidate(null);
    refreshData();
  };

  // Quick toggle available
  const handleToggleAvailable = async (dish: MenuItem) => {
    await saveMenuItem({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      image_url: dish.image_url,
      available: !dish.available,
      featured: dish.featured,
      display_order: dish.display_order,
    });
    showToast(`${dish.name} marked as ${!dish.available ? 'Available' : 'Unavailable'}`);
    refreshData();
  };

  // Update order status
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    showToast(`Order status updated to ${newStatus}`);
    refreshData();
  };

  // Filtered menu
  const filteredDishes = dishes.filter((d) => {
    const matchCat = categoryFilter === 'all' || d.category === categoryFilter;
    const matchSearch =
      d.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      d.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Overview metrics
  const totalMenuCount = dishes.length;
  const availableCount = dishes.filter((d) => d.available).length;
  const unavailableCount = dishes.filter((d) => !d.available).length;
  const featuredCount = dishes.filter((d) => d.featured).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);

  // ---------------------------------------------------------------------------
  // 1. LOGIN SCREEN
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Jay's Kitchen Admin
            </h1>
            <p className="text-xs text-stone-500">
              Restaurant Management & Menu Portal
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-4 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
            >
              Access Dashboard
            </button>
          </form>

          <div className="text-center pt-2 border-t border-stone-100">
            <span className="text-[11px] text-stone-400">
              Initial setup credential is configurable in Admin Settings.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-100/60 pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl border border-stone-700 animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Banner */}
      <div className="bg-stone-900 text-stone-100 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center space-x-3">
          <span className="font-serif text-lg font-bold text-white tracking-wide">
            Jay's Kitchen Admin
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded font-mono bg-stone-800 text-stone-300">
            {isSupabaseConfigured() ? 'Supabase: Connected' : 'Storage: Standby Mode'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={refreshData}
            className="p-1.5 text-stone-400 hover:text-white rounded transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-xs space-y-1 sticky top-24">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-red-50 text-red-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'menu'
                    ? 'bg-red-50 text-red-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Utensils className="w-4 h-4" />
                  <span>Menu Management</span>
                </div>
                <span className="text-[10px] tabular-nums bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                  {dishes.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-red-50 text-red-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders Received</span>
                </div>
                <span className="text-[10px] tabular-nums bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-red-50 text-red-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <FolderTree className="w-4 h-4" />
                <span>Food Categories</span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'supabase'
                    ? 'bg-red-50 text-red-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Supabase Database</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-red-50 text-red-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin Settings</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">
                    Restaurant Overview
                  </h2>
                  <p className="text-xs text-stone-500">
                    Live snapshot of menu items, availability status, and customer orders.
                  </p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                    <span className="text-xs font-medium text-stone-500 block">Total Meals</span>
                    <span className="text-2xl font-bold text-stone-900 tabular-nums">
                      {totalMenuCount}
                    </span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                    <span className="text-xs font-medium text-stone-500 block">Available Now</span>
                    <span className="text-2xl font-bold text-emerald-600 tabular-nums">
                      {availableCount}
                    </span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                    <span className="text-xs font-medium text-stone-500 block">Featured Items</span>
                    <span className="text-2xl font-bold text-red-600 tabular-nums">
                      {featuredCount}
                    </span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                    <span className="text-xs font-medium text-stone-500 block">Orders Handled</span>
                    <span className="text-2xl font-bold text-stone-900 tabular-nums">
                      {orders.length}
                    </span>
                  </div>
                </div>

                {/* Quick Action Banner */}
                <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Need to update the menu for today?
                    </h3>
                    <p className="text-xs text-stone-500">
                      Add a new special, mark finished soups as unavailable, or adjust prices in Ghana Cedi.
                    </p>
                  </div>
                  <button
                    onClick={openAddNew}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Meal</span>
                  </button>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Recent Customer Inquiries
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold"
                    >
                      View All Orders ({orders.length})
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <p className="text-xs text-stone-400 py-4 text-center">
                      No customer orders recorded yet. As orders are submitted, they will appear here.
                    </p>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {orders.slice(0, 3).map((o) => (
                        <div key={o.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                          <div>
                            <span className="font-bold text-stone-900 block">{o.customer_name}</span>
                            <span className="text-stone-500">{o.delivery_location} · {o.area}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-stone-900 block tabular-nums">GH₵{o.total_amount}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MENU MANAGEMENT */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-stone-900">
                      Menu Management
                    </h2>
                    <p className="text-xs text-stone-500">
                      Add, edit, upload photos, and manage prices in GH₵. Changes appear instantly on the live site.
                    </p>
                  </div>
                  <button
                    onClick={openAddNew}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm whitespace-nowrap self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Food</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      placeholder="Filter dishes by name..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Menu Table */}
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[11px] font-semibold">
                          <th className="py-3 px-4">Dish</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Featured</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredDishes.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-stone-400">
                              No menu items found. Click "Add New Food" to get started.
                            </td>
                          </tr>
                        ) : (
                          filteredDishes.map((dish) => (
                            <tr key={dish.id} className="hover:bg-stone-50/70 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={dish.image_url}
                                    alt={dish.name}
                                    className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                                  />
                                  <div>
                                    <span className="font-bold text-stone-900 block">{dish.name}</span>
                                    <span className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                                      {dish.description}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-stone-600 font-medium">
                                {dish.category}
                              </td>

                              <td className="py-3 px-4 font-bold text-stone-900 tabular-nums">
                                GH₵{dish.price}
                              </td>

                              <td className="py-3 px-4">
                                <button
                                  onClick={() => handleToggleAvailable(dish)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                    dish.available
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                                  }`}
                                >
                                  {dish.available ? 'Available' : 'Sold Out'}
                                </button>
                              </td>

                              <td className="py-3 px-4">
                                <span className="text-stone-500">
                                  {dish.featured ? 'Yes' : 'No'}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEdit(dish)}
                                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100"
                                    title="Edit food item"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteCandidate(dish)}
                                    className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50"
                                    title="Delete food item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      if (confirm('Reset menu back to initial 12 authentic dishes?')) {
                        await resetMenuToDefaults();
                        showToast('Menu reset to defaults');
                        refreshData();
                      }
                    }}
                    className="text-xs text-stone-400 hover:text-stone-600"
                  >
                    Reset menu to initial dishes
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">
                    Incoming Orders
                  </h2>
                  <p className="text-xs text-stone-500">
                    Track customer details, items ordered, and update order statuses.
                  </p>
                </div>

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-400">
                      <ShoppingBag className="w-10 h-10 mx-auto stroke-1 mb-2" />
                      <p className="text-sm">No orders recorded yet.</p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                          <div>
                            <span className="font-mono text-xs text-red-600 font-bold block">
                              {ord.id}
                            </span>
                            <span className="font-bold text-sm text-stone-900">
                              {ord.customer_name}
                            </span>
                            <span className="text-xs text-stone-500 block">
                              Tel: {ord.phone} {ord.whatsapp_number && `· WA: ${ord.whatsapp_number}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                handleStatusChange(ord.id, e.target.value as OrderStatus)
                              }
                              className="px-2.5 py-1.5 border border-stone-300 rounded text-xs font-semibold focus:outline-none bg-stone-50"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            <a
                              href={`https://wa.me/${ord.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${ord.customer_name}, this is Jay's Kitchen regarding your order ${ord.id}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded transition-colors"
                              title="Chat with customer on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-stone-400 block mb-1 font-semibold uppercase tracking-wider text-[10px]">
                              Delivery Information
                            </span>
                            <p className="text-stone-800">
                              <span className="font-semibold">{ord.delivery_method}</span> to {ord.delivery_location}
                            </p>
                            <p className="text-stone-600">Area: {ord.area}</p>
                            {ord.address_details && (
                              <p className="text-stone-500">Details: {ord.address_details}</p>
                            )}
                            {ord.special_instructions && (
                              <p className="text-red-700 mt-1 italic">
                                Note: {ord.special_instructions}
                              </p>
                            )}
                          </div>

                          <div>
                            <span className="text-stone-400 block mb-1 font-semibold uppercase tracking-wider text-[10px]">
                              Items ({ord.items.length})
                            </span>
                            <div className="space-y-1">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-stone-700">
                                  <span>
                                    {item.dish_name} x {item.quantity}
                                  </span>
                                  <span className="tabular-nums font-semibold">
                                    GH₵{item.price * item.quantity}
                                  </span>
                                </div>
                              ))}
                              <div className="pt-1.5 border-t border-stone-200 flex justify-between font-bold text-stone-950">
                                <span>Total</span>
                                <span className="tabular-nums text-red-600">
                                  GH₵{ord.total_amount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">
                    Menu Categories
                  </h2>
                  <p className="text-xs text-stone-500">
                    Organize meals into appetizing categories for customers.
                  </p>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-5 divide-y divide-stone-100">
                  {categories.map((cat) => (
                    <div key={cat.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block">{cat.name}</span>
                        {cat.description && (
                          <span className="text-stone-500">{cat.description}</span>
                        )}
                      </div>
                      <span className="text-stone-400">Order: {cat.display_order}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: SUPABASE DATABASE SETUP */}
            {activeTab === 'supabase' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">
                    Supabase Database Configuration
                  </h2>
                  <p className="text-xs text-stone-500">
                    Connect your real Supabase PostgreSQL database and Storage bucket for cloud persistence across devices.
                  </p>
                </div>

                {/* Connection Status Header */}
                <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3.5 h-3.5 rounded-full ${
                          isSupabaseConfigured() ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-500 ring-4 ring-amber-100'
                        }`}
                      />
                      <div>
                        <span className="text-sm font-bold text-stone-900 block">
                          {isSupabaseConfigured()
                            ? 'Supabase Integration Active'
                            : 'Standby / Local Storage Mode Active'}
                        </span>
                        <span className="text-xs text-stone-500 font-mono">
                          {isSupabaseConfigured()
                            ? `Connected to: ${getSupabaseConfig().url}`
                            : 'Using browser local store with 12 authentic dishes ready for migration'}
                        </span>
                      </div>
                    </div>

                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                    >
                      <span>Open Supabase Dashboard</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Interactive Live Credentials Setup */}
                  <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Connect Live Project Credentials
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Enter your Supabase project credentials below to connect immediately, test database tables, or set them in your <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">.env</code> / Vercel Environment Variables.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                          Project URL (VITE_SUPABASE_URL)
                        </label>
                        <input
                          type="text"
                          value={supabaseUrlInput}
                          onChange={(e) => setSupabaseUrlInput(e.target.value)}
                          placeholder="https://your-project-id.supabase.co"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                          Anon Public Key (VITE_SUPABASE_ANON_KEY)
                        </label>
                        <input
                          type="password"
                          value={supabaseKeyInput}
                          onChange={(e) => setSupabaseKeyInput(e.target.value)}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        disabled={testingSupabase || !supabaseUrlInput.trim() || !supabaseKeyInput.trim()}
                        onClick={async () => {
                          setTestingSupabase(true);
                          setSupabaseTestStatus(null);
                          const result = await testSupabaseConnection(supabaseUrlInput.trim(), supabaseKeyInput.trim());
                          setTestingSupabase(false);
                          setSupabaseTestStatus({
                            tested: true,
                            success: result.success,
                            message: result.message,
                            details: result.details,
                          });

                          if (result.success) {
                            saveCustomSupabaseConfig(supabaseUrlInput.trim(), supabaseKeyInput.trim());
                            showToast('Connected to Supabase! Database active.');
                            refreshData();
                          }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-spin' : ''}`} />
                        <span>{testingSupabase ? 'Verifying Connection...' : 'Test & Save Connection'}</span>
                      </button>

                      {getSupabaseConfig().source === 'custom' && (
                        <button
                          type="button"
                          onClick={() => {
                            clearCustomSupabaseConfig();
                            setSupabaseUrlInput('');
                            setSupabaseKeyInput('');
                            setSupabaseTestStatus(null);
                            showToast('Custom Supabase configuration removed');
                            refreshData();
                          }}
                          className="px-3.5 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-white transition-colors"
                        >
                          Disconnect / Revert
                        </button>
                      )}

                      {/* Migrate / Push Local Dishes button */}
                      {isSupabaseConfigured() && (
                        <button
                          type="button"
                          disabled={migratingDishes}
                          onClick={async () => {
                            setMigratingDishes(true);
                            try {
                              let count = 0;
                              for (const d of dishes) {
                                await saveMenuItem(d);
                                count++;
                              }
                              showToast(`Successfully synced ${count} dishes to Supabase!`);
                              refreshData();
                            } catch (e: any) {
                              alert(`Migration error: ${e.message}`);
                            } finally {
                              setMigratingDishes(false);
                            }
                          }}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{migratingDishes ? 'Syncing...' : 'Sync Local Dishes to Supabase'}</span>
                        </button>
                      )}
                    </div>

                    {/* Diagnostic feedback box */}
                    {supabaseTestStatus && (
                      <div
                        className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                          supabaseTestStatus.success
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                      >
                        <div className="font-semibold flex items-center gap-1.5">
                          {supabaseTestStatus.success ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>{supabaseTestStatus.message}</span>
                        </div>
                        {supabaseTestStatus.details && (
                          <div className="text-[11px] text-emerald-700 pl-5">
                            Categories: {supabaseTestStatus.details.categoriesCount} found · Menu Items: {supabaseTestStatus.details.menuItemsCount} found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 1-Click Copy SQL Schema */}
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">
                          Complete Supabase Database Schema (supabase-schema.sql)
                        </span>
                        <span className="text-[11px] text-stone-500">
                          Includes tables (menu_items, categories, orders, order_items), RLS policies, storage bucket, and 12 seeded dishes.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(FULL_SUPABASE_SCHEMA_SQL);
                          setCopiedSql(true);
                          setTimeout(() => setCopiedSql(false), 2500);
                        }}
                        className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors whitespace-nowrap"
                      >
                        {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSql ? 'SQL Copied to Clipboard!' : 'Copy Complete SQL Script'}</span>
                      </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto p-3 bg-stone-900 text-stone-200 rounded-lg font-mono text-[11px] leading-relaxed scrollbar-thin">
                      <pre>{FULL_SUPABASE_SCHEMA_SQL.trim()}</pre>
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="pt-2 space-y-3 text-xs text-stone-600">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                      Quick 3-Minute Setup Instructions:
                    </h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        Log in to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-red-600 font-semibold underline">supabase.com</a> and click <strong>New project</strong>.
                      </li>
                      <li>
                        Once created, click <strong>SQL Editor</strong> in the left sidebar, click <strong>New query</strong>, paste the complete SQL copied above, and click <strong>Run</strong>.
                      </li>
                      <li>
                        Go to <strong>Project Settings → API</strong> in your Supabase dashboard and copy your <strong>Project URL</strong> and <strong>anon public key</strong>.
                      </li>
                      <li>
                        Paste them into the fields above and click <strong>Test & Save Connection</strong>, or save them in your <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">.env</code> file:
                        <div className="mt-1.5 p-2.5 bg-stone-100 rounded text-stone-800 font-mono text-[11px]">
                          VITE_SUPABASE_URL="https://your-project-id.supabase.co"<br />
                          VITE_SUPABASE_ANON_KEY="your-anon-public-key"
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">
                    Admin & Restaurant Settings
                  </h2>
                  <p className="text-xs text-stone-500">
                    Manage restaurant details and update admin password.
                  </p>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6 max-w-xl">
                  {/* Change Admin Password */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const target = e.currentTarget;
                      const newPwd = (target.elements.namedItem('newPassword') as HTMLInputElement).value;
                      if (newPwd.length < 6) {
                        alert('Password must be at least 6 characters.');
                        return;
                      }
                      localStorage.setItem(ADMIN_PASSWORD_KEY, newPwd);
                      showToast('Admin password updated successfully');
                      target.reset();
                    }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-bold text-stone-900">
                      Update Admin Password
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        required
                        placeholder="Enter new admin password"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg"
                    >
                      Save New Password
                    </button>
                  </form>

                  <div className="pt-6 border-t border-stone-100 text-xs text-stone-600 space-y-2">
                    <h3 className="text-sm font-bold text-stone-900">Restaurant Info</h3>
                    <p>Phone: <span className="font-semibold">{RESTAURANT_INFO.phoneDisplay}</span></p>
                    <p>WhatsApp: <span className="font-semibold">+{RESTAURANT_INFO.whatsappNumber}</span></p>
                    <p>Location: <span className="font-semibold">{RESTAURANT_INFO.location}</span></p>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* ADD / EDIT DISH MODAL */}
      {/* ----------------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingDish ? 'Edit Food Item' : 'Add New Meal'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Food Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  placeholder="e.g. Jollof Rice with Fried Plantains"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  placeholder="Describe authentic taste, ingredients, and protein choice..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Price in Ghana Cedi (GH₵) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={dishForm.category}
                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Food Image
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800"
                  />
                  <input
                    type="text"
                    value={dishForm.image_url}
                    onChange={(e) => setDishForm({ ...dishForm, image_url: e.target.value })}
                    placeholder="Or enter existing image URL"
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-[11px]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={dishForm.available}
                    onChange={(e) => setDishForm({ ...dishForm, available: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                  <span>Mark as Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={dishForm.featured}
                    onChange={(e) => setDishForm({ ...dishForm, featured: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                  <span>Featured Dish</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  {uploadingImage ? 'Uploading Image...' : editingDish ? 'Save Changes' : 'Add Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ----------------------------------------------------------------------- */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Confirm Delete Dish
            </h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to remove <span className="font-bold text-stone-900">"{deleteCandidate.name}"</span> from the restaurant menu?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-3.5 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDish}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
