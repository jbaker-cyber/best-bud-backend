import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cmsPages as seed } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { Bold, Italic, Link as LinkIcon, List, Save, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/cms")({
  component: CmsPage,
  head: () => ({ meta: [{ title: "CMS — Furry Sitterz Admin" }] }),
});

function CmsPage() {
  const [pages, setPages] = useState(seed);
  const [active, setActive] = useState(pages[0].slug);
  const current = pages.find((p) => p.slug === active)!;
  const [title, setTitle] = useState(current.title);
  const [body, setBody] = useState(current.body);

  function selectPage(slug: string) {
    setActive(slug);
    const p = pages.find((x) => x.slug === slug)!;
    setTitle(p.title);
    setBody(p.body);
  }

  function save() {
    setPages((rows) => rows.map((r) => r.slug === active ? { ...r, title, body, updatedAt: new Date().toISOString() } : r));
    toast.success("Page saved");
  }

  return (
    <div>
      <PageHeader title="Content Management" description="Edit public policies, marketing pages, and FAQs." />
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <Card className="rounded-2xl border-border/60 shadow-soft">
          <CardContent className="space-y-1 p-3">
            {pages.map((p) => (
              <button key={p.slug} onClick={() => selectPage(p.slug)} className={`flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${active === p.slug ? "bg-primary/15 text-foreground" : "hover:bg-muted"}`}>
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{p.title}</div>
                  <div className="truncate text-[11px] text-muted-foreground">Updated {formatDate(p.updatedAt)}</div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-soft">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label htmlFor="cms-title">Title</Label>
              <Input id="cms-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Content</Label>
                <div className="flex items-center gap-1 rounded-full border bg-card p-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Bold className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Italic className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7"><LinkIcon className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7"><List className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[320px] rounded-2xl font-sans text-sm" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Last updated {formatDate(current.updatedAt)}</div>
              <Button className="rounded-full" onClick={save}><Save className="mr-1.5 h-4 w-4" />Save changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
