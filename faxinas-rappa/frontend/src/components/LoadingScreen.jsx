export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-900 rounded-full animate-spin" />
        <span className="font-display font-semibold text-brand-900 text-lg tracking-wide">RAPPA</span>
      </div>
    </div>
  );
}