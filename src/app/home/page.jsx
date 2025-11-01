'use client';

import React, { useState, useEffect } from 'react';
import { Home, PlusCircle, List, BarChart3, TrendingUp, TrendingDown, Wallet, X, Calendar, DollarSign, FileText, Tag, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

export default function ExpenseTrackerApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [particles, setParticles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);
  const { categories, fetchCategories, loading: catLoading } = useCategoryStore();
  const {
    transactions, monthlySummary, topCategories, recentTransactions,
    fetchTransactions, fetchMonthlySummary, fetchTopCategories, fetchRecentTransactions,
    loading: txLoading
  } = useTransactionStore();
  const addTransactionToStore = useTransactionStore(state => state.addTransaction);
  const deleteTransactionFromStore = useTransactionStore(state => state.deleteTransaction);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); 
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(''); 
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);


  const balance = transactions.reduce((sum, tx) =>
    tx.type === 'INCOME' ? sum + tx.amount : sum - tx.amount, 0);

  const monthlyIncome = monthlySummary
    .filter(s => s.type === 'INCOME')
    .reduce((a, b) => a + b.totalAmount, 0);

  const monthlyExpense = monthlySummary
    .filter(s => s.type === 'EXPENSE')
    .reduce((a, b) => a + b.totalAmount, 0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3 + 0.2,
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100,
      })));
    }, 50);

    fetchCategories();
    fetchTransactions();
    fetchMonthlySummary();
    fetchTopCategories();
    fetchRecentTransactions();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchTransactionsWithFilters();
  }, [activeFilter, dateRange, categoryFilter]);

  const fetchTransactionsWithFilters = () => {
    const filters = {};

    if (activeFilter === 'Income') {
      filters.type = 'INCOME';
    } else if (activeFilter === 'Expense') {
      filters.type = 'EXPENSE';
    } else if (activeFilter === 'DateRange') {
      if (dateRange.startDate) filters.startDate = dateRange.startDate;
      if (dateRange.endDate) filters.endDate = dateRange.endDate;
    }

    if (categoryFilter) {
      filters.categoryId = Number(categoryFilter);
    }

    fetchTransactions(filters);
  };

  const handleAddTransaction = async () => {
    try {
      await addTransactionToStore({
        title: formData.title,
        amount: Number(formData.amount),
        type: formData.type === 'income' ? 'INCOME' : 'EXPENSE',
        categoryId: Number(formData.category),
        date: new Date(formData.date).toISOString(),
        description: formData.description ?? '',
      });
      setShowAddModal(false);
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    } catch (e) {
      alert(e.message || 'Failed to add transaction');
    }
  };

  const isLoading = catLoading || txLoading;

  const renderHome = () => (
    <div className={`space-y-4 ${isMobile ? 'pb-24' : 'pb-8'}`}>
      {/* Balance Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
        {/* Main Balance Card */}
        <div className={`${isMobile ? 'col-span-1' : 'col-span-2'} relative bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-500 rounded-3xl p-6 overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <p className={`text-white/80 ${isMobile ? 'text-xs' : 'text-sm'} mb-1 flex items-center gap-2`}>
              <Wallet size={isMobile ? 14 : 16} />
              Total Balance
            </p>
            <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold text-white mb-4`}>${balance.toLocaleString()}</h2>
            <div className="flex gap-3">
              <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className={`flex items-center gap-2 text-white/80 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  <TrendingUp size={isMobile ? 12 : 14} />
                  Income
                </div>
                <p className={`text-white font-semibold ${isMobile ? 'text-base' : 'text-xl'}`}>${monthlyIncome.toLocaleString()}</p>
              </div>
              <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <div className={`flex items-center gap-2 text-white/80 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                  <TrendingDown size={isMobile ? 12 : 14} />
                  Expense
                </div>
                <p className={`text-white font-semibold ${isMobile ? 'text-base' : 'text-xl'}`}>${monthlyExpense.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - Desktop Only */}
        {!isMobile && (
          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4">
              <p className="text-slate-400 text-xs mb-1">Savings</p>
              <p className="text-emerald-400 text-2xl font-bold">${(monthlyIncome - monthlyExpense).toLocaleString()}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4">
              <p className="text-slate-400 text-xs mb-1">This Month</p>
              <p className="text-amber-400 text-2xl font-bold">{recentTransactions.length}</p>
              <p className="text-slate-500 text-xs">transactions</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className={`text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-3 px-1`}>Recent Transactions</h3>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
          {recentTransactions.slice(0, isMobile ? 5 : 6).map(tx => {
            const formattedDate = new Date(tx.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            
            return (
              <div key={tx.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 hover:border-emerald-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className={`text-white font-medium mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>{tx.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} bg-slate-700 text-slate-300 px-2 py-1 rounded-lg`}>
                        {typeof tx.category === 'string' ? tx.category : tx.category?.name || 'Unknown'}
                      </span>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-500`}>{formattedDate}</span>
                    </div>
                    {tx.description && (
                      <p className={`text-slate-400 mt-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {tx.description}
                      </p>
                    )}
                  </div>
                  <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold ${
                    tx.type === 'INCOME' || tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {(tx.type === 'INCOME' || tx.type === 'income') ? '+' : '-'}${tx.amount}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => {
  const filteredTransactions = recentTransactions.filter(tx => {
    if (activeFilter === 'Income' && tx.type !== 'INCOME') return false;
    if (activeFilter === 'Expense' && tx.type !== 'EXPENSE') return false;
    
    if (categoryFilter && tx.category?.id !== Number(categoryFilter)) return false;
    
    if (dateRange.startDate || dateRange.endDate) {
      const txDate = new Date(tx.date).toISOString().split('T')[0];
      if (dateRange.startDate && txDate < dateRange.startDate) return false;
      if (dateRange.endDate && txDate > dateRange.endDate) return false;
    }
    
    return true;
  });

  return (
    <div className={`space-y-4 ${isMobile ? 'pb-24' : 'pb-8'}`}>
      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Income', 'Expense', 'Date Range', 'Category'].map(filter => {
          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);

                if (filter === 'Date Range') {
                  setShowDateRangePicker(true);
                  setShowCategoryPicker(false);
                } else if (filter === 'Category') {
                  setShowCategoryPicker(true);
                  setShowDateRangePicker(false);
                } else {
                  setShowDateRangePicker(false);
                  setShowCategoryPicker(false);
                  setDateRange({ startDate: '', endDate: '' });
                  setCategoryFilter('');
                }
              }}
              className={`px-4 py-2 border rounded-xl whitespace-nowrap transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-500' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-emerald-500'
              } ${isMobile ? 'text-xs' : 'text-sm'}`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Date Range Picker Modal */}
      {showDateRangePicker && (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-slate-300 text-sm">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={e => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-slate-300 text-sm">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={e => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 mt-4 sm:mt-6">
              <button
                onClick={() => {
                  setShowDateRangePicker(false);
                  setActiveFilter('All');
                  setDateRange({ startDate: '', endDate: '' });
                }}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDateRangePicker(false);
                  if (dateRange.startDate || dateRange.endDate) {
                    setActiveFilter('DateRange');
                  } else {
                    setActiveFilter('All');
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Picker Modal */}
      {showCategoryPicker && (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4">
          <div className="space-y-4">
            <label className="text-slate-300 text-sm block">Select Category</label>
            <select
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCategoryPicker(false);
                  setActiveFilter('All');
                  setCategoryFilter('');
                }}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCategoryPicker(false);
                  if (categoryFilter) {
                    setActiveFilter('Category');
                  } else {
                    setActiveFilter('All');
                  }
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(activeFilter !== 'All' || dateRange.startDate || dateRange.endDate || categoryFilter) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-slate-400 text-sm">Active filters:</span>
          
          {activeFilter === 'Income' && (
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs border border-emerald-500/30">
              Income
            </span>
          )}
          
          {activeFilter === 'Expense' && (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs border border-red-500/30">
              Expense
            </span>
          )}
          
          {dateRange.startDate && (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30">
              From: {new Date(dateRange.startDate).toLocaleDateString()}
            </span>
          )}
          
          {dateRange.endDate && (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30">
              To: {new Date(dateRange.endDate).toLocaleDateString()}
            </span>
          )}
          
          {categoryFilter && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30">
              Category: {categories.find(c => c.id === Number(categoryFilter))?.name}
            </span>
          )}
          
          <button
            onClick={() => {
              setActiveFilter('All');
              setDateRange({ startDate: '', endDate: '' });
              setCategoryFilter('');
              setShowDateRangePicker(false);
              setShowCategoryPicker(false);
            }}
            className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs hover:bg-slate-600 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="text-slate-400 text-sm">
        Showing {filteredTransactions.length} of {recentTransactions.length} transactions
      </div>

      {/* All Transactions */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => {
            const formattedDate = new Date(tx.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            
            return (
              <div key={tx.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 hover:border-emerald-500/50 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-white font-medium mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>{tx.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`${isMobile ? 'text-xs' : 'text-sm'} bg-slate-700 text-slate-300 px-2 py-1 rounded-lg`}>
                            {typeof tx.category === 'string' ? tx.category : tx.category?.name || 'Unknown'}
                          </span>
                          <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-500`}>{formattedDate}</span>
                        </div>
                        {tx.description && (
                          <p className={`text-slate-400 mt-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {tx.description}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => { setTransactionToDelete(tx); setShowDeleteConfirm(true); }}
                        className="ml-3 p-2 text-slate-500 hover:text-red-400 transition-colors duration-300"
                        aria-label="Delete transaction"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold ${
                    tx.type === 'INCOME' || tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {(tx.type === 'INCOME' || tx.type === 'income') ? '+' : '-'}${tx.amount}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12">
            <div className="text-slate-500 text-lg mb-2">No transactions found</div>
            <div className="text-slate-600 text-sm">Try adjusting your filters or add new transactions</div>
          </div>
        )}
      </div>
    </div>
  );
};

  const renderStats = () => {
    const categoryBreakdown = transactions
      .filter(tx => tx.type === 'EXPENSE') 
      .reduce((acc, tx) => {
        const categoryName = tx.category?.name || 'Uncategorized';
        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        acc[categoryName] += tx.amount;
        return acc;
      }, {});

    const totalExpense = Object.values(categoryBreakdown).reduce((sum, amount) => sum + amount, 0);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const currentMonthSummary = monthlySummary.filter(
      s => s.year === currentYear && s.month === currentMonth
    );

    const monthlyIncome = currentMonthSummary.find(s => s.type === 'INCOME')?.totalAmount || 0;
    const monthlyExpense = currentMonthSummary.find(s => s.type === 'EXPENSE')?.totalAmount || 0;

    const maxMonthlyAmount = Math.max(monthlyIncome, monthlyExpense, 1);
    const maxCategoryAmount = Math.max(...Object.values(categoryBreakdown), 1);

    const allCategoriesArray = Object.entries(categoryBreakdown)
      .map(([name, amount]) => ({ 
        name, 
        amount, 
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0 
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategoriesArray = allCategoriesArray.slice(0, 5);

    const pieColors = [
      '#10b981', 
      '#3b82f6',  
      '#8b5cf6', 
      '#f59e0b', 
      '#ef4444', 
      '#ec4899', 
      '#06b6d4', 
      '#84cc16', 
      '#f97316', 
      '#6366f1', 
      '#6b7280', 
      '#14b8a6', 
    ];

    return (
      <div className={`space-y-4 ${isMobile ? 'pb-24' : 'pb-8'}`}>
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white mb-4`}>Analytics</h2>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
          {/* Monthly Summary Chart */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h3 className={`text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-6`}>
              Current Month Summary
            </h3>
            
            <div className="flex items-end justify-center gap-8"> 
              {/* Income Column */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-white font-bold text-lg whitespace-nowrap">
                  ${monthlyIncome.toLocaleString()}
                </div>
                
                {/* Bar Container */}
                <div className="relative h-40 flex items-end">
                  <div
                    className="w-16 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all duration-1000 ease-out"
                    style={{ height: `${(monthlyIncome / maxMonthlyAmount) * 100}%` }}
                  />
                </div>
                
                {/* Category Label */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-300`}>Income</span>
                </div>
              </div>

              {/* Expense Column */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-white font-bold text-lg whitespace-nowrap">
                  ${monthlyExpense.toLocaleString()}
                </div>
                
                {/* Bar Container */}
                <div className="relative h-40 flex items-end">
                  <div
                    className="w-16 bg-gradient-to-t from-red-500 to-orange-500 rounded-t-lg transition-all duration-1000 ease-out"
                    style={{ height: `${(monthlyExpense / maxMonthlyAmount) * 100}%` }}
                  />
                </div>
                
                {/* Category Label */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-300`}>Expense</span>
                </div>
              </div>
            </div>
            
            {/* Net Savings */}
            <div className="mt-4 p-3 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Net Savings</span>
                <span className={`text-lg font-bold ${
                  monthlyIncome - monthlyExpense >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  ${(monthlyIncome - monthlyExpense).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Top Spending Categories */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <h3 className={`text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-4`}>
              Top Spending Categories
            </h3>
            <div className="space-y-4">
              {topCategoriesArray.length > 0 ? (
                topCategoriesArray.map((cat, i) => {
                  const percent = (cat.amount / maxCategoryAmount) * 100;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                          {cat.name}
                        </span>
                        <span className={`text-slate-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          ${cat.amount.toLocaleString()} ({cat.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="text-slate-500 text-sm">No expense data available</div>
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown Pie Chart */}
          <div className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 ${isMobile ? 'col-span-1' : 'col-span-2'}`}>
            <h3 className={`text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-4`}>
              Expense Distribution (All Categories)
            </h3>
            
            {allCategoriesArray.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Pie Chart Visualization */}
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {(() => {
                      let currentAngle = 0;
                      
                      return allCategoriesArray.map((cat, i) => {
                        const angle = (cat.percentage / 100) * 360;
                        const largeArc = angle > 180 ? 1 : 0;
                        
                        const x1 = 50 + 50 * Math.cos(currentAngle * Math.PI / 180);
                        const y1 = 50 + 50 * Math.sin(currentAngle * Math.PI / 180);
                        const x2 = 50 + 50 * Math.cos((currentAngle + angle) * Math.PI / 180);
                        const y2 = 50 + 50 * Math.sin((currentAngle + angle) * Math.PI / 180);

                        const pathData = [
                          `M 50 50`,
                          `L ${x1} ${y1}`,
                          `A 50 50 0 ${largeArc} 1 ${x2} ${y2}`,
                          `Z`
                        ].join(' ');

                        const segment = (
                          <path
                            key={i}
                            d={pathData}
                            fill={pieColors[i % pieColors.length]}
                            className="opacity-80"
                          />
                        );

                        currentAngle += angle;
                        return segment;
                      });
                    })()}
                    <circle cx="50" cy="50" r="30" className="fill-slate-800" />
                  </svg>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white`}>
                        ${totalExpense.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">Total Expense</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 max-h-60 overflow-y-auto">
                  {allCategoriesArray.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: pieColors[i % pieColors.length] }}
                        />
                        <span className={`text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {cat.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`text-slate-400 ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                          ${cat.amount.toLocaleString()}
                        </span>
                        <span className={`text-slate-500 ${isMobile ? 'text-xs' : 'text-sm'} ml-2`}>
                          ({cat.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-slate-500 text-sm">No expense transactions found</div>
                <div className="text-slate-600 text-xs mt-1">Add some expense transactions to see the distribution</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAddModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className={`w-full ${isMobile ? 'max-h-[90vh]' : 'max-w-md max-h-[85vh]'} bg-slate-900/95 backdrop-blur-xl ${isMobile ? 'rounded-t-3xl' : 'rounded-3xl'} border border-emerald-500/30 overflow-hidden flex flex-col animate-slide-up`}>
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 flex-shrink-0">
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>Add Transaction</h2>
          <button 
            onClick={() => setShowAddModal(false)}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="text-slate-400" size={24} />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className={`block text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2 flex items-center gap-2`}>
                <FileText size={14} />
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className={`w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl px-4 ${isMobile ? 'py-2.5 text-sm' : 'py-3 text-base'} text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none transition-all duration-300`}
                placeholder="Enter transaction title"
              />
            </div>

            {/* Amount */}
            <div>
              <label className={`block text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2 flex items-center gap-2`}>
                <DollarSign size={14} />
                Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className={`w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl px-4 ${isMobile ? 'py-2.5 text-sm' : 'py-3 text-base'} text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none transition-all duration-300`}
                placeholder="0.00"
              />
            </div>

            {/* Type Toggle */}
            <div>
              <label className={`block text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2`}>Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData({...formData, type: 'expense'})}
                  className={`flex-1 ${isMobile ? 'py-2.5 text-sm' : 'py-3 text-base'} rounded-xl font-medium transition-all duration-300 ${
                    formData.type === 'expense' 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                      : 'bg-slate-800/50 border border-slate-700 text-slate-400'
                  }`}
                >
                  Expense
                </button>
                <button
                  onClick={() => setFormData({...formData, type: 'income'})}
                  className={`flex-1 ${isMobile ? 'py-2.5 text-sm' : 'py-3 text-base'} rounded-xl font-medium transition-all duration-300 ${
                    formData.type === 'income' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                      : 'bg-slate-800/50 border border-slate-700 text-slate-400'
                  }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className={`block text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2 flex items-center gap-2`}>
                <Tag size={14} />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl px-4 ${isMobile ? 'py-2.5 text-sm' : 'py-3 text-base'} text-white focus:border-emerald-400 focus:outline-none transition-all duration-300`}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                <option key={cat.id} value={cat.id}> {/* use id as value */}
                  {cat.name}
                </option>
              ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className={`block text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2 flex items-center gap-2`}>
                <Calendar size={14} />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className={`w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl px-4 ${isMobile ? 'py-2.5 text-sm' : 'py-3 text-base'} text-white focus:border-emerald-400 focus:outline-none transition-all duration-300`}
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium mb-2`}>Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`w-full bg-slate-800/50 border-2 border-slate-700 rounded-xl px-4 ${isMobile ? 'py-2.5 text-sm' : 'py-3 text-base'} text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none transition-all duration-300 resize-none`}
                rows="3"
                placeholder="Add notes..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button - Fixed */}
        <div className="p-6 border-t border-slate-800 flex-shrink-0">
          <button
            onClick={handleAddTransaction}
            className={`w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 text-white font-semibold ${isMobile ? 'py-3 text-sm' : 'py-4 text-base'} rounded-xl shadow-lg hover:shadow-emerald-500/50 transform hover:scale-[1.02] active:scale-95 transition-all duration-300`}
          >
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 relative overflow-hidden">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      {/* Animated particles */}
      <div className="absolute inset-0">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 2}px rgba(52, 211, 153, ${p.opacity})`,
            }}
          />
        ))}
      </div>

      {/* Desktop: Sidebar Navigation */}
      {!isMobile && (
        <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 z-20">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">hEx.ly</h1>
                <p className="text-slate-400 text-xs">Expense Tracker</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'home', icon: Home, label: 'Dashboard' },
                { id: 'transactions', icon: List, label: 'Transactions' },
                { id: 'stats', icon: BarChart3, label: 'Analytics' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                      : 'text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <button onClick={() => { logout(); router.push('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 transition-all duration-300">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile: Top Header */}
      {isMobile && (
        <div className="relative z-10 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Wallet className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-white font-bold text-base">hEx.ly</h1>
                <p className="text-slate-400 text-xs">Track expenses</p>
              </div>
            </div>
            {/* <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">JD</span>
            </div> */}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 ${isMobile ? 'px-4 py-4' : 'ml-64 px-8 py-6'}`}>
        <div className={isMobile ? '' : 'max-w-7xl mx-auto'}>
          {activeTab === 'home' && renderHome()}
          {activeTab === 'transactions' && renderTransactions()}
          {activeTab === 'stats' && renderStats()}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className={`fixed ${isMobile ? 'bottom-20 right-4' : 'bottom-8 right-8'} ${isMobile ? 'w-14 h-14' : 'w-16 h-16'} bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-40`}
      >
        <PlusCircle className="text-white" size={isMobile ? 24 : 28} />
      </button>

      {/* Mobile: Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800">
          <div className="px-4 py-3">
            <div className="flex items-center justify-around">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'transactions', icon: List, label: 'Transactions' },
                { id: 'stats', icon: BarChart3, label: 'Stats' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                    activeTab === tab.id ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && renderAddModal()}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 max-w-sm w-full text-center space-y-4">
            <p className="text-white text-lg font-semibold">
              Are you sure you want to delete <br />
              <strong>{transactionToDelete?.title}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteTransactionFromStore(transactionToDelete.id);
                    setShowDeleteConfirm(false);
                    setTransactionToDelete(null);
                  } catch (e) {
                    alert(e.message || 'Failed to delete transaction');
                  }
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}