import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  UserCheck,
  CreditCard,
  Star,
  MessagesSquare,
  LifeBuoy,
  Bell,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "./logo";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/users", label: "Users", icon: Users },
  { to: "/sitters", label: "Pet Sitters", icon: UserCheck },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/community", label: "Community", icon: MessagesSquare },
  { to: "/support", label: "Support", icon: LifeBuoy },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/cms", label: "CMS", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { signOut } = useAuth();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between px-5 py-5">
        <Logo />
      </div>

      <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        General
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to as string as "/"}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary/15 text-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-3 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-xs">
        <div className="font-semibold text-foreground">Achieve your full <span className="text-primary underline decoration-primary/50 underline-offset-2">Sitter Performance</span> success</div>
        <button className="mt-3 w-full rounded-full bg-foreground py-2 text-xs font-semibold text-background">
          Upgrade Premium
        </button>
      </div>

      <button
        onClick={() => { signOut(); onNavigate?.(); }}
        className="mx-3 mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
