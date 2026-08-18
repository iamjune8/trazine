import { cn } from "@/lib/utils";

type Tone = "violet" | "cyan" | "pink" | "success" | "danger" | "warning" | "neutral";

const TONES: Record<Tone, string> = {
  violet: "bg-admin-violet/15 text-admin-violet border-admin-violet/25",
  cyan: "bg-admin-cyan/15 text-admin-cyan border-admin-cyan/25",
  pink: "bg-admin-pink/15 text-admin-pink border-admin-pink/25",
  success: "bg-admin-success/15 text-admin-success border-admin-success/25",
  danger: "bg-admin-danger/15 text-admin-danger border-admin-danger/25",
  warning: "bg-admin-warning/15 text-admin-warning border-admin-warning/25",
  neutral: "bg-white/5 text-admin-text-2 border-admin-border",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.06em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
