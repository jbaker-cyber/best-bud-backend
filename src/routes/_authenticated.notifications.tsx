import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Send } from "lucide-react";
import { notifications as seed, type Notification } from "@/lib/mock-data";
import { relativeTime } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
  head: () => ({ meta: [{ title: "Notifications — Furry Sitterz Admin" }] }),
});

function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ title: string; message: string; audience: Notification["audience"] }>({ title: "", message: "", audience: "All Users" });

  function send() {
    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    const n: Notification = {
      id: `N-${items.length + 100}`,
      title: form.title,
      message: form.message,
      audience: form.audience,
      date: new Date().toISOString(),
      status: "Sent",
    };
    setItems((r) => [n, ...r]);
    toast.success(`Announcement sent to ${form.audience}`);
    setForm({ title: "", message: "", audience: "All Users" });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Notification Center"
        description="Send announcements and view broadcast history."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full"><Plus className="mr-2 h-4 w-4" />Send announcement</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New announcement</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={80} /></div>
                <div className="space-y-1.5"><Label>Message</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={280} className="min-h-[100px]" /></div>
                <div className="space-y-1.5">
                  <Label>Audience</Label>
                  <Select value={form.audience} onValueChange={(v) => setForm({ ...form, audience: v as Notification["audience"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="Owners">Pet Owners</SelectItem>
                      <SelectItem value="Sitters">Pet Sitters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className="rounded-full" onClick={send}><Send className="mr-1.5 h-4 w-4" />Send now</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="rounded-2xl border-border/60 shadow-soft">
        <CardContent className="p-5">
          <div className="divide-y divide-border/60">
            {items.map((n) => (
              <div key={n.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-sm text-muted-foreground">{n.message}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{n.audience} · {relativeTime(n.date)}</div>
                </div>
                <StatusPill value={n.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
