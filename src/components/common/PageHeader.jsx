import React from 'react';

export default function PageHeader({ title, description, actionButton }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-105 pb-5">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
        {description && <p className="text-xs font-semibold text-slate-400 mt-1">{description}</p>}
      </div>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
