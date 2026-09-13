import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Menu, X, Instagram, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-residence.jpg";
import residenceImage from "@/assets/project-residence.jpg";
import villaImage from "@/assets/project-villa.jpg";
import officeImage from "@/assets/project-office.jpg";
import bespokeImage from "@/assets/project-bespoke.jpg";
import portraitImage from "@/assets/studio-portrait.jpg";
import materialImage from "@/assets/material-study.jpg";

import mukeshPhoto from "@/assets/mukesh_photo1.jpg";
import { useRows } from "@/hooks/use-admin";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "J.J. INTERIORS & MODUTECH — Luxury Interior Design" },
      { name: "description", content: "J.J. INTERIORS & MODUTECH creates timeless luxury interiors shaped by architecture, material, and emotion." },
      { property: "og:title", content: "J.J. INTERIORS & MODUTECH — Luxury Interior Design" },
      { property: "og:description", content: "Timeless residential and commercial interiors, designed with purpose and crafted in detail." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const navItems = ["Home", "About", "Projects", "Services", "Contact"];
const services = ["Interior Design", "Residential Interiors", "Luxury Villas", "Commercial Interiors", "Turnkey Projects", "Custom Furniture"];
const serviceImages = [residenceImage, villaImage, bespokeImage, officeImage, heroImage, materialImage];

// Contact Info
const WHATSAPP_NUMBER = "+919898412998";
const WHATSAPP_LINK = `https://wa.me/919898412998?text=${encodeURIComponent("Hello J.J. Interiors & Modutech, I would like to inquire about your services...")}`;
const PHONE_NUMBER = "+91 9898412998";
const EMAIL_ADDRESS = "mukesh.jj.interiors@gmail.com";
const INSTAGRAM_HANDLE = "mukesh_p_suthar_89";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

function usePageEffects() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);
  return scrolled;
}

