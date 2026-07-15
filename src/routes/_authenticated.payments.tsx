import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { TableToolbar, FilterSelect, Pagination, useTableState } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { payments as seed, paymentStatuses, type Payment } from "@/lib/mock-data";
import { formatCurrency, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/payments")({
  component: PaymentsPage,
  head: () => ({ meta: [{ title: "Payments — Furry Sitterz Admin" }] }),
});

function PaymentsPage() {
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [view, setView] = useState<Payment | null>(null);
  const filters = useMemo(() => ({
    s: (p: Payment) => status === "all" || p.status === status,
    m: (p: Payment) => method === "all" || p.method === method,
  }), [status, method]);

  const t = useTableState<Payment>(seed, ["id", "customer", "sitter", "bookingId"], { filters, pageSize: 10 });
  const totalPaid = seed.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const pending = seed.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const refunded = seed.filter((p) => p.status === "Refunded").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader
        title="Payments"
        description="All platform transactions across bookings, refunds, and payouts."
        actions={<Button variant="outline" className="rounded-full" onClick={() => toast.success("Exported")}> <Download className="mr-2 h-4 w-4" />Export</Button>}
      />

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        {[
          { label: "Total received", value: formatCurrency(totalPaid), tint: "bg-success/15 text-success" },
          { label: "Pending", value: formatCurrency(pending), tint: "bg-warning/20 text-warning-foreground" },
          { label: "Refunded", value: formatCurrency(refunded), tint: "bg-info/15 text-info" },
        ].map((c) => (
          <Card key={c.label} className="rounded-2xl border-border/60 shadow-soft">
            <CardContent className="p-5">
              <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${c.tint}`}>{c.label}</div>
              <div className="mt-3 text-2xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-border/60 shadow-soft">
        <CardContent className="p-5">
          <TableToolbar query={t.query} onQueryChange={t.setQuery} placeholder="Search transactions…">
            <FilterSelect value={status} onChange={setStatus} placeholder="Status" options={[{ value: "all", label: "All statuses" }, ...paymentStatuses.map((s) => ({ value: s, label: s }))]} />
            <FilterSelect value={method} onChange={setMethod} placeholder="Method" options={[
              { value: "all", label: "All methods" }, { value: "Card", label: "Card" }, { value: "Wallet", label: "Wallet" }, { value: "Bank Transfer", label: "Bank Transfer" }, { value: "Apple Pay", label: "Apple Pay" },
            ]} />
          </TableToolbar>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Sitter</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {t.pageData.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => setView(p)}>
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell>{p.bookingId}</TableCell>
                    <TableCell>{p.customer}</TableCell>
                    <TableCell>{p.sitter}</TableCell>
                    <TableCell>{p.service}</TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(p.amount)}</TableCell>
                    <TableCell>{formatDateTime(p.date)}</TableCell>
                    <TableCell><StatusPill value={p.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination page={t.page} totalPages={t.totalPages} onChange={t.setPage} total={t.total} pageSize={t.pageSize} />
        </CardContent>
      </Card>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          {view && (
            <>
              <DialogHeader>
                <DialogTitle>Transaction {view.id}</DialogTitle>
                <DialogDescription>Booking {view.bookingId} · {view.service}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Customer</div><div className="font-medium">{view.customer}</div></div>
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Sitter</div><div className="font-medium">{view.sitter}</div></div>
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Amount</div><div className="font-medium">{formatCurrency(view.amount)}</div></div>
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Method</div><div className="font-medium">{view.method}</div></div>
                <div className="rounded-xl border p-3 col-span-2"><div className="text-xs text-muted-foreground">Status</div><StatusPill value={view.status} /></div>
              </div>
              <DialogFooter><Button variant="outline" className="rounded-full" onClick={() => setView(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
