import React from 'react';
import { Database } from 'lucide-react';

export default function EmptyState({ icon: Icon = Database, title = 'No data found', description = 'Try adjusting your filters or adding new records.' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
      <Icon size={48} className="mx-auto text-slate-300 mb-4" />
      <h4 className="text-slate-800 font-extrabold text-sm sm:text-base">{title}</h4>
      {description && <p className="text-xs text-slate-400 mt-1 font-semibold">{description}</p>}
    </div>
  );
}
