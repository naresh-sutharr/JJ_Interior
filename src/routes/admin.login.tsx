import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login — J.J. INTERIORS & MODUTECH" },
      { name: "description", content: "Secure business management login for the J.J. INTERIORS & MODUTECH studio team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  
  // Fixed credentials
  const email = "naresh@gmail.com";
  const password = "admin123";
  const fullName = "Naresh Suthar";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin/dashboard", replace: true });
    });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
        });
        if (error) throw error;
      }
      
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.success("Admin Account Created! Please Sign In now.");
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
          <div>
            <p className="text-[10px] uppercase tracking-[.25em] text-muted-foreground">J.J. INTERIORS & MODUTECH</p>
            <h2 className="mt-3 display-serif text-4xl">{mode === "signin" ? "Admin Sign In" : "Create Admin"}</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                readOnly 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="text" 
                value={password} 
                readOnly 
                className="bg-muted text-muted-foreground"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <Button type="submit" disabled={busy} className="w-full h-11 text-[11px] tracking-widest uppercase rounded-sm">
              {busy ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {mode === "signin" 
                ? "First time? Click here to Create Admin Account" 
                : "Already created? Click here to Sign In"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
