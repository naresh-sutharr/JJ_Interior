import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

function AdminLogin() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const email = "naresh@gmail.com";
  const password = "admin123";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin/dashboard", replace: true });
    });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      let { error } = await supabase.auth.signInWithPassword({ email, password });
      
      // If sign in fails, it might mean the account hasn't been created yet. Auto-create it!
      if (error && error.message.includes("Invalid login credentials")) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: "Naresh Suthar" } },
        });
        
        if (signUpError) throw signUpError;
        
        // After signup, we need to sign in again or wait for confirmation depending on Supabase settings.
        const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
        if (retryError) throw retryError;
      } else if (error) {
        throw error;
      }
      
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.success("Account created. Please check your email if confirmation is required.");
        return;
      }
      
      toast.success("Welcome to Admin Dashboard");
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
        <form onSubmit={submit} className="w-full max-w-sm space-y-6 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-[.25em] text-muted-foreground">J.J. INTERIORS & MODUTECH</p>
            <h2 className="mt-3 display-serif text-4xl">Admin Portal</h2>
            <p className="mt-2 text-sm text-muted-foreground">Authorized access only.</p>
          </div>
          
          <div className="pt-8">
            <Button type="submit" disabled={busy} className="w-full rounded-none h-14 text-sm tracking-widest uppercase">
              {busy ? "Authenticating..." : "Login to Dashboard"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
