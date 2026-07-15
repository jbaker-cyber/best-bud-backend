import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MoreHorizontal, Eye, UserX, UserCheck2, Trash2, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { TableToolbar, FilterSelect, Pagination, useTableState } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { petOwners as seedOwners, petSitters as seedSitters, type PetOwner, type PetSitter } from "@/lib/mock-data";
import { formatDate, relativeTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/users")({
  component: UsersPage,
  head: () => ({ meta: [{ title: "Users — Furry Sitterz Admin" }] }),
});

function UsersPage() {
  const [owners, setOwners] = useState<PetOwner[]>(seedOwners);
  const [sitters, setSitters] = useState<PetSitter[]>(seedSitters);

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Pet owners and pet sitters using Furry Sitterz. Suspend, verify, or update accounts as needed."
        actions={
          <>
            <Button variant="outline" className="rounded-full" onClick={() => toast.success("Users exported")}><Download className="mr-2 h-4 w-4" />Export</Button>
            <Button className="rounded-full" onClick={() => toast("Invite flow coming from a modal in production")}><Plus className="mr-2 h-4 w-4" />Invite user</Button>
          </>
        }
      />

      <Tabs defaultValue="owners">
        <TabsList className="rounded-full bg-card p-1">
          <TabsTrigger value="owners" className="rounded-full">Pet Owners ({owners.length})</TabsTrigger>
          <TabsTrigger value="sitters" className="rounded-full">Pet Sitters ({sitters.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="owners">
          <OwnersTable data={owners} setData={setOwners} />
        </TabsContent>
        <TabsContent value="sitters">
          <SittersTable data={sitters} setData={setSitters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OwnersTable({ data, setData }: { data: PetOwner[]; setData: (u: (r: PetOwner[]) => PetOwner[]) => void }) {
  const [status, setStatus] = useState("all");
  const [view, setView] = useState<PetOwner | null>(null);
  const [edit, setEdit] = useState<PetOwner | null>(null);
  const [toDelete, setToDelete] = useState<PetOwner | null>(null);

  const filters = useMemo(() => ({ s: (u: PetOwner) => status === "all" || u.status === status }), [status]);
  const t = useTableState<PetOwner>(data, ["name", "email", "city"], { filters, pageSize: 8 });

  return (
    <Card className="mt-4 rounded-2xl border-border/60 shadow-soft">
      <CardContent className="p-5">
        <TableToolbar query={t.query} onQueryChange={t.setQuery} placeholder="Search owners…">
          <FilterSelect
            value={status}
            onChange={setStatus}
            placeholder="Status"
            options={[{ value: "all", label: "All statuses" }, { value: "active", label: "Active" }, { value: "pending", label: "Pending" }, { value: "suspended", label: "Suspended" }]}
          />
        </TableToolbar>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {t.pageData.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.pets.join(", ")}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{u.email}</div>
                    <div className="text-xs text-muted-foreground">{u.phone}</div>
                  </TableCell>
                  <TableCell>{u.city}</TableCell>
                  <TableCell>{u.totalBookings}</TableCell>
                  <TableCell>{u.rating}★</TableCell>
                  <TableCell>{formatDate(u.joinDate)}</TableCell>
                  <TableCell><StatusPill value={u.status} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setView(u)}><Eye className="mr-2 h-4 w-4" />View profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEdit(u)}>Edit user</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {u.status !== "suspended" ? (
                          <DropdownMenuItem onClick={() => { setData((rs) => rs.map((r) => r.id === u.id ? { ...r, status: "suspended" } : r)); toast.success(`${u.name} suspended`); }}>
                            <UserX className="mr-2 h-4 w-4" />Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => { setData((rs) => rs.map((r) => r.id === u.id ? { ...r, status: "active" } : r)); toast.success(`${u.name} activated`); }}>
                            <UserCheck2 className="mr-2 h-4 w-4" />Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setToDelete(u)}>
                          <Trash2 className="mr-2 h-4 w-4" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination page={t.page} totalPages={t.totalPages} onChange={t.setPage} total={t.total} pageSize={t.pageSize} />
      </CardContent>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          {view && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14"><AvatarImage src={view.avatar} /><AvatarFallback>{view.name[0]}</AvatarFallback></Avatar>
                  <div>
                    <DialogTitle>{view.name}</DialogTitle>
                    <DialogDescription>{view.email} · {view.city}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Phone</div><div className="font-medium">{view.phone}</div></div>
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Bookings</div><div className="font-medium">{view.totalBookings}</div></div>
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Rating</div><div className="font-medium">{view.rating}★</div></div>
                <div className="rounded-xl border p-3"><div className="text-xs text-muted-foreground">Last active</div><div className="font-medium">{relativeTime(view.lastActive)}</div></div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-full" onClick={() => setView(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          {edit && (
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); setData((rs) => rs.map((r) => r.id === edit.id ? { ...r, name: String(fd.get("name")), email: String(fd.get("email")), phone: String(fd.get("phone")), city: String(fd.get("city")) } : r)); toast.success("Owner updated"); setEdit(null); }} className="space-y-4">
              <DialogHeader><DialogTitle>Edit owner</DialogTitle></DialogHeader>
              <div className="space-y-1.5"><Label>Name</Label><Input name="name" defaultValue={edit.name} required /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input name="email" type="email" defaultValue={edit.email} required /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input name="phone" defaultValue={edit.phone} /></div>
              <div className="space-y-1.5"><Label>City</Label><Input name="city" defaultValue={edit.city} /></div>
              <DialogFooter>
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setEdit(null)}>Cancel</Button>
                <Button type="submit" className="rounded-full">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>All associated bookings and reviews will remain but be anonymized.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { setData((rs) => rs.filter((r) => r.id !== toDelete!.id)); toast.success("Owner deleted"); setToDelete(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function SittersTable({ data, setData }: { data: PetSitter[]; setData: (u: (r: PetSitter[]) => PetSitter[]) => void }) {
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const filters = useMemo(() => ({ s: (u: PetSitter) => status === "all" || u.status === status }), [status]);
  const t = useTableState<PetSitter>(data, ["name", "email", "city"], { filters, pageSize: 8 });

  return (
    <Card className="mt-4 rounded-2xl border-border/60 shadow-soft">
      <CardContent className="p-5">
        <TableToolbar query={t.query} onQueryChange={t.setQuery} placeholder="Search sitters…">
          <FilterSelect
            value={status} onChange={setStatus} placeholder="Status"
            options={[{ value: "all", label: "All statuses" }, { value: "active", label: "Active" }, { value: "pending", label: "Pending" }, { value: "suspended", label: "Suspended" }]}
          />
        </TableToolbar>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"><Checkbox
                  checked={t.pageData.length > 0 && t.pageData.every((x) => selected.has(x.id))}
                  onCheckedChange={() => {
                    const all = t.pageData.every((x) => selected.has(x.id));
                    setSelected((prev) => {
                      const s = new Set(prev);
                      t.pageData.forEach((x) => all ? s.delete(x.id) : s.add(x.id));
                      return s;
                    });
                  }} /></TableHead>
                <TableHead>Sitter</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Jobs</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {t.pageData.map((u) => (
                <TableRow key={u.id}>
                  <TableCell><Checkbox checked={selected.has(u.id)} onCheckedChange={() => setSelected((prev) => { const s = new Set(prev); s.has(u.id) ? s.delete(u.id) : s.add(u.id); return s; })} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarImage src={u.avatar} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.experienceYears} yrs · {u.city}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[220px]">
                    <div className="flex flex-wrap gap-1">
                      {u.services.slice(0, 2).map((s) => <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{s}</span>)}
                      {u.services.length > 2 && <span className="text-[10px] text-muted-foreground">+{u.services.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell>${u.pricePerHour}/hr</TableCell>
                  <TableCell>{u.completedJobs}/{u.totalJobs}</TableCell>
                  <TableCell>{u.rating}★</TableCell>
                  <TableCell>{u.verified ? <StatusPill value="Confirmed" /> : <StatusPill value="Pending" />}</TableCell>
                  <TableCell><StatusPill value={u.status} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setData((rs) => rs.map((r) => r.id === u.id ? { ...r, verified: !r.verified } : r)); toast.success(u.verified ? "Verification revoked" : "Sitter verified"); }}>
                          {u.verified ? "Revoke verification" : "Verify account"}
                        </DropdownMenuItem>
                        {u.status !== "suspended" ? (
                          <DropdownMenuItem onClick={() => { setData((rs) => rs.map((r) => r.id === u.id ? { ...r, status: "suspended" } : r)); toast.success(`${u.name} suspended`); }}>Suspend</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => { setData((rs) => rs.map((r) => r.id === u.id ? { ...r, status: "active" } : r)); toast.success(`${u.name} activated`); }}>Activate</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { setData((rs) => rs.filter((r) => r.id !== u.id)); toast.success("Sitter removed"); }}>Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination page={t.page} totalPages={t.totalPages} onChange={t.setPage} total={t.total} pageSize={t.pageSize} />
      </CardContent>
    </Card>
  );
}
