import React from 'react';

export default function NotifBadge({ count }) {
  if (!count || count <= 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold min-w-[15px] h-3.5 rounded-full flex items-center justify-center px-0.5 border border-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}
