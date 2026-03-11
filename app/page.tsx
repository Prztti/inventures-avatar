import AvatarWidget from "@/components/AvatarWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-near-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <span className="text-gold font-semibold text-xl">IV</span>
          </div>
          <span className="text-2xl font-light tracking-wider text-white">
            InVentures
          </span>
        </div>

        <h1 className="text-4xl font-light text-white mb-4 leading-tight">
          AI Advisory{" "}
          <span className="text-gold">Assistant</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 font-light leading-relaxed">
          Ask anything about InVentures — our services, process, and how we can
          help transform your business.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-panel-border bg-panel-bg text-gray-500 text-sm">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          Widget demo — embed{" "}
          <code className="text-gold font-mono">&lt;AvatarWidget /&gt;</code> on
          your main site
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 mt-16 flex flex-wrap justify-center gap-8 text-center">
        {[
          { value: "€450M+", label: "Transaction Record" },
          { value: "6–9mo", label: "To Measurable Results" },
          { value: "30%+", label: "Typical OPEX Savings" },
          { value: "6", label: "Sectors Covered" },
        ].map((stat) => (
          <div key={stat.label} className="px-6">
            <div className="text-2xl font-light text-gold">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Avatar Widget */}
      <AvatarWidget />
    </main>
  );
}
