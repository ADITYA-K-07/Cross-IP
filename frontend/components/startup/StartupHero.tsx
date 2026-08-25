"use client";

interface StartupHeroProps {
  onInitiateDeployment: () => void;
  onViewSpecs: () => void;
}

export function StartupHero({
  onInitiateDeployment,
  onViewSpecs,
}: StartupHeroProps) {
  return (
    <section className="relative w-full min-h-[480px] py-16 overflow-hidden flex items-center bg-surface-container-lowest border-b border-border-technical">
      {/* Background ambient texture layer */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFsTvlyfg2G35ysvKgdVr5RgZLP8xokZBQD8Gi7oOF6Sy5As1tm152XkSnefl9Dh-untc3Ds1U7kFWp-KCDY2DHDSDBDFtii-hndwoi8tmG7fY7XAxLk_u6qcybwb9tDYQk4RhHxY4frmTvVM2_5U-_f0p5fTzYj2aa9xzDN9LV35B-waQwsSw5a3OWtKbPXhj3zyAYrsj4Admzz6hcJG0a7JfxAVSDzBSpeDzBbLEkgpFjPkDFu07Aw')",
          backgroundSize: "cover",
          backgroundPosition: "left center",
        }}
      />
      {/* Fallback ambient grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-background/90 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-gutter grid grid-cols-12 gap-grid-unit">
        <div className="col-span-12 md:col-span-10 lg:col-span-7 flex flex-col justify-center">
          <p className="font-label-caps text-label-caps text-primary tracking-widest mb-4">
            STARTUP TIER ACTIVATED
          </p>
          <h1 className="font-display-lg text-display-lg text-text-high-contrast mb-6 leading-tight">
            We watch your IP space so you don&apos;t have to.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl">
            Automated surveillance, competitor tracking, and critical deadline
            alerts built for lean legal teams. Secure your perimeter with
            military-grade precision.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onInitiateDeployment}
              className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(124,58,237,0.3)] active:scale-[0.98]"
            >
              INITIATE DEPLOYMENT{" "}
              <span className="material-symbols-outlined text-[18px]">
                rocket_launch
              </span>
            </button>
            <button
              onClick={onViewSpecs}
              className="border border-border-technical bg-transparent text-text-high-contrast font-label-caps text-label-caps px-8 py-4 rounded hover:bg-surface-accent transition-all cursor-pointer active:scale-[0.98]"
            >
              VIEW SPECS
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
