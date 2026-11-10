const STATUS_CONFIG = {
  online: { color: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]', text: 'ONLINE' },
  idle:   { color: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]',   text: 'IDLE' },
  dnd:    { color: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]',     text: 'DND' },
  offline:{ color: 'bg-zinc-500',                                            text: 'OFFLINE' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.offline;

  return (
    <div
      role="status"
      aria-atomic="true"
      className="absolute bottom-0.5 right-0.5 bg-zinc-950 border border-amber-500/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg"
    >
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} />
      <span className="text-[9px] font-bold text-zinc-400 tracking-wider">
        <span className="sr-only">Discord status: </span>
        {cfg.text}
      </span>
    </div>
  );
}