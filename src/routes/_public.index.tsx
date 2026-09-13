import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-residence.jpg";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "JAY JASOL INTERIORS & MODUTECH — Luxury Interior Design" },
      { name: "description", content: "JAY JASOL INTERIORS & MODUTECH creates timeless luxury interiors shaped by architecture, material, and emotion." },
    ],
  }),
  component: Index,
});

function Index() {
  const scrollToWork = () => {
    document.getElementById("explore-work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#050505] text-[#eaeaea]">
      {/* Background Image with Overlay */}
      <img 
        src={heroImage} 
        alt="Double-height luxury residence with travertine walls and walnut detailing" 
        fetchPriority="high" 
        className="absolute inset-0 h-full w-full object-cover opacity-40 scale-105 animate-[pulse_20s_ease-in-out_infinite]" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
      
      {/* Hero Content */}
      <div className="relative container mx-auto px-6 flex min-h-[100svh] flex-col justify-center pb-24 pt-32">
        <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-white/70 animate-fade-in-up">
          Interior Architecture · Surat & Worldwide
        </p>
        
        <h1 className="max-w-6xl font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] text-white animate-fade-in-up delay-100">
          CRAFTING SPACES<br />
          <span className="premium-gradient-text">THAT DEFINE</span><br />
          LUXURY
        </h1>
        
        <div className="mt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-10 border-t border-white/10 pt-10 animate-fade-in-up delay-200">
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            Thoughtfully designed interiors where architecture, material and emotion come together.
          </p>
          
          <button 
            onClick={scrollToWork}
            className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-[#d4af37] transition-colors"
          >
            Explore Our Work
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </button>
        </div>
      </div>
      
      {/* Placeholder for the rest of the content so scrolling works */}
      <section id="explore-work" className="min-h-screen bg-[#0a0a0a] relative z-10 py-32">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-5xl text-white mb-8">Selected Works</h2>
          <p className="text-white/60 mb-12 max-w-lg mx-auto">Explore our portfolio of luxury residential and commercial interior projects.</p>
          <Link 
            to="/projects" 
            className="inline-block border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all px-8 py-4 text-xs font-bold uppercase tracking-widest"
          >
            View All Projects
          </Link>
        </div>
      </section>
    </div>
  );
}
