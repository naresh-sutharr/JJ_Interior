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
      { title: "Admin Login — J.J. INTERIORS & MODUTECH" },
      { name: "description", content: "Secure business management login for the J.J. INTERIORS & MODUTECH studio team." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login — J.J. INTERIORS & MODUTECH" },
      { property: "og:description", content: "Secure business management login for J.J. INTERIORS & MODUTECH." },
    ],
  }),
  component: AdminLogin,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  fullName: z.string().trim().max(80).optional(),
});

function AdminLogin() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin/dashboard", replace: true });
    });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const cleanEmail = email.trim().toLowerCase();
    
    if (cleanEmail !== "naresh@gmail.com") {
       toast.error("Unauthorized admin ID.");
       return;
    }

    setBusy(true);
    try {
      // User explicitly requested to handle login "in code" for this specific ID/pass
      if (cleanEmail === "naresh@gmail.com" && password === "admin123") {
         // Set a local bypass flag so the admin layout knows we are authenticated via code
         localStorage.setItem("admin_bypass", "true");
         
         // Still try to sign in via Supabase in the background so RLS works if they have an account
         supabase.auth.signInWithPassword({ email: cleanEmail, password }).catch(() => {
           // Ignore Supabase auth errors (like unconfirmed email) since we are bypassing
         });
         
         toast.success("Welcome back, Admin!");
         navigate({ to: "/admin/dashboard", replace: true });
         return;
      } else {
         toast.error("Invalid password.");
      }
    } catch (error) {
      toast.error((error as Error).message, { duration: 5000 });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="relative hidden bg-hero text-hero-foreground md:flex md:flex-col md:justify-between md:p-14">
        <p className="display-serif text-3xl">J.J. INTERIORS & MODUTECH</p>
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
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[.25em] text-muted-foreground">J.J. INTERIORS & MODUTECH</p>
            <h2 className="mt-3 display-serif text-4xl">Admin Portal</h2>
            <p className="mt-2 text-sm text-muted-foreground">Authorized Access Only</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin ID (Email)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={busy} className="w-full rounded-none h-12 mt-6 text-[12px] tracking-widest uppercase font-bold">
            {busy ? "Authenticating..." : "Sign In"}
          </Button>
          
        </form>
      </section>
    </main>
  );
}
