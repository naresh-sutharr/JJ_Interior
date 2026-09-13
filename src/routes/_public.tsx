import { Outlet, createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Instagram, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

// Contact Info
const WHATSAPP_NUMBER = "+919898412998";
const WHATSAPP_LINK = `https://wa.me/919898412998?text=${encodeURIComponent("Hello JAY JASOL INTERIORS & MODUTECH, I would like to inquire about your services...")}`;
const PHONE_NUMBER = "+91 9898412998";
const EMAIL_ADDRESS = "mukesh.jj.interiors@gmail.com";
const INSTAGRAM_HANDLE = "mukesh_p_suthar_89";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" }
];

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Global reveal animation observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.12 });
    
    // Initial observe
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    
    // Re-observe when navigation happens
    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => observer.observe(element));
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => { 
      window.removeEventListener("scroll", onScroll); 
      observer.disconnect(); 
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-border bg-background/95 text-foreground backdrop-blur shadow-sm" : "text-hero-foreground"}`}>
        <div className="section-shell grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center md:h-24 md:grid-cols-[1fr_auto_1fr]">
          <Link to="/" className="flex items-center gap-1.5 md:gap-3 w-fit text-left display-serif tracking-normal" aria-label="JAY JASOL INTERIORS & MODUTECH home">
            <img src="/mukeshlogo.jpg" alt="JAY JASOL INTERIORS Logo" className="h-9 md:h-12 w-auto object-contain rounded bg-white" />
            <span className="text-[11px] md:text-xl font-bold leading-tight">JAY JASOL INTERIORS & MODUTECH</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                to={item.href} 
                className="text-[11px] uppercase tracking-[.2em] transition-opacity hover:opacity-55 [&.active]:opacity-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex justify-end items-center gap-2 md:gap-3">
            <Button className="h-8 md:h-10 rounded-full bg-gradient-to-r from-amber-600 to-amber-900 text-white shadow-lg shadow-amber-900/40 border-0 px-3 md:px-6 text-[9px] md:text-[10px] font-bold uppercase tracking-wide md:tracking-[.18em] hover:scale-105 transition-all duration-300 inline-flex" asChild>
              <Link to="/admin/login">Admin ✨</Link>
            </Button>
            <Button variant={scrolled ? "outline" : "inverse"} className="hidden h-10 rounded-none px-5 text-[10px] uppercase tracking-[.18em] md:inline-flex" asChild>
              <Link to="/contact">Start a Project</Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <nav className="flex min-h-[calc(100vh-5rem)] flex-col justify-center gap-7 bg-background px-8 text-foreground md:hidden">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                to={item.href} 
                onClick={() => setMenuOpen(false)}
                className="text-left display-serif text-4xl [&.active]:text-champagne"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-hero px-4 pb-10 text-hero-foreground">
        <div className="section-shell border-t border-hero-foreground/20 pt-12">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <p className="display-serif text-3xl">JAY JASOL INTERIORS & MODUTECH</p>
              <p className="mt-3 text-[10px] uppercase tracking-[.2em] text-hero-foreground/45">Premium Interior Design Studio</p>
              <p className="mt-4 text-xs font-light leading-6 text-hero-foreground/70">
                Premium interior design, modular kitchens, and residential interiors in Surat, Gujarat.
              </p>
            </div>
            <div className="space-y-3 text-xs flex flex-col">
              <span className="font-semibold text-champagne mb-1">Company</span>
              {navItems.map((item) => (
                <Link key={item.label} to={item.href} className="w-fit hover:opacity-55 [&.active]:opacity-50">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="space-y-3 text-xs flex flex-col">
              <span className="font-semibold text-champagne mb-1">Services</span>
              <Link to="/interior-design" className="w-fit hover:opacity-55">Interior Design</Link>
              <Link to="/modular-kitchen" className="w-fit hover:opacity-55">Modular Kitchens</Link>
              <Link to="/wardrobe-design" className="w-fit hover:opacity-55">Wardrobe Design</Link>
              <Link to="/residential-interiors" className="w-fit hover:opacity-55">Residential Interiors</Link>
              <Link to="/commercial-interiors" className="w-fit hover:opacity-55">Commercial Interiors</Link>
            </div>
            <div className="space-y-3 text-xs">
              <span className="font-semibold text-champagne mb-1 block">Contact</span>
              <a className="hover:opacity-55 flex gap-2 items-center w-fit" href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noreferrer"><Instagram className="h-4 w-4" /> Instagram: @{INSTAGRAM_HANDLE}</a>
              <a className="hover:opacity-55 flex gap-2 items-center w-fit" href={WHATSAPP_LINK} target="_blank" rel="noreferrer"><Phone className="h-4 w-4" /> WhatsApp: {PHONE_NUMBER}</a>
              <a className="hover:opacity-55 flex gap-2 items-center w-fit" href={`mailto:${EMAIL_ADDRESS}`}><Mail className="h-4 w-4" /> Email: {EMAIL_ADDRESS}</a>
              
              <div className="mt-6 text-xs leading-6 text-hero-foreground/65">
                Surat, Gujarat, India<br /><br />
                <Link to="/admin/login" className="hover:text-champagne transition-colors font-semibold">Admin Portal →</Link>
              </div>
            </div>
          </div>
          <div className="mt-16 flex flex-col gap-3 border-t border-hero-foreground/20 pt-6 text-[9px] uppercase tracking-[.18em] text-hero-foreground/40 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} JAY JASOL INTERIORS & MODUTECH. Premium Interior Design & Modular Solutions in Surat, Gujarat.</p>
            <p>Spaces | Designed | For A Better Tomorrow</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={WHATSAPP_LINK} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/50"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </div>
  );
}
