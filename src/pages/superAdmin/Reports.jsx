import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Award, 
  Layers, 
  BarChart3, 
  Download, 
  Calendar 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function Reports({ branches, menuItems, orders }) {
  const [timeRange, setTimeRange] = useState('Month');

  // Calculate high-fidelity report analytics from actual state
  const totalRevenue = branches.reduce((sum, b) => sum + (b.revenueThisMonth || 0), 0);
  const totalSimulatedOrders = orders.length;
  const averageOrderVal = totalSimulatedOrders > 0 
    ? Math.round(orders.reduce((sum, o) => sum + o.totalAmount, 0) / totalSimulatedOrders)
    : 0;

  // Chart data 1: Revenue by Branch
  const revenueData = branches.map(b => ({
    name: b.name.replace('BranchIQ ', ''),
    revenue: b.revenueThisMonth || 0,
    orders: b.dailyOrders * 30 || 0
  }));

  // Chart data 2: Orders by serving model (type)
  const orderTypes = orders.reduce((acc, o) => {
    acc[o.type] = (acc[o.type] || 0) + 1;
    return acc;
  }, {});
  
  const typeData = Object.keys(orderTypes).map(key => ({
    name: key,
    value: orderTypes[key]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div id="reports-panel" className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Enterprise Analytics & Reports</h2>
          <p className="text-xs text-slate-500 font-semibold">Monitor real-time financial indices, sales distribution, and regional targets.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Calendar size={13} className="text-slate-400" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none focus:outline-hidden text-slate-700 cursor-pointer"
            >
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
              <option value="Year">Fiscal Year</option>
            </select>
          </div>

          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer"
          >
            <Download size={13} />
            <span>Export Ledger</span>
          </button>
        </div>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Gross Regional Income</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">${totalRevenue.toLocaleString()}</h4>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">↑ 14.5% vs Last Period</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Fulfilled Orders Ledger</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{totalSimulatedOrders}</h4>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">↑ 6.2% vs Last Period</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Average Ticket Valuation</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">${averageOrderVal}</h4>
          <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">Consolidated ticket price</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Average Store Rating</p>
          <h4 className="text-2xl font-black text-yellow-600 mt-1">4.62 / 5.0</h4>
          <span className="text-[10px] text-slate-400 font-bold mt-1 inline-block">Customer satisfaction index</span>
        </div>
      </div>

      {/* Analytical Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar chart: Revenue distribution */}
        <div className="lg:col-span-2 bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h4 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <BarChart3 size={16} className="text-blue-500" />
              <span>Consolidated Revenue Comparison</span>
            </h4>
            <span className="text-[9px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">USD ($)</span>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart: Order distribution types */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <div className="border-b border-slate-50 pb-3">
            <h4 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <Layers size={16} className="text-violet-500" />
              <span>Order Fulfilment Channel Distribution</span>
            </h4>
          </div>

          <div className="h-56 flex items-center justify-center">
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 font-medium">No order channel records registered yet.</p>
            )}
          </div>

          {/* Legend panel */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50 text-[10px] font-bold">
            {typeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-slate-500">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
