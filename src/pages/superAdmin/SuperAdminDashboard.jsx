import React from 'react';
import { 
  Store, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ChevronRight,
  Percent,
  Clock,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function SuperAdminDashboard({ 
  branches, 
  menuItems, 
  orders, 
  staff, 
  announcements, 
  selectedRegion, 
  setActiveTab 
}) {
  
  // Filter data by selected region
  const regionalBranches = selectedRegion === 'All' 
    ? branches 
    : branches.filter(b => b.region === selectedRegion);

  const regionalBranchIds = regionalBranches.map(b => b.id);

  const regionalOrders = orders.filter(order => {
    return selectedRegion === 'All' || regionalBranchIds.includes(order.branchId);
  });

  const regionalStaff = staff.filter(m => {
    return selectedRegion === 'All' || regionalBranchIds.includes(m.branchId);
  });

  // KPI Calculations
  const totalRevenue = regionalBranches.reduce((sum, b) => sum + b.revenueThisMonth, 0);
  const totalOrders = regionalOrders.length;
  const avgOrderValue = totalOrders > 0 ? Number((regionalOrders.reduce((sum, o) => sum + o.totalAmount, 0) / totalOrders).toFixed(2)) : 0;
  const staffCount = regionalStaff.length;

  // Active Orders queue count
  const activeOrdersCount = regionalOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;

  // Chart data 1: Orders Trend (Dummy grouped mock dates)
  const ordersTrendData = [
    { day: 'Mon', revenue: 4200, orders: 120 },
    { day: 'Tue', revenue: 5100, orders: 142 },
    { day: 'Wed', revenue: 4900, orders: 135 },
    { day: 'Thu', revenue: 6200, orders: 180 },
    { day: 'Fri', revenue: 8400, orders: 240 },
    { day: 'Sat', revenue: 9500, orders: 280 },
    { day: 'Sun', revenue: 7800, orders: 210 }
  ];

  // Chart data 2: Region Distribution
  const regionColors = ['#0f172a', '#2563eb', '#10b981', '#f59e0b', '#ec4899'];
  const regionDistribution = branches.reduce((acc, branch) => {
    const existing = acc.find(item => item.name === branch.region);
    if (existing) {
      existing.value += branch.revenueThisMonth;
    } else {
      acc.push({ name: branch.region, value: branch.revenueThisMonth });
    }
    return acc;
  }, []);

  return (
    <div id="overview-panel" className="p-8 space-y-6 animate-fade-in">

      {/* Top Banner Widget */}
      {announcements.length > 0 && (
        <div id="top-announcement-banner" className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-4 relative">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/10">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Latest Broadcast Notice</span>
              <h4 className="text-sm sm:text-base font-extrabold tracking-tight mt-0.5">{announcements[0].title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-2xl font-medium">{announcements[0].content}</p>
            </div>
          </div>
          <button 
            id="read-announcement-banner-btn"
            onClick={() => setActiveTab('announcements')} 
            className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/15 text-white py-2 px-3.5 rounded-xl border border-white/5 transition-all cursor-pointer relative"
          >
            <span>View Board</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Revenue */}
        <div id="kpi-revenue" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Gross Revenue</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">${totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-emerald-600">
            <TrendingUp size={14} />
            <span>+12.4% vs last month</span>
          </div>
        </div>

        {/* Card 2: Orders Count */}
        <div id="kpi-orders" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aggregate Orders</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalOrders}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-blue-600">
            <TrendingUp size={14} />
            <span>+8.2% vs last week</span>
          </div>
        </div>

        {/* Card 3: Average Ticket */}
        <div id="kpi-ticket" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average Ticket Value</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">${avgOrderValue}</h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Percent size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-amber-600">
            <TrendingUp size={14} />
            <span>+4.1% pricing optimization</span>
          </div>
        </div>

        {/* Card 4: Staff Directory */}
        <div id="kpi-staff" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-150">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Staff Members</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{staffCount}</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-slate-500">
            <Clock size={14} />
            <span>Across {regionalBranches.length} branches</span>
          </div>
        </div>

      </div>

      {/* Two Column Charts and Queue section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Revenue Area Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Weekly System Revenue Analytics</h4>
              <p className="text-[11px] text-slate-400 font-semibold">Consolidated billing figures across designated regions</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">Live Feed</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersTrendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Regional Revenue Distribution Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col">
          <h4 className="text-sm font-bold text-slate-900 mb-1">Regional Performance Share</h4>
          <p className="text-[11px] text-slate-400 font-semibold mb-6">Percentage contribution to total monthly gross</p>
          
          <div className="flex-1 flex items-center justify-center min-h-[180px]">
            {regionDistribution.length > 0 ? (
              <div className="w-full h-44 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {regionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={regionColors[index % regionColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">System Total</span>
                  <span className="text-sm font-black text-slate-900">${totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No regional data available</p>
            )}
          </div>

          <div className="space-y-2 mt-4">
            {regionDistribution.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: regionColors[idx % regionColors.length] }}></div>
                  <span>{item.name}</span>
                </div>
                <span>${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Block: Live Pending Orders & Quick Branch status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Orders Queue Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Active Kitchen Orders Queue</h4>
              <p className="text-[11px] text-slate-400 font-semibold">{activeOrdersCount} pending kitchen tickets require preparation</p>
            </div>
            <button 
              id="goto-orders-btn"
              onClick={() => setActiveTab('orders')} 
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>Manage Queues</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-60">
            {regionalOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length > 0 ? (
              regionalOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing').slice(0, 5).map(order => (
                <div key={order.id} className="py-3 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <p className="text-slate-800 font-bold">{order.customerName} <span className="font-mono text-slate-400">({order.id})</span></p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{order.branchName} • {order.type} • {order.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status === 'Pending' ? 'Pending' : 'Preparing'}
                    </span>
                    <span className="font-extrabold text-slate-900">${order.totalAmount}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400">
                <ClipboardList size={32} className="mx-auto text-slate-200 mb-2" />
                <p className="text-xs font-semibold">No pending orders in the kitchen.</p>
              </div>
            )}
          </div>
        </div>

        {/* Branch Operations Alert Deck */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col">
          <h4 className="text-sm font-bold text-slate-900 mb-1">Branch Operations Status</h4>
          <p className="text-[11px] text-slate-400 font-semibold mb-4">Functional state of the physical store nodes</p>
          
          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-60">
            {regionalBranches.map(branch => (
              <div key={branch.id} className="py-3.5 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg">
                    <Store size={14} />
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold">{branch.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Manager: {branch.manager}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${
                  branch.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    branch.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}></span>
                  <span>{branch.status === 'Active' ? 'Online' : 'Offline'}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
