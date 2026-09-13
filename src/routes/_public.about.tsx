import { createFileRoute } from "@tanstack/react-router";
import { SEO } from "@/components/SEO";
import portraitImage from "@/assets/studio-portrait.jpg";
import materialImage from "@/assets/material-study.jpg";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/about")({
  component: AboutPage,
});

function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "JAY JASOL INTERIORS & MODUTECH",
      "description": "Premium interior architecture studio in Surat, Gujarat.",
    }
  };

  return (
    <>
      <SEO 
        title="About Us | Jay Jasol Interiors & Modutech | Surat"
        description="Learn about Jay Jasol Interiors & Modutech, our design philosophy, and our 25+ years of experience in crafting premium residential and commercial spaces in Surat."
        url="https://jjinteriors.site/about"
        schema={schema}
      />

      <section className="relative min-h-[60vh] bg-hero pt-32 pb-20 flex flex-col justify-center text-hero-foreground">
        <div className="section-shell">
          <p className="mb-6 text-[10px] uppercase tracking-[.25em] text-champagne reveal">About Our Studio</p>
          <h1 className="display-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[.95] max-w-4xl reveal">
            DESIGNING SPACES THAT TRANSCEND TIME.
          </h1>
        </div>
      </section>

      <section className="section-shell py-24 md:py-36 bg-background text-foreground">
        <div className="grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5 reveal">
            <img 
              src={portraitImage} 
              alt="Jay Jasol Interior Studio Founder" 
              className="w-full aspect-[4/5] object-cover rounded-md shadow-xl"
            />
          </div>
          <div className="md:col-span-7 space-y-8 reveal">
            <h2 className="display-serif text-4xl md:text-5xl">Our Story</h2>
            <p className="text-muted-foreground font-light leading-relaxed">
              JAY JASOL INTERIORS & MODUTECH was founded on a singular vision: to create interior spaces that are not merely decorated, but architecturally conceived and beautifully crafted. Based in Surat, Gujarat, we have spent over 25+ years elevating residential and commercial environments into enduring works of art.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed">
              We believe that true luxury lies in restraint, precision, and an unyielding commitment to quality. Our studio works at the intersection of interior design, architecture, and modular solutions, offering a comprehensive, turnkey approach to space making.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-stone py-24 md:py-36 text-center">
        <div className="section-shell max-w-4xl mx-auto reveal">
          <h2 className="display-serif text-4xl md:text-5xl mb-8">Our Philosophy</h2>
          <p className="text-lg font-light leading-relaxed text-muted-foreground mb-12">
            "We seek quiet confidence over spectacle. A space should feel like it has always belonged exactly as it is, growing richer with time and use. Design is not about adding elements, but about achieving a state where nothing more can be taken away."
          </p>
        </div>
      </section>

      <section className="section-shell py-24 md:py-36">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 space-y-8 reveal">
            <h2 className="display-serif text-4xl md:text-5xl">Why Choose Us?</h2>
            <ul className="space-y-6">
              {[
                { title: "25+ Years of Mastery", desc: "Decades of experience in solving complex design and execution challenges." },
                { title: "Turnkey Excellence", desc: "From concept to handover, we manage every detail so you don't have to." },
                { title: "Modutech Precision", desc: "In-house manufacturing of modular kitchens and wardrobes ensuring millimetric perfection." },
                { title: "Enduring Quality", desc: "We source the finest materials globally, focusing on longevity and tactile beauty." }
              ].map((item, i) => (
                <li key={i} className="border-t border-border pt-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 md:order-2 reveal">
            <img 
              src={materialImage} 
              alt="Material selection process at Jay Jasol Interiors" 
              className="w-full aspect-square object-cover rounded-md shadow-xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-hero text-hero-foreground py-24 text-center">
        <div className="section-shell reveal space-y-8">
          <h2 className="display-serif text-4xl md:text-5xl">Ready to Transform Your Space?</h2>
          <p className="text-hero-foreground/70 max-w-2xl mx-auto font-light">
            Let us help you bring your vision to life. Schedule a design consultation with our experts today.
          </p>
          <Button variant="outline" className="mt-8" asChild>
            <a href="/contact">Book a Consultation <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </section>
    </>
  );
}
