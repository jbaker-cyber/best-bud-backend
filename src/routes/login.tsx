import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

function LoginPage() {
  const [show, setShow] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: { email: "bessie@furrysitterz.com", password: "demo1234", remember: true },
  });

  async function onSubmit(values: FormValues) {
    try {
      await signIn(values.email, values.password, values.remember);
      toast.success("Welcome back!");
      navigate({ to: "/" });
    } catch {
      toast.error("Unable to sign in. Try again.");
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Logo />
          <h1 className="mt-10 text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage bookings, sitters, and everything happening on Furry Sitterz.
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input id="password" type={show ? "text" : "password"} placeholder="••••••••" {...form.register("password")} />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={form.watch("remember")}
                onCheckedChange={(v) => form.setValue("remember", Boolean(v))}
              />
              Remember me on this device
            </label>

            <Button type="submit" size="lg" className="w-full rounded-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo credentials pre-filled. Any email + password (6+ chars) will work.
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_20%_20%,rgba(232,153,130,0.35),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(120,200,150,0.25),transparent_45%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary">Admin Console</div>
          <div>
            <div className="text-4xl font-bold leading-tight">Run the best pet-care platform in your city.</div>
            <p className="mt-4 max-w-md text-muted-foreground">
              Monitor bookings, verify sitters, review payments, and moderate community activity — all from one warm, delightful workspace.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              {[
                { k: "12,840", v: "Bookings" },
                { k: "2,318", v: "Sitters" },
                { k: "4.9★", v: "Avg rating" },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur">
                  <div className="text-xl font-bold">{s.k}</div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
