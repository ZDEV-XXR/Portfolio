export default function TechBadge({ name }: { name: string }) {
  return (
    <span className="px-2 py-1 bg-slate-800/50 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-700/50 backdrop-blur-sm">
      {name}
    </span>
  );
}