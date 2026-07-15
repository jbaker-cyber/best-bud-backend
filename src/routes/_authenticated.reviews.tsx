import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TableToolbar, FilterSelect, Pagination, useTableState } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, EyeOff, Trash2, ImageIcon } from "lucide-react";
import { reviews as seed, serviceTypes, type Review } from "@/lib/mock-data";
import { relativeTime } from "@/lib/format";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/reviews")({
  component: ReviewsPage,
  head: () => ({ meta: [{ title: "Reviews — Furry Sitterz Admin" }] }),
});

function ReviewsPage() {
  const [items, setItems] = useState<Review[]>(seed);
  const [service, setService] = useState("all");
  const [rating, setRating] = useState("all");
  const [toDelete, setToDelete] = useState<Review | null>(null);
  const filters = useMemo(() => ({
    s: (r: Review) => service === "all" || r.service === service,
    r: (r: Review) => rating === "all" || r.rating === Number(rating),
  }), [service, rating]);
  const t = useTableState<Review>(items, ["reviewer", "receiver", "comment"], { filters, pageSize: 8 });

  return (
    <div>
      <PageHeader title="Reviews" description="Every review submitted to the platform. Moderate flagged or inappropriate feedback." />
      <Card className="rounded-2xl border-border/60 shadow-soft">
        <CardContent className="p-5">
          <TableToolbar query={t.query} onQueryChange={t.setQuery} placeholder="Search reviews…">
            <FilterSelect value={service} onChange={setService} placeholder="Service" options={[{ value: "all", label: "All services" }, ...serviceTypes.map((s) => ({ value: s, label: s }))]} />
            <FilterSelect value={rating} onChange={setRating} placeholder="Rating" options={[
              { value: "all", label: "All ratings" }, { value: "5", label: "5 stars" }, { value: "4", label: "4 stars" }, { value: "3", label: "3 stars" },
            ]} />
          </TableToolbar>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {t.pageData.map((r) => (
              <div key={r.id} className={`rounded-2xl border p-4 ${r.hidden ? "border-dashed border-muted bg-muted/30 opacity-70" : "border-border/60 bg-card"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.reviewer} → {r.receiver}</div>
                    <div className="text-xs text-muted-foreground">{r.service} · {relativeTime(r.date)}</div>
                  </div>
                  <div className="flex items-center gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-current" : "opacity-25"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {r.images > 0 && <><ImageIcon className="h-3.5 w-3.5" />{r.images} image{r.images > 1 ? "s" : ""}</>}
                    {r.hidden && <Badge variant="secondary" className="rounded-full">Hidden</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-8 rounded-full text-xs" onClick={() => { setItems((rs) => rs.map((x) => x.id === r.id ? { ...x, hidden: !x.hidden } : x)); toast.success(r.hidden ? "Review restored" : "Review hidden"); }}>
                      {r.hidden ? <><Eye className="mr-1 h-3.5 w-3.5" />Restore</> : <><EyeOff className="mr-1 h-3.5 w-3.5" />Hide</>}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 rounded-full text-xs text-destructive" onClick={() => setToDelete(r)}>
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
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>The review will be permanently removed from the platform.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { setItems((rs) => rs.filter((r) => r.id !== toDelete!.id)); toast.success("Review deleted"); setToDelete(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
