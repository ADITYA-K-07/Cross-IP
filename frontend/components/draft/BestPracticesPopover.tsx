"use client";

import { useEffect, useRef, useState } from "react";

export function BestPracticesPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 font-label-caps text-text-muted hover:text-primary transition-colors text-xs"
      >
        Drafting Best Practices
        <span className="material-symbols-outlined text-[16px]">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-surface-container-low border border-border-technical shadow-xl p-3 z-20 rounded">
          <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 font-bold">•</span>
              <span>Define structural elements clearly.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 font-bold">•</span>
              <span>Describe connections and interactions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 font-bold">•</span>
              <span>Specify the novel functional result.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 font-bold">•</span>
              <span>Avoid overly broad or vague terminology.</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
