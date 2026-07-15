import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

const schema = z.object({ email: z.string().trim().email("Enter a valid email") });
type Values = z.infer<typeof schema>;

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function onSubmit(v: Values) {
    await new Promise((r) => setTimeout(r, 700));
    toast.success(`Reset link sent to ${v.email}`);
    setSent(true);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-8 shadow-card">
        <Logo />
        {!sent ? (
          <>
            <h1 className="mt-8 text-2xl font-bold">Forgot password?</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
                {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
              </div>
              <Button size="lg" className="w-full rounded-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send reset link
              </Button>
            </form>
          </>
        ) : (
          <div className="mt-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success/15 text-success">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Check your email</h1>
            <p className="mt-2 text-sm text-muted-foreground">We've sent a password reset link. Follow it to set a new password.</p>
            <Button variant="outline" className="mt-6 rounded-full" onClick={() => navigate({ to: "/reset-password" })}>
              Continue to reset
            </Button>
          </div>
        )}
        <Link to="/login" className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
