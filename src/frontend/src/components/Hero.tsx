interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: "80px" }}
      data-ocid="hero.section"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="orb-1 absolute w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.17 70), transparent 70%)",
            top: "-100px",
            right: "-150px",
          }}
        />
        <div
          className="orb-2 absolute w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.19 50), transparent 70%)",
            bottom: "0px",
            left: "-100px",
          }}
        />
        <div
          className="orb-3 absolute w-[300px] h-[300px] rounded-full opacity-[0.04]"
          style={{
            background:
              "radial-gradient(circle, oklch(0.85 0.15 80), transparent 70%)",
            top: "40%",
            left: "40%",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.78 0.17 70 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.17 70 / 0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div
          className="opacity-0-init animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-xs font-medium tracking-widest uppercase"
          style={{ color: "oklch(0.78 0.17 70)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "oklch(0.78 0.17 70)" }}
          />
          Premium Creator Store
        </div>

        <h1
          className="opacity-0-init animate-slide-up delay-200 font-display font-extrabold leading-none mb-4"
          style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}
        >
          <span className="gradient-text">WX</span>
          <br />
          <span className="text-foreground">Prime</span>
        </h1>

        <p className="opacity-0-init animate-slide-up delay-400 text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Premium Editing Materials —{" "}
          <span className="gradient-text-alt font-semibold">
            Presets, LUTs &amp; More
          </span>
        </p>

        <div className="opacity-0-init animate-slide-up delay-600 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onExplore}
            className="shimmer-btn w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base shadow-2xl hover:scale-105 hover:shadow-amber-500/30 transition-all duration-200 tracking-wide"
            style={{
              color: "oklch(0.08 0.008 270)",
              minWidth: "180px",
            }}
            data-ocid="hero.primary_button"
          >
            Explore Products ↓
          </button>
          <a
            href="https://wa.me/919220984532"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-4 rounded-xl font-semibold text-base border-2 text-foreground hover:bg-primary/10 transition-all duration-200 tracking-wide text-center"
            style={{
              borderColor: "oklch(0.78 0.17 70 / 0.5)",
              minWidth: "180px",
            }}
            data-ocid="hero.secondary_button"
          >
            Contact Us
          </a>
        </div>

        <div className="opacity-0-init animate-fade-in delay-800 flex items-center justify-center gap-8 sm:gap-12 mt-16">
          {[
            { value: "500+", label: "Happy Creators" },
            { value: "50+", label: "Premium Assets" },
            { value: "4.9★", label: "Avg Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-2xl sm:text-3xl gradient-text">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0-init animate-fade-in delay-800">
        <button
          type="button"
          className="w-6 h-10 rounded-full border border-primary/30 flex items-start justify-center p-1.5 cursor-pointer"
          onClick={onExplore}
          aria-label="Scroll to products"
          data-ocid="hero.button"
        >
          <div
            className="w-1.5 h-3 rounded-full animate-bounce"
            style={{ background: "oklch(0.78 0.17 70)" }}
          />
        </button>
      </div>
    </section>
  );
}
