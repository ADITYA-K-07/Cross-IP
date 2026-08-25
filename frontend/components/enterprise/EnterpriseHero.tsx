"use client";

import { MonitoredNodesWidget } from "./MonitoredNodesWidget";

interface EnterpriseHeroProps {
  onInitializeDeployment: () => void;
}

export function EnterpriseHero({
  onInitializeDeployment,
}: EnterpriseHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-surface-container-lowest pt-20 pb-28 border-b border-border-technical">
      {/* Background Subtle Tech Watermark/Scrim matching Stitch */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-5 mix-blend-multiply w-full"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida/AEtjO1Vcf7LD3NgvG7pBJasSX5-n_gDdmEGnMluBt8Oq4T8fE674RoJ7erKp2P6P3jV_agvQ28VonmArimy0jupU3tF9AMBgTk6-n0nywwOsUqIa5dm_aFpYq2wUIBDBuSAmoKLAzzwCbs0YWl4BnAtaYH17QIcXDZr0CP_OcPshlCNMYZGLt_A4SIYFEkC-Cw9DFf4QI8bAvimZQuPGe889n-gyhSVdyqTUJ1ekmmri-gdVtYHy7_MElU0Rblkt')",
          }}
        />
        <div className="absolute inset-0 bg-surface-container-lowest/90 w-full" />
      </div>

      <div className="relative z-10 px-8 max-w-[1440px] mx-auto flex flex-col md:flex-row gap-12 items-end">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 text-primary font-label-caps text-label-caps mb-6 tracking-widest uppercase rounded-sm">
            <span className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
            Enterprise Architecture
          </div>
          <h1 className="font-display-lg text-display-lg text-text-high-contrast mb-6 leading-[1.05] max-w-3xl">
            Your IP Team,
            <br />
            <span className="text-primary">At a Fraction of the Cost.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed border-l-2 border-border-technical pl-6">
            Deploy brutal efficiency across your intellectual property portfolio.
            IPSentinel Enterprise scales advanced monitoring, predictive mapping,
            and structural integrity analysis without the overhead of traditional
            legal teams.
          </p>
        </div>

        {/* Monitored Nodes Widget */}
        <MonitoredNodesWidget
          onInitializeDeployment={onInitializeDeployment}
        />
      </div>
    </section>
  );
}
