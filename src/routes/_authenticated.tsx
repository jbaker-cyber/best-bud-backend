import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/topbar";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, isReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && !user) {
      navigate({ to: "/login" });
    }
  }, [isReady, user, navigate]);

  if (!isReady || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden md:block">
        <div className="sticky top-0 h-screen">
          <AppSidebar />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
