import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { Fragment, type ReactNode } from "react";

const labels: Record<string, string> = {
  "": "Dashboard",
  bookings: "Bookings",
  users: "Users",
  sitters: "Pet Sitters",
  payments: "Payments",
  reviews: "Reviews",
  community: "Community",
  support: "Support",
  notifications: "Notifications",
  cms: "CMS",
  settings: "Settings",
};

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <nav className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to={"/" as string as "/"} className="flex items-center gap-1 hover:text-foreground">
            <Home className="h-3 w-3" /> Home
          </Link>
          {segments.map((seg, i) => {
            const to = "/" + segments.slice(0, i + 1).join("/");
            const label = labels[seg] ?? seg.replace(/-/g, " ");
            return (
              <Fragment key={to}>
                <ChevronRight className="h-3 w-3" />
                <Link to={to as string as "/"} className="capitalize hover:text-foreground">
                  {label}
                </Link>
              </Fragment>
            );
          })}
        </nav>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
