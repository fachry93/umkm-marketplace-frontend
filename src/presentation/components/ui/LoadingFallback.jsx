import React from 'react';

export default function LoadingFallback() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
        <p className="text-stone-400 text-xs font-sans font-bold uppercase tracking-widest">Memuat...</p>
      </div>
    </div>
  );
}
