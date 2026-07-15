import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import {
  Users, PawPrint, CalendarCheck, TrendingUp, Star, DollarSign,
  ArrowUpRight, ArrowDownRight, Download, Plus,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  dashboardStats, revenueSeries, servicePopularity, bookingStatusBreakdown,
  userGrowth, topSitters, recentBookings, recentReviews, recentRegistrations,
} from "@/lib/mock-data";
import { formatCurrency, relativeTime } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — Furry Sitterz Admin" }] }),
});

const chartColors = ["var(--color-primary)", "var(--color-success)", "var(--color-info)", "var(--color-warning)", "var(--color-chart-5)", "var(--color-chart-2)"];

function DashboardPage() {
  const stats = dashboardStats();
  const revenue = revenueSeries();
  const services = servicePopularity();
  const status = bookingStatusBreakdown();
  const growth = userGrowth();
  const sitters = topSitters(5);
  const bookings = recentBookings(6);
  const reviews = recentReviews(4);
  const regs = recentRegistrations(5);

  const kpis = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), delta: "+8.4%", trend: "up", icon: Users, tint: "bg-primary/15 text-primary" },
    { label: "Pet Owners", value: stats.totalOwners.toLocaleString(), delta: "+5.2%", trend: "up", icon: Users, tint: "bg-info/15 text-info" },
    { label: "Pet Sitters", value: stats.totalSitters.toLocaleString(), delta: "+3.7%", trend: "up", icon: PawPrint, tint: "bg-success/15 text-success" },
    { label: "Active Users", value: stats.activeUsers.toLocaleString(), delta: "+1.9%", trend: "up", icon: TrendingUp, tint: "bg-warning/20 text-warning-foreground" },
    { label: "Total Bookings", value: stats.totalBookings.toLocaleString(), delta: "+12.1%", trend: "up", icon: CalendarCheck, tint: "bg-primary/15 text-primary" },
    { label: "Today's Bookings", value: stats.todaysBookings.toLocaleString(), delta: "+2", trend: "up", icon: CalendarCheck, tint: "bg-info/15 text-info" },
    { label: "Monthly Revenue", value: formatCurrency(stats.monthlyRevenue), delta: "+9.6%", trend: "up", icon: DollarSign, tint: "bg-success/15 text-success" },
    { label: "Avg Rating", value: `${stats.avgRating}★`, delta: "+0.12", trend: "up", icon: Star, tint: "bg-warning/20 text-warning-foreground" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Track platform performance across bookings, revenue, and community activity."
        actions={
          <>
            <Button variant="outline" className="rounded-full" onClick={() => toast.success("Export prepared")}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button className="rounded-full" onClick={() => toast("New report started")}>
              <Plus className="mr-2 h-4 w-4" /> New Report
            </Button>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="rounded-2xl border-border/60 shadow-soft">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${k.tint}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${k.trend === "up" ? "text-success" : "text-destructive"}`}>
                    {k.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {k.delta}
                  </span>
                </div>
                <div className="mt-4 text-2xl font-bold tracking-tight">{k.value}</div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-soft lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Revenue & Bookings</CardTitle>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </div>
            <Badge variant="secondary" className="rounded-full">YTD +23%</Badge>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={revenue}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="bookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#revenue)" />
                  <Area type="monotone" dataKey="bookings" stroke="var(--color-success)" strokeWidth={2} fill="url(#bookings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Booking Status</CardTitle>
            <p className="text-xs text-muted-foreground">Distribution across all bookings</p>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={status} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={3}>
                    {status.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {status.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: chartColors[i % chartColors.length] }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="ml-auto font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">User Growth</CardTitle>
            <p className="text-xs text-muted-foreground">Owners vs. Sitters, cumulative</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={growth}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="owners" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="sitters" stroke="var(--color-info)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Service Popularity</CardTitle>
            <p className="text-xs text-muted-foreground">Bookings per service</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={services} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-soft lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">View all</Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/60">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 py-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                    <PawPrint className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{b.service} · {b.ownerName}</div>
                    <div className="truncate text-xs text-muted-foreground">Sitter: {b.sitterName} · {b.petNames.join(", ")}</div>
                  </div>
                  <div className="hidden text-right text-xs text-muted-foreground sm:block">{relativeTime(b.date)}</div>
                  <StatusPill value={b.status} />
                  <div className="hidden w-20 text-right text-sm font-semibold md:block">{formatCurrency(b.amount)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Top Sitters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sitters.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-4 text-center text-sm font-bold text-muted-foreground">{i + 1}</div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={s.avatar} />
                  <AvatarFallback>{s.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.completedJobs} jobs · {s.rating}★</div>
                </div>
                <Badge variant="secondary" className="rounded-full">{s.city}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/60 shadow-soft">
          <CardHeader><CardTitle className="text-base">Recent Registrations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {regs.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9"><AvatarImage src={r.avatar} /><AvatarFallback>{r.name[0]}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{r.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{r.email}</div>
                </div>
                <Badge variant={r.role === "sitter" ? "default" : "secondary"} className="rounded-full capitalize">{r.role}</Badge>
                <div className="text-xs text-muted-foreground">{relativeTime(r.joinDate)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-soft">
          <CardHeader><CardTitle className="text-base">Recent Reviews</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-border/60 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{r.reviewer} → {r.receiver}</div>
                  <div className="flex items-center gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-current" : "opacity-30"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.comment}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{r.service}</span>
                  <span>{relativeTime(r.date)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
