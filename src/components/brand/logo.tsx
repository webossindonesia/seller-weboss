import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Use light text for dark backgrounds. */
  light?: boolean;
  showWordmark?: boolean;
}

/**
 * WEBOSS wordmark. A rounded "W" mark in the brand magenta paired with the
 * WEBOSS wordmark in navy (or white on dark surfaces).
 */
export function Logo({ className, light = false, showWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-magenta shadow-sm shadow-magenta/30">
        <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/20" />
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
          <path
            d="M3 5l3 14 4-10 4 10 3-14"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span
          className={cn(
            "text-xl font-extrabold tracking-tight",
            light ? "text-white" : "text-navy",
          )}
        >
          WE<span className="text-magenta">BOSS</span>
        </span>
      )}
    </span>
  );
}
