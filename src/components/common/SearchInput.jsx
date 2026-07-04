import React from 'react';
import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}
