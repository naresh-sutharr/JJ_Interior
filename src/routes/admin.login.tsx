import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login — Tulsi Interior" },
      { name: "description", content: "Secure business management login for the Tulsi Interior studio team." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login — Tulsi Interior" },
      { property: "og:description", content: "Secure business management login for Tulsi Interior." },
    ],
  }),
  component: AdminLogin,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  fullName: z.string().trim().max(80).optional(),
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin/dashboard", replace: true });
    });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse({ email, password, fullName });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid details");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
        });
        if (error) throw error;
      }
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.success("Account created. Please sign in.");
        setMode("signin");
        return;
      }
      toast.success("Welcome back");
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="relative hidden bg-hero text-hero-foreground md:flex md:flex-col md:justify-between md:p-14">
        <p className="display-serif text-3xl">TULSI INTERIOR</p>
        <div>
          <h1 className="display-serif text-6xl leading-[.95]">Business<br />Management</h1>
          <p className="mt-6 max-w-sm text-sm font-light leading-7 text-hero-foreground/70">
            Clients, projects, quotations, GST invoices, payments, expenses and profitability — in one private studio workspace.
          </p>
        </div>
        <Link to="/" className="text-[10px] uppercase tracking-[.2em] text-hero-foreground/60 hover:text-hero-foreground">
          Back to website
        </Link>
      </section>

      <section className="flex items-center justify-center px-6 py-20">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[.25em] text-muted-foreground">Tulsi Interior</p>
            <h2 className="mt-3 display-serif text-4xl">{mode === "signin" ? "Admin Sign In" : "Create Admin"}</h2>
          </div>
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Gopalram" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
            />
          </div>
          <Button type="submit" className="w-full rounded-none" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full cursor-pointer text-center text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
