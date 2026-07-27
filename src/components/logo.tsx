import logoAsset from "@/assets/furry-sitterz-logo.png.asset.json";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-primary/40 ring-1 ring-border">
        <img
          src={logoAsset.url}
          alt="Furry Sitterz logo"
          className="h-full w-full object-cover"
        />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-[13px] font-black tracking-[0.18em] text-foreground">FURRY</div>
          <div className="text-[10px] font-semibold tracking-[0.32em] text-foreground/70">SITTERZ</div>
        </div>
      )}
    </div>
  );
}
