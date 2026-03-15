const LoadingState = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-700">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
    <span>{label}</span>
  </div>
);

export default LoadingState;
