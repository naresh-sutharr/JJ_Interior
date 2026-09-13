import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import jayJasolLogo from "@/assets/jay_jasol_logo.png";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Services", path: "/services" },
  { name: "Contact", path: "/contact" },
];

function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#eaeaea] font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Premium Glassmorphic Header */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-nav py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 grid grid-cols-[auto_1fr_auto] items-center gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 w-fit cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <img 
              src={jayJasolLogo} 
              alt="Jay Jasol Interiors & Modutech Logo" 
              className="h-14 w-auto object-contain drop-shadow-2xl bg-white/10 rounded-sm p-1" 
            />
            <span className="hidden md:block font-display text-2xl tracking-widest text-white/90">
              JAY JASOL <span className="text-[#d4af37]">INTERIORS</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-[12px] uppercase tracking-[0.2em] font-medium text-white/70 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all"
                activeProps={{ className: "text-[#d4af37] font-bold" }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex justify-end gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
            <Button 
              className="hidden md:flex h-11 rounded-none bg-transparent border border-white/20 text-white hover:bg-white hover:text-black transition-colors px-6 text-[11px] uppercase tracking-[0.18em]" 
              asChild
            >
              <Link to="/contact">Start a Project</Link>
            </Button>
            <Button 
              className="hidden lg:flex h-11 rounded-sm premium-btn px-6 text-[11px] font-bold uppercase tracking-[0.15em]" 
              asChild
            >
              <Link to="/admin/login">Admin Portal <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-white/10" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <nav className="flex lg:hidden flex-col justify-center gap-8 bg-[#0a0a0a]/98 backdrop-blur-3xl absolute top-full left-0 w-full h-[calc(100vh-80px)] px-8 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="text-left font-display text-4xl text-white hover:text-[#d4af37] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-white/10">
              <Button className="h-14 rounded-none bg-transparent border border-white/20 text-white hover:bg-white hover:text-black transition-colors uppercase tracking-[0.15em]" asChild>
                <Link to="/contact" onClick={() => setMenuOpen(false)}>Start a Project</Link>
              </Button>
              <Button className="h-14 rounded-sm premium-btn font-bold uppercase tracking-[0.15em]" asChild>
                <Link to="/admin/login" onClick={() => setMenuOpen(false)}>Admin Portal</Link>
              </Button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content (Outlet) */}
      <main className="flex-grow pt-24 lg:pt-0">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-white/5 bg-[#050505] pt-20 pb-10 mt-auto">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <img src={jayJasolLogo} alt="Jay Jasol Logo" className="h-16 w-auto mb-6 opacity-90 grayscale hover:grayscale-0 transition-all" />
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Thoughtfully designed interiors where architecture, material, and emotion come together.
            </p>
          </div>
          <div>
            <h4 className="text-white font-display text-2xl mb-6">Studio</h4>
            <address className="text-white/60 text-sm not-italic space-y-2">
              <p>Surat, Gujarat, India</p>
              <p>Mon - Sat, 10:00 AM - 7:00 PM</p>
              <p className="pt-4 hover:text-[#d4af37] transition-colors"><a href="tel:+919427054921">+91 94270 54921</a></p>
            </address>
          </div>
          <div>
            <h4 className="text-white font-display text-2xl mb-6">Explore</h4>
            <div className="flex flex-col gap-3">
              {navItems.map(item => (
                <Link key={item.name} to={item.path} className="text-white/60 text-sm hover:text-[#d4af37] transition-colors w-fit">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} JAY JASOL INTERIORS & MODUTECH</p>
          <p>Created by <span className="text-[#d4af37] font-bold">Naresh Suthar</span></p>
        </div>
      </footer>
    </div>
  );
}
