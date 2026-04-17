export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-neon-dark animate-spin border-t-neon-green" />
        </div>
        <span className="font-display text-neon-green text-sm tracking-widest uppercase animate-pulse">
          RAPPA Clinic
        </span>
      </div>
    </div>
  );
}