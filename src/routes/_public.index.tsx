import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Star } from "lucide-react";
import heroImage from "@/assets/hero-residence.jpg";
import residenceImage from "@/assets/project-residence.jpg";
import villaImage from "@/assets/project-villa.jpg";
import officeImage from "@/assets/project-office.jpg";
import bespokeImage from "@/assets/project-bespoke.jpg";
import { useRows } from "@/hooks/use-admin";

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

  const { data: dynamicProjects = [] } = useRows("projects");
  
  // Mix dynamic projects from the admin panel with defaults if less than 4 exist
  const projects = dynamicProjects.length > 0 ? dynamicProjects.map(p => ({
    name: p.name,
    location: p.location || "Surat, Gujarat",
    type: p.project_type || "Interior Project",
    image: p.cover_image_url || residenceImage
  })) : [
    { name: "The Aster Residence", location: "Surat, Gujarat", type: "Luxury Residence", image: residenceImage },
    { name: "Villa Sereno", location: "Mumbai", type: "Modern Villa", image: villaImage },
    { name: "One Meridian", location: "Ahmedabad", type: "Contemporary Office", image: officeImage },
    { name: "Maison Privée", location: "Surat, Gujarat", type: "Bespoke Interior", image: bespokeImage },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-[#eaeaea]">
      {/* Background Image with Overlay */}
      <img 
        src={heroImage} 
        alt="Double-height luxury residence with travertine walls and walnut detailing" 
        fetchPriority="high" 
        className="absolute inset-0 h-full w-full object-cover opacity-40 scale-105 animate-in zoom-in-105 duration-1000" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#0a0a0a]/30" />
      
      {/* Hero Content */}
      <div className="relative container mx-auto px-6 flex min-h-screen flex-col justify-center pb-24 pt-32">
        <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-white/70 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
          Interior Architecture · Surat & Worldwide
        </p>
        
        <h1 className="max-w-6xl font-display text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
          CRAFTING SPACES<br />
          <span className="premium-gradient-text">THAT DEFINE</span><br />
          LUXURY
        </h1>
        
        <div className="mt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-10 border-t border-white/10 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            Thoughtfully designed interiors where architecture, material and emotion come together. We transform ordinary spaces into extraordinary experiences.
          </p>
          
          <button 
            onClick={scrollToWork}
            className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#d4af37] hover:text-white transition-colors cursor-pointer"
          >
            Explore Our Work
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </button>
        </div>
      </div>
      
      {/* About Section Preview */}
      <section className="bg-[#050505] relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#d4af37] text-[11px] uppercase tracking-[0.3em] mb-4">Our Philosophy</p>
              <h2 className="font-display text-4xl md:text-5xl text-white leading-tight mb-8">
                Designing with intention, building with precision.
              </h2>
              <p className="text-white/60 leading-relaxed mb-10">
                At JAY JASOL INTERIORS & MODUTECH, led by Mukesh bhai Suthar, we believe that luxury is not just about what you see, but how a space makes you feel. From conceptual architecture to bespoke modular furniture, every detail is meticulously crafted.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-sm text-white hover:text-[#d4af37] transition-colors uppercase tracking-widest border-b border-white/20 pb-1 hover:border-[#d4af37]">
                Learn More About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="aspect-[4/5] bg-white/5 rounded-sm overflow-hidden">
                 <img src={residenceImage} className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700" alt="Interior Details" />
               </div>
               <div className="aspect-[4/5] bg-white/5 rounded-sm overflow-hidden mt-12">
                 <img src={bespokeImage} className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700" alt="Interior Details" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Works Section */}
      <section id="explore-work" className="bg-[#0a0a0a] relative z-10 py-32 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-[#d4af37] text-[11px] uppercase tracking-[0.3em] mb-4">Portfolio</p>
              <h2 className="font-display text-4xl md:text-6xl text-white">Selected Works</h2>
            </div>
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 text-sm text-white hover:text-[#d4af37] transition-colors uppercase tracking-widest border-b border-white/20 pb-1 hover:border-[#d4af37]"
            >
              View All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((project, i) => (
              <div key={i} className={`group cursor-pointer ${i % 2 !== 0 ? 'md:mt-24' : ''}`}>
                <div className="relative overflow-hidden bg-white/5 aspect-[4/3] mb-6">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-display text-white mb-2 group-hover:text-[#d4af37] transition-colors">{project.name}</h3>
                <p className="text-white/50 text-sm">{project.type} &mdash; {project.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#050505] relative z-10 py-32 border-t border-white/5 text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <Star className="h-8 w-8 text-[#d4af37] mx-auto mb-8 opacity-50" />
          <h2 className="font-display text-4xl md:text-6xl text-white mb-8">Ready to transform your space?</h2>
          <p className="text-white/60 mb-12 leading-relaxed">
            Contact JAY JASOL INTERIORS & MODUTECH today to schedule a consultation with Mukesh bhai Suthar and begin your design journey.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-[#d4af37] text-black hover:bg-white transition-colors px-10 py-4 text-xs font-bold uppercase tracking-widest"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  );
}
