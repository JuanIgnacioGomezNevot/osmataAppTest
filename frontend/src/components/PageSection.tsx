type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function PageSection({ title, description, actions, children }: Props) {
  return (
    <section className="mb-8 rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60 dark:shadow-black/40">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h2>
          {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
