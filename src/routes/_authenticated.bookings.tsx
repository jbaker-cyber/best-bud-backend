import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { TableToolbar, FilterSelect, Pagination, useTableState } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bookings as seed, bookingStatuses, serviceTypes, type Booking, type BookingStatus } from "@/lib/mock-data";
import { formatCurrency, formatDateTime, relativeTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/bookings")({
  component: BookingsPage,
  head: () => ({ meta: [{ title: "Bookings — Furry Sitterz Admin" }] }),
});

function BookingsPage() {
  const [items, setItems] = useState<Booking[]>(seed);
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [view, setView] = useState<Booking | null>(null);
  const [toDelete, setToDelete] = useState<Booking | null>(null);

  const filters = useMemo(() => ({
    status: (b: Booking) => status === "all" || b.status === status,
    service: (b: Booking) => service === "all" || b.service === service,
  }), [status, service]);

  const t = useTableState<Booking>(items, ["id", "ownerName", "sitterName", "service"], { filters, pageSize: 8 });

  function toggle(id: string) {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }
  function toggleAll() {
    if (t.pageData.every((b) => selected.has(b.id))) {
      const next = new Set(selected); t.pageData.forEach((b) => next.delete(b.id)); setSelected(next);
    } else {
      const next = new Set(selected); t.pageData.forEach((b) => next.add(b.id)); setSelected(next);
    }
  }
  function bulkExport() {
    toast.success(`Exported ${selected.size || t.total} bookings to CSV`);
  }
  function changeStatus(id: string, next: BookingStatus) {
    setItems((rows) => rows.map((r) => (r.id === id ? { ...r, status: next } : r)));
    toast.success(`Booking ${id} → ${next}`);
  }
  function confirmDelete() {
    if (!toDelete) return;
    setItems((rows) => rows.filter((r) => r.id !== toDelete.id));
    toast.success(`Booking ${toDelete.id} deleted`);
    setToDelete(null);
  }

  return (
    <div>
      <PageHeader
        title="Bookings"
        description="All booked services across the platform. Manage statuses, review timelines, and export data."
        actions={
          <>
            <Button variant="outline" className="rounded-full" onClick={bulkExport}><Download className="mr-2 h-4 w-4" />Export</Button>
          </>
        }
      />

      <Card className="rounded-2xl border-border/60 shadow-soft">
        <CardContent className="p-5">
          <TableToolbar
            query={t.query}
            onQueryChange={t.setQuery}
            placeholder="Search booking ID, owner, sitter…"
            actions={
              selected.size > 0 ? (
                <>
                  <span className="text-sm text-muted-foreground">{selected.size} selected</span>
                  <Button variant="outline" size="sm" className="rounded-full" onClick={bulkExport}>Export</Button>
                  <Button variant="outline" size="sm" className="rounded-full text-destructive" onClick={() => { setItems((r) => r.filter((x) => !selected.has(x.id))); toast.success(`${selected.size} bookings deleted`); setSelected(new Set()); }}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </>
              ) : null
            }
          >
            <FilterSelect
              value={status}
              onChange={setStatus}
              placeholder="Status"
              options={[{ value: "all", label: "All statuses" }, ...bookingStatuses.map((s) => ({ value: s, label: s }))]}
            />
            <FilterSelect
              value={service}
              onChange={setService}
              placeholder="Service"
              options={[{ value: "all", label: "All services" }, ...serviceTypes.map((s) => ({ value: s, label: s }))]}
            />
          </TableToolbar>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <Checkbox
                      checked={t.pageData.length > 0 && t.pageData.every((b) => selected.has(b.id))}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Sitter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {t.pageData.map((b) => (
                  <TableRow key={b.id} className="hover:bg-muted/50">
                    <TableCell><Checkbox checked={selected.has(b.id)} onCheckedChange={() => toggle(b.id)} /></TableCell>
                    <TableCell>
                      <div className="font-medium">{b.id}</div>
                      <div className="text-xs text-muted-foreground">{b.petNames.join(", ")}</div>
                    </TableCell>
                    <TableCell>{b.service}</TableCell>
                    <TableCell>{b.ownerName}</TableCell>
                    <TableCell>{b.sitterName}</TableCell>
                    <TableCell>
                      <div>{formatDateTime(b.date)}</div>
                      <div className="text-xs text-muted-foreground">{b.time}</div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(b.amount)}</TableCell>
                    <TableCell><StatusPill value={b.status} /></TableCell>
                    <TableCell><StatusPill value={b.paymentStatus} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setView(b)}><Eye className="mr-2 h-4 w-4" />View details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {bookingStatuses.map((s) => (
                            <DropdownMenuItem key={s} disabled={b.status === s} onClick={() => changeStatus(b.id, s)}>
                              Mark as {s}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => setToDelete(b)}>
                            <Trash2 className="mr-2 h-4 w-4" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {t.pageData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                      No bookings match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination page={t.page} totalPages={t.totalPages} onChange={t.setPage} total={t.total} pageSize={t.pageSize} />
        </CardContent>
      </Card>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-2xl">
          {view && (
            <>
              <DialogHeader>
                <DialogTitle>Booking {view.id}</DialogTitle>
                <DialogDescription>{view.service} · {relativeTime(view.date)}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-muted-foreground">Pet Owner</div>
                  <div className="font-semibold">{view.ownerName}</div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-muted-foreground">Pet Sitter</div>
                  <div className="font-semibold">{view.sitterName}</div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-muted-foreground">Pets</div>
                  <div className="font-semibold">{view.petNames.join(", ")}</div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="font-semibold">{formatCurrency(view.amount)}</div>
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Status</div>
                <div className="flex items-center gap-2">
                  <StatusPill value={view.status} />
                  <Select value={view.status} onValueChange={(v) => { changeStatus(view.id, v as BookingStatus); setView({ ...view, status: v as BookingStatus }); }}>
                    <SelectTrigger className="h-8 w-40 rounded-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {bookingStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Timeline</div>
                <ol className="space-y-2">
                  {view.timeline.map((e, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <div className="text-sm font-medium">{e.label}</div>
                        <div className="text-xs text-muted-foreground">{formatDateTime(e.date)}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Notes</div>
                <p className="text-sm text-muted-foreground">{view.notes}</p>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-full" onClick={() => setView(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete booking {toDelete?.id}?</AlertDialogTitle>
            <AlertDialogDescription>This action can't be undone. The record will be removed from the platform.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
