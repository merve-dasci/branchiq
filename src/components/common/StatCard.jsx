import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
      <div className="space-y-1.5">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        {trend && (
          <p className="text-[11px] font-bold text-slate-500">{trend}</p>
        )}
      </div>
      {Icon && (
        <div className={`p-3.5 border rounded-2xl ${colorClasses[color] || colorClasses.blue}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}
