export function EmptyLineCard({ label = "暂无线路" }: { label?: string }) {
  return (
    <section className="relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-sky-400/30 bg-slate-950/35 pb-4">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-3xl font-bold tracking-widest text-brand-200/60">
          {label}
        </div>

        <div className="text-lg text-slate-400">暂无线路数据</div>
      </div>
    </section>
  )
}
