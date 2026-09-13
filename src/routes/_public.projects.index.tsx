import { createFileRoute, Link } from "@tanstack/react-router";
import { SEO } from "@/components/SEO";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRows } from "@/hooks/use-admin";

import residenceImage from "@/assets/project-residence.jpg";
import villaImage from "@/assets/project-villa.jpg";
import officeImage from "@/assets/project-office.jpg";
import bespokeImage from "@/assets/project-bespoke.jpg";

export const Route = createFileRoute("/_public/projects/")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: dbProjects, isLoading } = useRows<any>("projects", { select: "*", order: "created_at" });

  const activeProjects = (dbProjects && dbProjects.length > 0) 
    ? dbProjects.map((p, i) => ({
        id: p.id,
        name: p.name,
        location: p.location || "Surat, Gujarat",
        year: p.year || p.start_date?.substring(0,4) || new Date().getFullYear().toString(),
        type: p.project_type || "Interior Design",
        image: i % 2 === 0 ? residenceImage : villaImage, // Using fallbacks until actual image support
      }))
    : [
        { id: "1", name: "The Aster Residence", location: "Vesu, Surat", year: "2026", type: "Residential Interior Design", image: residenceImage },
        { id: "2", name: "Villa Sereno", location: "Piplod, Surat", year: "2025", type: "Luxury Villa Design", image: villaImage },
        { id: "3", name: "One Meridian", location: "City Light, Surat", year: "2026", type: "Commercial Office Interior", image: officeImage },
        { id: "4", name: "Maison Privée", location: "Adajan, Surat", year: "2025", type: "Bespoke Interior & Modular Kitchen", image: bespokeImage },
      ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Projects | Jay Jasol Interiors & Modutech",
    "description": "Explore our portfolio of premium interior design and modular kitchen projects in Surat.",
    "url": "https://jjinteriors.site/projects"
  };

  return (
    <>
      <SEO 
        title="Portfolio & Projects | Interior Designers in Surat | Jay Jasol Interiors & Modutech"
        description="View our extensive portfolio of luxury residential and commercial interior design projects completed across Surat, Gujarat. See our modular kitchen and wardrobe designs."
        url="https://jjinteriors.site/projects"
        schema={schema}
      />

      <section className="relative min-h-[50vh] bg-stone pt-32 pb-20 flex flex-col justify-end text-foreground border-b border-border">
        <div className="section-shell">
          <p className="mb-6 text-[10px] uppercase tracking-[.25em] text-muted-foreground reveal">Selected Work</p>
          <h1 className="display-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[.95] max-w-4xl reveal">
            OUR PORTFOLIO
          </h1>
          <p className="mt-8 max-w-2xl text-muted-foreground font-light reveal">
            A curated selection of our finest residential and commercial interior projects across Surat and beyond. Showcasing our commitment to material, proportion, and craftsmanship.
          </p>
        </div>
      </section>

      <section className="section-shell py-24 md:py-36">
        {isLoading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <p className="text-muted-foreground tracking-widest uppercase text-xs">Loading projects...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-20">
            {activeProjects.map((project, index) => (
              <article key={project.id} className="reveal group cursor-pointer flex flex-col">
                <div className="overflow-hidden aspect-[4/3] rounded-sm mb-6">
                  <img 
                    src={project.image} 
                    alt={`${project.type} designed by Jay Jasol in ${project.location}`}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]" 
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <p className="mb-2 text-[10px] uppercase tracking-[.18em] text-muted-foreground">{project.type}</p>
                  <h3 className="display-serif text-3xl mb-4 group-hover:text-amber-800 transition-colors">{project.name}</h3>
                  <div className="mt-auto flex justify-between items-end border-t border-border pt-4">
                    <p className="text-[10px] uppercase tracking-[.17em] text-muted-foreground">
                      {project.location} <span className="mx-2">·</span> {project.year}
                    </p>
                    <ArrowRight className="size-4 text-muted-foreground -translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="bg-hero text-hero-foreground py-24 text-center">
        <div className="section-shell reveal space-y-8">
          <h2 className="display-serif text-4xl md:text-5xl">Start Your Project With Us</h2>
          <p className="text-hero-foreground/70 max-w-2xl mx-auto font-light">
            Every great space begins with a conversation. Let's discuss your vision and how our expertise can bring it to reality.
          </p>
          <Button variant="outline" className="mt-8" asChild>
            <Link to="/contact">Get in Touch <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
