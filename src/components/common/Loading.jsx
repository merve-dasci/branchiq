import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading dataset...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
      <p className="text-xs font-bold text-slate-500">{message}</p>
    </div>
  );
}