function Index() {
  const scrolled = usePageEffects();
  
  // Fetch projects from DB
  const { data: dbProjects } = useRows<any>("projects", { select: "*", order: "created_at" });

  // Map DB projects or use defaults if empty
  const activeProjects = (dbProjects && dbProjects.length > 0) 
    ? dbProjects.slice(0, 4).map((p, i) => ({
        name: p.name,
        location: p.location || "India",
        year: p.year || p.start_date?.substring(0,4) || new Date().getFullYear().toString(),
        type: p.project_type || "Interior Design",
        image: i % 2 === 0 ? residenceImage : villaImage, // Fallback images until image upload is added
        vertical: i % 2 === 0
      }))
    : [
        { name: "The Aster Residence", location: "Mumbai", year: "2026", type: "Luxury Residence", image: residenceImage, vertical: true },
        { name: "Villa Sereno", location: "Goa", year: "2025", type: "Modern Villa", image: villaImage, vertical: false },
        { name: "One Meridian", location: "New York", year: "2026", type: "Contemporary Office", image: officeImage, vertical: false },
        { name: "Maison Privée", location: "London", year: "2025", type: "Bespoke Interior", image: bespokeImage, vertical: true },
      ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceIndex, setServiceIndex] = useState(0);
  const scrollTo = (id: string) => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <main>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-border bg-background/95 text-foreground backdrop-blur" : "text-hero-foreground"}`}>
        <div className="section-shell grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center md:h-24 md:grid-cols-[1fr_auto_1fr]">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-1.5 md:gap-3 w-fit cursor-pointer text-left display-serif tracking-normal" aria-label="J.J. INTERIORS & MODUTECH home">
            <img src="/mukeshlogo.jpg" alt="J.J. Interiors Logo" className="h-9 md:h-12 w-auto object-contain rounded bg-white" />
            <span className="text-[11px] md:text-xl font-bold leading-tight">J.J. INTERIORS & MODUTECH</span>
          </button>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navItems.map((item) => <button key={item} onClick={() => scrollTo(item)} className="cursor-pointer text-[11px] uppercase tracking-[.2em] transition-opacity hover:opacity-55">{item}</button>)}
          </nav>
          <div className="flex justify-end items-center gap-2 md:gap-3">
            <Button className="h-8 md:h-10 rounded-full bg-gradient-to-r from-amber-600 to-amber-900 text-white shadow-lg shadow-amber-900/40 border-0 px-3 md:px-6 text-[9px] md:text-[10px] font-bold uppercase tracking-wide md:tracking-[.18em] hover:scale-105 transition-all duration-300 inline-flex" asChild>
              <a href="/admin/login">Admin ✨</a>
            </Button>
            <Button variant={scrolled ? "outline" : "inverse"} className="hidden h-10 rounded-none px-5 text-[10px] uppercase tracking-[.18em] md:inline-flex" onClick={() => scrollTo("contact")}>Start a Project</Button>
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
          </div>
        </div>
        {menuOpen && <nav className="flex min-h-[calc(100vh-5rem)] flex-col justify-center gap-7 bg-background px-8 text-foreground md:hidden">{navItems.map((item) => <button key={item} onClick={() => scrollTo(item)} className="cursor-pointer text-left display-serif text-4xl">{item}</button>)}</nav>}
      </header>

      <section id="home" className="relative min-h-[100svh] overflow-hidden bg-hero text-hero-foreground">
        <img src={heroImage} alt="Double-height luxury residence with travertine walls and walnut detailing" width={1920} height={1088} fetchPriority="high" className="hero-image absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero/45" />
        <div className="section-shell relative flex min-h-[100svh] flex-col justify-end pb-14 pt-32 md:pb-16">
          <p className="hero-copy mb-7 text-[10px] uppercase tracking-[.3em] text-hero-foreground/75">Interior Architecture · Surat & Worldwide</p>
          <h1 className="hero-title max-w-5xl display-serif text-[clamp(3rem,8vw,7.6rem)] leading-[.88]">CRAFTING SPACES<br />THAT DEFINE LUXURY</h1>
          <div className="hero-copy mt-9 flex flex-col items-start justify-between gap-8 border-t border-hero-foreground/35 pt-6 md:flex-row md:items-end">
            <p className="max-w-md text-sm font-light leading-7 text-hero-foreground/80 md:text-base">Thoughtfully designed interiors where architecture, material and emotion come together.</p>
            <button onClick={() => scrollTo("projects")} className="group flex cursor-pointer items-center gap-3 text-[11px] uppercase tracking-[.22em]">Explore Our Work <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" /></button>
          </div>
        </div>
      </section>

      <section id="about" className="section-shell py-28 md:py-44">
        <div className="grid gap-16 md:grid-cols-12 md:items-end">
          <div className="reveal md:col-span-8"><p className="mb-8 text-[10px] uppercase tracking-[.25em] text-muted-foreground">01 · The Studio</p><h2 className="display-serif text-[clamp(2.8rem,6vw,6.2rem)] leading-[.96]">WE DON'T JUST DESIGN INTERIORS.<br /><span className="text-muted-foreground">WE CREATE EXPERIENCES.</span></h2></div>
          <div className="reveal space-y-7 md:col-span-4 md:pb-2"><p className="text-sm font-light leading-7 text-muted-foreground">J.J. INTERIORS & MODUTECH is an interior architecture studio composing enduring spaces through proportion, light and exceptional materials. Every project is considered as a complete sensory experience.</p><Button variant="editorial" onClick={() => scrollTo("studio")}>Discover Our Story <ArrowRight /></Button></div>
        </div>
        <div className="reveal mt-20 ml-auto w-full overflow-hidden md:mt-28 md:w-4/5"><img src={materialImage} alt="Travertine, boucle, smoked glass and brass material palette" width={1408} height={1008} loading="lazy" className="aspect-[16/9] w-full object-cover transition-transform duration-1000 hover:scale-[1.025]" /></div>
      </section>

      <section id="projects" className="bg-hero py-28 text-hero-foreground md:py-44">
        <div className="section-shell"><div className="reveal flex items-end justify-between border-b border-hero-foreground/25 pb-8"><div><p className="mb-5 text-[10px] uppercase tracking-[.25em] text-hero-foreground/55">02 · Selected Work</p><h2 className="display-serif text-5xl md:text-7xl">Featured Projects</h2></div><p className="hidden text-[10px] uppercase tracking-[.2em] text-hero-foreground/55 md:block">2023—2026</p></div>
          <div className="mt-20 space-y-24 md:space-y-40">{activeProjects.map((project, index) => <article key={project.name} className={`reveal group grid gap-5 md:grid-cols-12 ${index % 2 ? "md:text-right" : ""}`}>
            <div className={`overflow-hidden ${project.vertical ? "md:col-span-7" : "md:col-span-10"} ${index % 2 ? "md:col-start-6" : ""}`}><img src={project.image} alt={`${project.type} interior — ${project.name}`} width={project.vertical ? 1200 : 1600} height={project.vertical ? 1504 : 1104} loading="lazy" className={`${project.vertical ? "aspect-[4/5] md:aspect-[16/10]" : "aspect-[4/3] md:aspect-[16/9]"} w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]`} /></div>
            <div className={`flex items-start justify-between gap-6 md:col-span-5 ${index % 2 ? "md:col-start-1 md:row-start-1 md:flex-col md:justify-end md:items-end" : "md:flex-col md:justify-end"}`}><div><p className="mb-2 text-[10px] uppercase tracking-[.18em] text-champagne">{project.type}</p><h3 className="display-serif text-3xl md:text-5xl">{project.name}</h3></div><p className="shrink-0 text-[10px] uppercase leading-6 tracking-[.17em] text-hero-foreground/55">{project.location}<br />{project.year}</p></div>
          </article>)}</div>
        </div>
      </section>

      <section id="studio" className="grid bg-card md:grid-cols-2">
        <div className="reveal min-h-[65vh] overflow-hidden"><img src={mukeshPhoto} alt="Mukesh bhai Suthar in Aurelia Studio's material library" width={1104} height={1504} loading="lazy" className="h-full w-full object-cover object-center" /></div>
        <div className="reveal flex items-center px-6 py-24 sm:px-12 md:px-[10%] md:py-32"><div><p className="mb-10 text-[10px] uppercase tracking-[.25em] text-muted-foreground">03 · Our Philosophy</p><h2 className="display-serif text-5xl leading-[1.02] md:text-7xl">DESIGNING WITH PURPOSE.<br />CRAFTING WITH DETAIL.</h2><p className="mt-10 max-w-xl text-sm font-light leading-7 text-muted-foreground">Led by our creative director, our studio works at the intersection of interior, architecture and collectible design. We seek quiet confidence over spectacle—spaces that become richer with time.</p><Button variant="editorial" className="mt-10" onClick={() => scrollTo("process")}>Our Philosophy <ArrowRight /></Button></div></div>
      </section>

      <section id="services" className="section-shell py-28 md:py-44">
        <div className="grid gap-16 md:grid-cols-12"><div className="reveal md:col-span-4"><p className="mb-6 text-[10px] uppercase tracking-[.25em] text-muted-foreground">04 · Expertise</p><h2 className="display-serif text-5xl md:text-7xl">Our Services</h2><div className="mt-12 hidden aspect-[4/5] overflow-hidden md:block"><img src={serviceImages[serviceIndex]} alt="Aurelia interior design service" width={1200} height={1504} loading="lazy" className="h-full w-full object-cover transition-opacity duration-500" /></div></div>
          <div className="reveal md:col-span-7 md:col-start-6">{services.map((service, index) => <button key={service} onMouseEnter={() => setServiceIndex(index)} onFocus={() => setServiceIndex(index)} className="group grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border py-7 text-left md:py-9"><span className="text-[10px] text-muted-foreground">0{index + 1}</span><span className="display-serif text-3xl transition-transform duration-300 group-hover:translate-x-3 md:text-5xl">{service}</span><ArrowRight className="size-4 -translate-x-3 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" /></button>)}</div>
        </div>
      </section>

      <section id="process" className="border-y border-border bg-card py-28 md:py-36"><div className="section-shell"><div className="reveal mb-20 flex items-end justify-between"><div><p className="mb-5 text-[10px] uppercase tracking-[.25em] text-muted-foreground">05 · How We Work</p><h2 className="display-serif text-5xl md:text-7xl">From Idea to Place</h2></div></div><div className="grid md:grid-cols-5">{["Discover", "Concept", "Design", "Detail", "Deliver"].map((step, index) => <div key={step} className="reveal border-t border-border py-8 md:border-l md:border-t-0 md:px-6 md:py-3 first:md:border-l-0"><span className="text-[10px] text-champagne">0{index + 1}</span><h3 className="mt-8 display-serif text-3xl">{step}</h3></div>)}</div></div></section>

      <section className="section-shell py-28 md:py-44"><div className="reveal mb-16 md:flex md:items-end md:justify-between"><div><p className="mb-5 text-[10px] uppercase tracking-[.25em] text-muted-foreground">06 · Details & Atmosphere</p><h2 className="display-serif text-5xl md:text-7xl">A Study in Material</h2></div></div><div className="grid grid-cols-2 items-start gap-3 md:grid-cols-12 md:gap-6"><img src={villaImage} alt="Sunlit limestone villa courtyard" width={1600} height={1104} loading="lazy" className="reveal col-span-2 aspect-[4/3] w-full object-cover md:col-span-7" /><img src={bespokeImage} alt="Custom walnut dressing room" width={1200} height={1504} loading="lazy" className="reveal aspect-[3/4] w-full object-cover md:col-span-4 md:col-start-9 md:mt-28" /><img src={materialImage} alt="Luxury natural material study" width={1408} height={1008} loading="lazy" className="reveal aspect-square w-full object-cover md:col-span-4 md:col-start-2 md:-mt-20" /><img src={officeImage} alt="Dark oak executive office" width={1600} height={1104} loading="lazy" className="reveal col-span-2 aspect-[16/10] w-full object-cover md:col-span-6 md:col-start-7 md:mt-16" /></div></section>

      <section className="bg-stone py-28 md:py-44"><div className="section-shell reveal mx-auto max-w-5xl text-center"><p className="mb-12 text-[10px] uppercase tracking-[.25em] text-muted-foreground">Client Perspective</p><blockquote className="display-serif text-[clamp(2.1rem,4.5vw,5rem)] leading-[1.12]">“J.J. INTERIORS & MODUTECH understood that true luxury is not excess. It is the feeling that every detail belongs exactly where it is.”</blockquote><p className="mt-10 text-[10px] uppercase tracking-[.22em]">Private Residence · Surat</p></div></section>

      <section id="contact" className="relative min-h-[85vh] overflow-hidden bg-hero text-hero-foreground">
        <img src={heroImage} alt="J.J. INTERIORS & MODUTECH luxury residence at dusk" width={1920} height={1088} loading="lazy" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-25" />
        <div className="section-shell relative flex min-h-[85vh] flex-col justify-center py-28">
          <div className="reveal grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-8">
              <p className="mb-8 text-[10px] uppercase tracking-[.25em] text-champagne">Begin a Conversation</p>
              <h2 className="display-serif text-[clamp(3.5rem,9vw,8.5rem)] leading-[.88]">LET'S CREATE<br />SOMETHING TIMELESS.</h2>
              <p className="mt-8 max-w-xl text-sm font-light leading-7 text-hero-foreground/80">With over 25+ years of excellence in crafting bespoke interiors, we bring your vision to life with uncompromising quality and attention to detail.</p>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
                <a href={`mailto:${EMAIL_ADDRESS}`} className="group flex items-center gap-2 border-b border-hero-foreground/50 pb-2 text-xs uppercase tracking-[.18em]">Start a Project <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></a>
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="border-b border-hero-foreground/50 pb-2 text-xs uppercase tracking-[.18em]">WhatsApp</a>
              </div>
            </div>
            <div className="md:col-span-4 mt-8 md:mt-0">
              <img src={mukeshPhoto} alt="Mukesh bhai Suthar" className="w-full max-w-[280px] mx-auto md:max-w-none aspect-[3/4] object-cover rounded-xl shadow-2xl border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-hero px-4 pb-10 text-hero-foreground">
        <div className="section-shell border-t border-hero-foreground/20 pt-12">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <p className="display-serif text-3xl">J.J. INTERIORS & MODUTECH</p>
              <p className="mt-3 text-[10px] uppercase tracking-[.2em] text-hero-foreground/45">Interior Architecture Studio</p>
            </div>
            <div className="space-y-3 text-xs">
              {navItems.map((item) => <button key={item} onClick={() => scrollTo(item)} className="block cursor-pointer hover:opacity-55">{item}</button>)}
            </div>
            <div className="space-y-3 text-xs">
              <a className="hover:opacity-55 flex gap-2 items-center w-fit" href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noreferrer"><Instagram className="h-4 w-4" /> Instagram: @{INSTAGRAM_HANDLE}</a>
              <a className="hover:opacity-55 flex gap-2 items-center w-fit" href={WHATSAPP_LINK} target="_blank" rel="noreferrer"><Phone className="h-4 w-4" /> WhatsApp: {PHONE_NUMBER}</a>
              <a className="hover:opacity-55 flex gap-2 items-center w-fit" href={`mailto:${EMAIL_ADDRESS}`}><Mail className="h-4 w-4" /> Email: {EMAIL_ADDRESS}</a>
            </div>
            <div className="text-xs leading-6 text-hero-foreground/65">Surat, Gujarat<br />Projects Worldwide<br /><br /><a href="/admin/login" className="hover:text-champagne transition-colors font-semibold">Admin Portal →</a></div>
          </div>
          <div className="mt-16 flex flex-col gap-3 border-t border-hero-foreground/20 pt-6 text-[9px] uppercase tracking-[.18em] text-hero-foreground/40 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} J.J. INTERIORS & MODUTECH</p>
            <p>Spaces with enduring soul</p>
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
    </main>
  );
}


