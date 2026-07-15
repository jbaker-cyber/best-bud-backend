import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TableToolbar, FilterSelect, Pagination, useTableState } from "@/components/data-table";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Send, X } from "lucide-react";
import { supportTickets as seed, type SupportTicket } from "@/lib/mock-data";
import { relativeTime } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/support")({
  component: SupportPage,
  head: () => ({ meta: [{ title: "Support — Furry Sitterz Admin" }] }),
});

function SupportPage() {
  const [items, setItems] = useState<SupportTicket[]>(seed);
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [open, setOpen] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");
  const filters = useMemo(() => ({
    s: (t: SupportTicket) => status === "all" || t.status === status,
    p: (t: SupportTicket) => priority === "all" || t.priority === priority,
  }), [status, priority]);
  const t = useTableState<SupportTicket>(items, ["id", "customer", "subject"], { filters, pageSize: 8 });

  function sendReply() {
    if (!open || !reply.trim()) return;
    const msg = { author: "Support", date: new Date().toISOString(), body: reply, me: true };
    setItems((rs) => rs.map((r) => r.id === open.id ? { ...r, messages: [...r.messages, msg], lastReply: msg.date } : r));
    setOpen({ ...open, messages: [...open.messages, msg] });
    setReply("");
    toast.success("Reply sent");
  }

  function closeTicket(id: string) {
    setItems((rs) => rs.map((r) => r.id === id ? { ...r, status: "Closed" } : r));
    if (open?.id === id) setOpen({ ...open, status: "Closed" });
    toast.success("Ticket closed");
  }

  return (
    <div>
      <PageHeader title="Support Center" description="Manage support conversations from pet owners and sitters." />
      <Card className="rounded-2xl border-border/60 shadow-soft">
        <CardContent className="p-5">
          <TableToolbar query={t.query} onQueryChange={t.setQuery} placeholder="Search tickets…">
            <FilterSelect value={status} onChange={setStatus} placeholder="Status" options={[
              { value: "all", label: "All statuses" }, { value: "Open", label: "Open" }, { value: "Pending", label: "Pending" }, { value: "Resolved", label: "Resolved" }, { value: "Closed", label: "Closed" },
            ]} />
            <FilterSelect value={priority} onChange={setPriority} placeholder="Priority" options={[
              { value: "all", label: "Any priority" }, { value: "Urgent", label: "Urgent" }, { value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" },
            ]} />
          </TableToolbar>

          <div className="mt-5 space-y-2">
            {t.pageData.map((tk) => (
              <button key={tk.id} onClick={() => setOpen(tk)} className="flex w-full flex-col gap-1 rounded-2xl border border-border/60 bg-card p-4 text-left transition-shadow hover:shadow-card md:flex-row md:items-center md:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{tk.id}</span>
                    <span className="font-medium">{tk.subject}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{tk.customer} · {tk.category} · Last reply {relativeTime(tk.lastReply)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill value={tk.priority} />
                  <StatusPill value={tk.status} />
                </div>
              </button>
            ))}
          </div>

          <Pagination page={t.page} totalPages={t.totalPages} onChange={t.setPage} total={t.total} pageSize={t.pageSize} />
        </CardContent>
      </Card>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>{open.subject}</DialogTitle>
                <DialogDescription>{open.id} · {open.customer} · <StatusPill value={open.status} /> <StatusPill value={open.priority} /></DialogDescription>
              </DialogHeader>
              <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border bg-muted/30 p-3">
                {open.messages.map((m, i) => (
                  <div key={i} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.me ? "ml-auto bg-primary text-primary-foreground" : "bg-card"}`}>
                    <div className="text-[10px] opacity-70">{m.author} · {relativeTime(m.date)}</div>
                    <div>{m.body}</div>
                  </div>
                ))}
              </div>
              <div>
                <Textarea placeholder="Write a reply…" value={reply} onChange={(e) => setReply(e.target.value)} className="min-h-[80px]" />
              </div>
              <DialogFooter className="justify-between sm:justify-between">
                <Button variant="outline" className="rounded-full" onClick={() => closeTicket(open.id)}>
                  <X className="mr-1.5 h-4 w-4" /> Close ticket
                </Button>
                <Button className="rounded-full" onClick={sendReply} disabled={!reply.trim()}>
                  <Send className="mr-1.5 h-4 w-4" /> Send reply
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
