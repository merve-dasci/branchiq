import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = String(status).toLowerCase();
  
  let bg = 'bg-slate-100 text-slate-650 border-slate-200';
  if (['active', 'active duty', 'active_duty', 'completed', 'delivered', 'open', 'live', 'ready', 'success'].includes(normalized)) {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  } else if (['inactive', 'cancelled', 'dismissed', 'closed', 'failed'].includes(normalized)) {
    bg = 'bg-rose-50 text-rose-700 border-rose-100';
  } else if (['pending', 'preparing', 'in progress', 'progress', 'on hold', 'cooking'].includes(normalized)) {
    bg = 'bg-amber-50 text-amber-700 border-amber-100';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${bg}`}>
      {status}
    </span>
  );
}
