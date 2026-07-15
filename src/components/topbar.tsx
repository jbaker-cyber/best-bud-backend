import { Bell, Search, Sun, Moon, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./app-sidebar";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export function TopBar() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <AppSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search bookings, users, sitters…" className="h-10 rounded-full border-border/70 bg-card pl-10" />
      </div>

      <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-full">
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      <Button variant="ghost" size="icon" className="relative rounded-full">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full bg-card px-2 py-1.5 pr-3 hover:bg-muted">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>BC</AvatarFallback>
          </Avatar>
          <div className="hidden text-left leading-tight sm:block">
            <div className="text-sm font-semibold">{user?.name ?? "Admin"}</div>
            <div className="text-[11px] text-muted-foreground">Accounts</div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: "/support" })}>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => { signOut(); navigate({ to: "/login" }); }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
