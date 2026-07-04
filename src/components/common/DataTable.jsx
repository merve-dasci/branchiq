import React from 'react';

export default function DataTable({ headers = [], data = [], renderRow }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {headers.map((header, idx) => (
                <th key={idx} className="px-6 py-3.5 font-bold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {data.map((item, idx) => renderRow(item, idx))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
