const statusConfig = {
  pending:    { label: 'Menunggu',  color: 'bg-amber-50 text-amber-600 border-amber-100' },
  diproses:   { label: 'Diproses', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  selesai:    { label: 'Selesai',  color: 'bg-primary-50 text-primary-600 border-primary-100' },
  dibatalkan: { label: 'Batal',    color: 'bg-red-50 text-red-500 border-red-100' },
}

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
      {config.label}
    </span>
  )
}
