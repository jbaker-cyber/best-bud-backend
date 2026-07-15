import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { TableToolbar, FilterSelect, Pagination, useTableState } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { petSitters as seed, serviceTypes, type PetSitter } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { CheckCircle2, ShieldOff, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/sitters")({
  component: SittersPage,
  head: () => ({ meta: [{ title: "Pet Sitters — Furry Sitterz Admin" }] }),
});

function SittersPage() {
  const [items, setItems] = useState<PetSitter[]>(seed);
  const [service, setService] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [view, setView] = useState<PetSitter | null>(null);

  const filters = useMemo(() => ({
    svc: (s: PetSitter) => service === "all" || s.services.includes(service as never),
    avail: (s: PetSitter) => availability === "all" || s.availability === availability,
  }), [service, availability]);

  const t = useTableState<PetSitter>(items, ["name", "city"], { filters, pageSize: 9 });

  return (
    <div>
      <PageHeader title="Pet Sitters" description="Manage sitter accounts, verification, availability and performance." />
      <Card className="rounded-2xl border-border/60 shadow-soft">
        <CardContent className="p-5">
          <TableToolbar query={t.query} onQueryChange={t.setQuery} placeholder="Search sitters…">
            <FilterSelect
              value={service} onChange={setService} placeholder="Service"
              options={[{ value: "all", label: "All services" }, ...serviceTypes.map((s) => ({ value: s, label: s }))]}
            />
            <FilterSelect
              value={availability} onChange={setAvailability} placeholder="Availability"
              options={[
                { value: "all", label: "Any availability" },
                { value: "available", label: "Available" },
                { value: "busy", label: "Busy" },
                { value: "off", label: "Off duty" },
              ]}
            />
          </TableToolbar>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {t.pageData.map((s) => (
              <div key={s.id} className="group rounded-2xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-card">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name[0]}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-semibold">{s.name}</span>
                      {s.verified && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{s.city} · {s.experienceYears} yrs experience</div>
                  </div>
                  <StatusPill value={s.availability === "available" ? "active" : s.availability === "busy" ? "pending" : "Closed"} />
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {s.services.map((sv) => <Badge key={sv} variant="secondary" className="rounded-full text-[10px]">{sv}</Badge>)}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-muted/50 p-2"><div className="text-sm font-bold">${s.pricePerHour}</div><div className="text-muted-foreground">/hr</div></div>
                  <div className="rounded-xl bg-muted/50 p-2"><div className="text-sm font-bold">{s.completedJobs}</div><div className="text-muted-foreground">jobs</div></div>
                  <div className="rounded-xl bg-muted/50 p-2"><div className="flex items-center justify-center gap-0.5 text-sm font-bold"><Star className="h-3 w-3 fill-warning text-warning" />{s.rating}</div><div className="text-muted-foreground">rating</div></div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => setView(s)}>View</Button>
                  {!s.verified ? (
                    <Button size="sm" className="flex-1 rounded-full" onClick={() => { setItems((r) => r.map((x) => x.id === s.id ? { ...x, verified: true } : x)); toast.success(`${s.name} verified`); }}>
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Verify
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => { setItems((r) => r.map((x) => x.id === s.id ? { ...x, status: x.status === "suspended" ? "active" : "suspended" } : x)); toast.success(`${s.name} ${s.status === "suspended" ? "reactivated" : "suspended"}`); }}>
                      <ShieldOff className="mr-1.5 h-3.5 w-3.5" />{s.status === "suspended" ? "Activate" : "Suspend"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Pagination page={t.page} totalPages={t.totalPages} onChange={t.setPage} total={t.total} pageSize={t.pageSize} />
        </CardContent>
      </Card>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-lg">
          {view && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14"><AvatarImage src={view.avatar} /><AvatarFallback>{view.name[0]}</AvatarFallback></Avatar>
                  <div>
                    <DialogTitle>{view.name} {view.verified && <CheckCircle2 className="inline h-4 w-4 text-success" />}</DialogTitle>
                    <DialogDescription>{view.city} · Joined {formatDate(view.joinDate)}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">{view.bio}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Email</div><div className="font-medium">{view.email}</div></div>
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Phone</div><div className="font-medium">{view.phone}</div></div>
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Rate</div><div className="font-medium">${view.pricePerHour}/hr</div></div>
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Availability</div><div className="font-medium capitalize">{view.availability}</div></div>
              </div>
              <div>
                <div className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">Services offered</div>
                <div className="flex flex-wrap gap-1.5">{view.services.map((s) => <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>)}</div>
              </div>
              <DialogFooter><Button variant="outline" className="rounded-full" onClick={() => setView(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
