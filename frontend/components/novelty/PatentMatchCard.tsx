import { PatentMatch } from "./types";

interface PatentMatchCardProps {
  match: PatentMatch;
}

export function PatentMatchCard({ match }: PatentMatchCardProps) {
  const isHighMatch = match.matchPercentage >= 75;

  return (
    <div className="bg-surface-industrial p-4 hover:bg-surface-steel transition-colors cursor-pointer group border-b border-border-technical/40 last:border-b-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center">
          <span
            className={`px-2 py-1 font-data-mono text-[10px] border font-semibold ${
              isHighMatch
                ? "bg-risk-critical/10 text-risk-critical border-risk-critical/30"
                : "bg-risk-nominal/10 text-risk-nominal border-risk-nominal/30"
            }`}
          >
            {match.matchPercentage}% MATCH
          </span>
          <span className="font-data-mono text-on-surface group-hover:text-primary transition-colors font-medium">
            {match.patentId}
          </span>
        </div>
        <span className="material-symbols-outlined text-text-muted text-[18px] group-hover:text-primary transition-colors">
          open_in_new
        </span>
      </div>

      <p className="font-body-md text-text-muted line-clamp-2 text-sm leading-relaxed">
        {match.abstract}
      </p>

      <div className="flex gap-4 mt-3">
        <div className="font-data-mono text-[10px] text-text-muted">
          <span className="text-on-surface font-medium">FILED:</span>{" "}
          {match.filingDate}
        </div>
        <div className="font-data-mono text-[10px] text-text-muted">
          <span className="text-on-surface font-medium">CLASS:</span>{" "}
          {match.ipcClass}
        </div>
      </div>
    </div>
  );
}
