const fs = require('fs');
const file = 'src/routes/_public.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix the Navbar Logo and Mobile Header
content = content.replace(
  /<header[\s\S]*?{menuOpen && \(/,
  `<header
        className={\`fixed inset-x-0 top-0 z-50 transition-all duration-500 \${
          scrolled ? "glass-nav py-3" : "bg-transparent py-4 md:py-5"
        }\`}
      >
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 w-fit cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <img 
              src={jayJasolLogo} 
              alt="Jay Jasol Interiors & Modutech Logo" 
              className="h-10 md:h-14 w-auto object-contain drop-shadow-2xl bg-white/10 rounded-sm p-0.5" 
            />
            <span className="font-display text-lg md:text-2xl tracking-widest text-white/90 whitespace-nowrap">
              JAY JASOL <span className="text-[#d4af37] hidden sm:inline">INTERIORS</span>
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
          <div className="flex items-center justify-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
            <Button 
              className="hidden lg:flex h-11 rounded-none bg-transparent border border-white/20 text-white hover:bg-white hover:text-black transition-colors px-6 text-[11px] uppercase tracking-[0.18em]" 
              asChild
            >
              <Link to="/contact">Start a Project</Link>
            </Button>
            
            {/* Admin Portal Button - VISIBLE ON MOBILE NOW */}
            <Button 
              className="flex h-9 md:h-11 rounded-sm premium-btn px-4 md:px-6 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em]" 
              asChild
            >
              <Link to="/admin/login">Admin <ArrowRight className="ml-1.5 md:ml-2 h-3.5 w-3.5 hidden sm:block" /></Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-white/10 h-9 w-9" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {menuOpen && (`
);

fs.writeFileSync(file, content);
console.log("Updated _public.tsx header");
