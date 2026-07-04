import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  UtensilsCrossed, 
  Layers, 
  ClipboardCheck, 
  Clock 
} from 'lucide-react';
import { useSelector } from 'react-redux';

export default function BranchDashboard({ currentUser, orders, branches }) {
  // Find current admin's branch details
  const myBranch = branches.find(b => b.id === currentUser?.branchId) || branches[0];
  
  if (!myBranch) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl m-8">
        <p className="text-slate-500 font-bold">Loading local branch metrics...</p>
      </div>
    );
  }

  // Calculate local metrics
  const localOrders = orders.filter(o => o.branchId === myBranch.id);
  const preparingOrdersCount = localOrders.filter(o => o.status === 'Preparing').length;
  const completedOrdersCount = localOrders.filter(o => o.status === 'Completed').length;
  const localRevenue = localOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div id="branch-admin-dashboard" className="p-8 space-y-6 animate-fade-in">
      
      {/* Greetings Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl">
        <div>
          <span className="bg-blue-600 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md">Local Branch Panel</span>
          <h2 className="text-xl font-black mt-2 tracking-tight">Welcome, {currentUser?.name || 'Branch Manager'}</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Operational command for node: <strong className="text-white">{myBranch.name}</strong></p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold text-slate-400">Target Region Scope</p>
          <p className="text-sm font-black text-blue-400 mt-0.5">{myBranch.region} Sector</p>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Local Revenue</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">${localRevenue || myBranch.revenueThisMonth?.toLocaleString()}</h3>
              <p className="text-[9px] text-emerald-600 font-bold mt-1">Calculated from ledger</p>
            </div>
            <div className="p-2.5 bg-blue-55 text-blue-600 rounded-xl">
              <DollarSign size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Orders</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">{localOrders.length || myBranch.dailyOrders}</h3>
              <p className="text-[9px] text-slate-400 font-semibold mt-1">Includes off-premise tickets</p>
            </div>
            <div className="p-2.5 bg-violet-55 text-violet-600 rounded-xl">
              <ClipboardCheck size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Active Preparing</p>
              <h3 className="text-xl font-black text-amber-600 mt-1">{preparingOrdersCount}</h3>
              <p className="text-[9px] text-amber-600 font-bold mt-1">Pending kitchen pickup</p>
            </div>
            <div className="p-2.5 bg-amber-55 text-amber-500 rounded-xl animate-pulse">
              <Clock size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Tables</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">{myBranch.tableCount || 24}</h3>
              <p className="text-[9px] text-slate-400 font-semibold mt-1">Interactive layout</p>
            </div>
            <div className="p-2.5 bg-emerald-55 text-emerald-600 rounded-xl">
              <Layers size={16} />
            </div>
          </div>
        </div>

      </div>

      {/* Grid lower columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 border border-slate-200 rounded-2xl space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-3">Recent Station Tickets</h4>
          
          {localOrders.length > 0 ? (
            <div className="space-y-3.5 max-h-80 overflow-y-auto">
              {localOrders.slice().reverse().map(order => (
                <div key={order.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold">
                  <div className="space-y-1">
                    <p className="text-slate-900 font-bold">{order.id} ({order.type})</p>
                    <p className="text-[10px] text-slate-400 font-medium">Customer: <strong className="text-slate-700">{order.customerName}</strong> • {order.time}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-black text-slate-900">${order.totalAmount}</p>
                    <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md ${
                      order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                      order.status === 'Preparing' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-12">No active station tickets registered today.</p>
          )}
        </div>

        {/* Right column: Info details */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight border-b border-slate-100 pb-3">Contact Information</h4>
          
          <div className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Node Address</p>
              <p className="text-slate-800 mt-1 leading-relaxed">{myBranch.address}</p>
            </div>

            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Telephone Line</p>
              <p className="text-slate-800 mt-1 leading-relaxed">{myBranch.phone || '+90 216 555 1234'}</p>
            </div>

            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Operational Status</p>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-2 inline-block">
                {myBranch.status}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
