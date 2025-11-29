type Props = { status: string };

const colors: Record<string, string> = {
  DISPONIBLE: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  RESERVADO: 'bg-amber-100/80 text-amber-700 dark:bg-amber-400/20 dark:text-amber-200',
  CANCELADO: 'bg-rose-100/80 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
  COMPLETADO: 'bg-slate-200/80 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200',
};

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={`rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide ${
        colors[status] || 'bg-slate-200/70 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200'
      }`}
    >
      {status}
    </span>
  );
}
