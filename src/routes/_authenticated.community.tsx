import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TableToolbar, FilterSelect, Pagination, useTableState } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, EyeOff, Heart, MessageCircle, ShieldAlert, Trash2 } from "lucide-react";
import { communityPosts as seed, type CommunityPost } from "@/lib/mock-data";
import { relativeTime } from "@/lib/format";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/community")({
  component: CommunityPage,
  head: () => ({ meta: [{ title: "Community — Furry Sitterz Admin" }] }),
});

function CommunityPage() {
  const [items, setItems] = useState<CommunityPost[]>(seed);
  const [filter, setFilter] = useState("all");
  const [toDelete, setToDelete] = useState<CommunityPost | null>(null);
  const filters = useMemo(() => ({
    f: (p: CommunityPost) =>
      filter === "all" || (filter === "reported" && p.reported) || (filter === "hidden" && p.hidden),
  }), [filter]);
  const t = useTableState<CommunityPost>(items, ["author", "title", "content"], { filters, pageSize: 8 });

  return (
    <div>
      <PageHeader title="Community" description="Discussions, tips and questions shared across the pet-loving community." />
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <StatCard label="Total posts" value={items.length} tint="bg-primary/15 text-primary" />
        <StatCard label="Reported" value={items.filter((i) => i.reported).length} tint="bg-destructive/15 text-destructive" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Hidden" value={items.filter((i) => i.hidden).length} tint="bg-muted text-muted-foreground" icon={<EyeOff className="h-4 w-4" />} />
      </div>

      <Card className="rounded-2xl border-border/60 shadow-soft">
        <CardContent className="p-5">
          <TableToolbar query={t.query} onQueryChange={t.setQuery} placeholder="Search posts…">
            <FilterSelect value={filter} onChange={setFilter} placeholder="Filter" options={[
              { value: "all", label: "All posts" }, { value: "reported", label: "Reported" }, { value: "hidden", label: "Hidden" },
            ]} />
          </TableToolbar>

          <div className="mt-5 space-y-3">
            {t.pageData.map((p) => (
              <div key={p.id} className={`rounded-2xl border p-4 ${p.hidden ? "border-dashed opacity-60" : "border-border/60"}`}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9"><AvatarImage src={p.avatar} /><AvatarFallback>{p.author[0]}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{p.author}</span>
                      <span className="text-xs text-muted-foreground">{relativeTime(p.date)}</span>
                      {p.reported && <Badge className="rounded-full bg-destructive/15 text-destructive hover:bg-destructive/15"><ShieldAlert className="mr-1 h-3 w-3" />Reported</Badge>}
                      {p.hidden && <Badge variant="secondary" className="rounded-full">Hidden</Badge>}
                    </div>
                    <div className="mt-1 font-medium">{p.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{p.content}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{p.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{p.comments}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="ghost" className="rounded-full text-xs" onClick={() => { setItems((rs) => rs.map((x) => x.id === p.id ? { ...x, hidden: !x.hidden } : x)); toast.success(p.hidden ? "Post restored" : "Post hidden"); }}>
                      {p.hidden ? <><Eye className="mr-1 h-3.5 w-3.5" />Show</> : <><EyeOff className="mr-1 h-3.5 w-3.5" />Hide</>}
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full text-xs text-destructive" onClick={() => setToDelete(p)}>
                      <Trash2 className="mr-1 h-3.5 w-3.5" />Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={t.page} totalPages={t.totalPages} onChange={t.setPage} total={t.total} pageSize={t.pageSize} />
        </CardContent>
      </Card>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>Removing "{toDelete?.title}" will delete all associated comments.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { setItems((rs) => rs.filter((r) => r.id !== toDelete!.id)); toast.success("Post deleted"); setToDelete(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({ label, value, tint, icon }: { label: string; value: number; tint: string; icon?: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border-border/60 shadow-soft">
      <CardContent className="p-5">
        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tint}`}>{icon}{label}</div>
        <div className="mt-3 text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
