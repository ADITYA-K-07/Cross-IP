import { PatentClaim } from "./types";

interface ClaimCardProps {
  claim: PatentClaim;
}

export function ClaimCard({ claim }: ClaimCardProps) {
  const isIndependent = claim.type === "independent";

  if (!isIndependent) {
    return (
      <div className="group border border-border-technical bg-surface-container-low p-5 hover:border-border-technical/80 transition-colors ml-12 relative shadow-sm rounded">
        <div className="absolute top-0 left-0 w-1 h-full bg-border-technical group-hover:bg-text-muted transition-colors rounded-l" />
        <div className="flex gap-4">
          <div className="font-headline-md text-text-muted w-8 shrink-0">
            {claim.number}.
          </div>
          <div className="font-body-lg text-on-surface-variant leading-relaxed text-sm">
            {claim.text}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group border border-border-technical bg-surface-container-lowest p-5 hover:border-primary/50 transition-colors relative shadow-sm rounded">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors rounded-l" />
      <div className="flex gap-4">
        <div className="font-headline-md text-primary w-8 shrink-0">
          {claim.number}.
        </div>
        <div className="font-body-lg text-on-surface leading-relaxed text-base">
          {claim.text}

          {claim.subClauses && claim.subClauses.length > 0 && (
            <ul className="list-none mt-3 space-y-3 pl-4 border-l border-border-technical">
              {claim.subClauses.map((clause, idx) => (
                <li key={idx} className="text-sm">
                  {clause.title && (
                    <span className="font-bold text-on-surface mr-1">
                      {clause.title}
                    </span>
                  )}
                  <span>{clause.text}</span>

                  {clause.nestedItems && clause.nestedItems.length > 0 && (
                    <ul className="list-none mt-2 space-y-2 pl-4 border-l border-border-technical">
                      {clause.nestedItems.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-sm text-on-surface-variant">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
