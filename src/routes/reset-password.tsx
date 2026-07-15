import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters").regex(/[A-Z]/, "Include an uppercase letter").regex(/\d/, "Include a number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords must match", path: ["confirm"] });
type Values = z.infer<typeof schema>;

function ResetPasswordPage() {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const form = useForm<Values>({ resolver: zodResolver(schema) as never, defaultValues: { password: "", confirm: "" } });

  async function onSubmit(_v: Values) {
    await new Promise((r) => setTimeout(r, 600));
    setDone(true);
    toast.success("Password updated. You can sign in now.");
    setTimeout(() => navigate({ to: "/login" }), 1200);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-8 shadow-card">
        <Logo />
        {done ? (
          <div className="mt-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h1 className="mt-3 text-2xl font-bold">Password updated</h1>
            <p className="mt-2 text-sm text-muted-foreground">Redirecting to sign in…</p>
          </div>
        ) : (
          <>
            <h1 className="mt-8 text-2xl font-bold">Set a new password</h1>
            <p className="mt-1 text-sm text-muted-foreground">Choose a strong password you don't use anywhere else.</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input id="password" type={show ? "text" : "password"} {...form.register("password")} />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" type={show ? "text" : "password"} {...form.register("confirm")} />
                {form.formState.errors.confirm && <p className="text-xs text-destructive">{form.formState.errors.confirm.message}</p>}
              </div>
              <Button size="lg" className="w-full rounded-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
