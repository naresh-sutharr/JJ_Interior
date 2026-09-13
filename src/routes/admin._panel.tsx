import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Receipt,
  FileText,
  Settings,
  LogOut,
  Moon,
  Sun,
  Bell,
  UserCircle,
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBusinessProfile } from "@/hooks/use-admin";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export const Route = createFileRoute("/admin/_panel")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
    return { user: data.user };
  },
  component: AdminPanel,
});

const BOTTOM_NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/billing", label: "Billing", icon: Receipt },
] as const;

const MORE_NAV = [
  { to: "/admin/invoices", label: "Invoices", icon: FileText },
  { to: "/admin/catalog", label: "Catalog", icon: FileText },
  { to: "/admin/settings", label: "Profile", icon: Settings },
] as const;

function AdminPanel() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [dark, setDark] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  
  const { data: operatorData } = useBusinessProfile();
  const operatorSettings = operatorData || {
    name: 'Mukesh bhai Suthar',
    role: 'Authorized Operator',
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  const desktopSidebar = (
    <div className="flex h-full flex-col bg-[#fdfaf6] dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-[var(--brand-accent)]/5 to-transparent">
        <div className="flex items-center space-x-2">
          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
            <img src="/logo.jpeg" alt="Logo" className="h-12 w-12 object-contain rounded-lg shadow-sm" />
          </div>
          <div className="pr-2">
            <h2 
              className="text-2xl text-slate-800 dark:text-slate-100 tracking-wide leading-none mt-1 font-bold"
              style={{ 
                fontFamily: "'Dancing Script', cursive",
                textShadow: '0.4px 0px 0px currentColor'
              }}
            >
              J.J. INTERIORS & MODUTECH
            </h2>
            <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-500 dark:text-slate-400 block mt-1">
              Furniture Makers
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin">
        {[...BOTTOM_NAV, ...MORE_NAV].map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "w-full flex items-center space-x-3 px-4 min-h-[44px] rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
                active
                  ? "bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-500 shadow-sm border border-slate-200 dark:border-slate-800 scale-[1.02]"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-900/50"
              )}
            >
              <item.icon className={cn("h-5 w-5", active ? "text-amber-900 dark:text-amber-500" : "text-slate-400 dark:text-slate-500")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Theme mode</span>
          <button
            onClick={() => setDark(!dark)}
            className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-slate-500" />}
          </button>
        </div>

        <div className="rounded-xl p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Operator Signature
              </div>
              <div className="text-sm font-extrabold text-slate-700 dark:text-slate-300 mt-1 font-display truncate">
                {operatorSettings.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {operatorSettings.role}
              </div>
            </div>
            <button onClick={signOut} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors" title="Logout" aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 md:grid md:grid-cols-[17rem_1fr] flex flex-col">
      <aside className="sticky top-0 hidden h-screen md:block">{desktopSidebar}</aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 md:hidden shadow-sm">
        <div className="flex items-center space-x-3">
          <img src="/logo.jpeg" alt="Logo" className="h-9 w-9 object-contain rounded" />
          <h1 className="text-lg font-bold font-serif text-slate-800 dark:text-slate-100 truncate" style={{ fontFamily: "'Dancing Script', cursive" }}>
            J.J. INTERIORS
          </h1>
        </div>
        <div className="flex items-center space-x-1">
          <button className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Bell className="h-5 w-5" />
          </button>
          <button className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 dark:text-slate-400">
            <UserCircle className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 min-w-0 pb-[80px] md:pb-0 px-4 py-6 md:px-8 lg:py-10 md:max-h-screen overflow-y-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[70px] pb-safe items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] md:hidden">
        {BOTTOM_NAV.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full min-h-[44px]",
                active ? "text-amber-600 dark:text-amber-500" : "text-slate-500 dark:text-slate-400"
              )}
            >
              <item.icon className={cn("h-6 w-6 mb-1", active && "fill-amber-100/50")} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
        
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center w-full h-full min-h-[44px] text-slate-500 dark:text-slate-400">
              <MoreHorizontal className="h-6 w-6 mb-1" />
              <span className="text-[10px] font-semibold">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto pb-safe">
            <SheetHeader className="pb-4 border-b text-left">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">More navigation options</SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-2">
              {MORE_NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center justify-between w-full min-h-[56px] px-4 rounded-2xl bg-slate-50 dark:bg-slate-900 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-white dark:bg-slate-950 p-2 rounded-xl shadow-sm">
                      <item.icon className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300" />
                </Link>
              ))}
              
              <div className="mt-6 pt-4 border-t">
                <button 
                  onClick={() => {
                    setDark(!dark);
                    setMoreOpen(false);
                  }}
                  className="flex items-center justify-between w-full min-h-[56px] px-4 rounded-2xl active:bg-slate-100 dark:active:bg-slate-800"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2">
                      {dark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-500" />}
                    </div>
                    <span className="font-semibold">Dark Mode</span>
                  </div>
                </button>
                <button 
                  onClick={() => {
                    setMoreOpen(false);
                    signOut();
                  }}
                  className="flex items-center justify-between w-full min-h-[56px] px-4 rounded-2xl text-red-500 active:bg-red-50 dark:active:bg-red-950/30 mt-1"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">Logout</span>
                  </div>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
