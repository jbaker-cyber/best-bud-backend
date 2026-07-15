import { PawPrint } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
        <PawPrint className="h-5 w-5" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-[13px] font-black tracking-[0.18em] text-foreground">FURRY</div>
          <div className="text-[10px] font-semibold tracking-[0.32em] text-primary">SITTERZ</div>
        </div>
      )}
    </div>
  );
}
