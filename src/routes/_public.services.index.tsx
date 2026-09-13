import { createFileRoute, Link } from "@tanstack/react-router";
import { SEO } from "@/components/SEO";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import residenceImage from "@/assets/project-residence.jpg";
import villaImage from "@/assets/project-villa.jpg";
import officeImage from "@/assets/project-office.jpg";
import bespokeImage from "@/assets/project-bespoke.jpg";
import materialImage from "@/assets/material-study.jpg";
import heroImage from "@/assets/hero-residence.jpg";

export const Route = createFileRoute("/_public/services/")({
  component: ServicesPage,
});

const servicesList = [
  {
    title: "Interior Design",
    description: "Comprehensive interior design services for residential and commercial spaces, ensuring harmony between aesthetics and functionality.",
    link: "/interior-design",
    image: residenceImage
  },
  {
    title: "Modular Kitchens",
    description: "Premium modular kitchen solutions in Surat. Custom-designed for your lifestyle, featuring top-tier materials and ergonomic layouts.",
    link: "/modular-kitchen",
    image: bespokeImage
  },
  {
    title: "Wardrobe Design",
    description: "Bespoke modular wardrobes and walk-in closets. Maximize space with elegant, highly organized storage solutions.",
    link: "/wardrobe-design",
    image: materialImage
  },
  {
    title: "Residential Interiors",
    description: "Complete home interior design, from luxury villas to modern apartments. We create spaces that feel deeply personal and timeless.",
    link: "/residential-interiors",
    image: villaImage
  },
  {
    title: "Commercial Interiors",
    description: "Strategic and striking commercial and office interiors that enhance productivity and reflect your brand's prestige.",
    link: "/commercial-interiors",
    image: officeImage
  },
  {
    title: "Living Room Interiors",
    description: "Elevate your living space with bespoke furniture, tailored lighting, and sophisticated material palettes.",
    link: "/living-room-interiors",
    image: heroImage
  }
];

function ServicesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "provider": {
      "@type": "LocalBusiness",
      "name": "JAY JASOL INTERIORS & MODUTECH"
    },
    "areaServed": {
      "@type": "City",
      "name": "Surat"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Interior Design Services",
      "itemListElement": servicesList.map((s, i) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.title
        },
        "position": i + 1
      }))
    }
  };

  return (
    <>
      <SEO 
        title="Our Services | Interior Design & Modular Kitchens in Surat | Jay Jasol Interiors"
        description="Discover our premium interior design and modular furniture services in Surat. We specialize in residential interiors, commercial spaces, modular kitchens, and bespoke wardrobes."
        url="https://jjinteriors.site/services"
        schema={schema}
      />

      <section className="relative min-h-[50vh] bg-stone pt-32 pb-20 flex flex-col justify-end text-foreground border-b border-border">
        <div className="section-shell">
          <p className="mb-6 text-[10px] uppercase tracking-[.25em] text-muted-foreground reveal">Our Expertise</p>
          <h1 className="display-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[.95] max-w-4xl reveal">
            DESIGN SERVICES & MODULAR SOLUTIONS
          </h1>
          <p className="mt-8 max-w-2xl text-muted-foreground font-light reveal">
            We offer an integrated approach to interior architecture, combining bespoke design with in-house modular manufacturing for absolute precision.
          </p>
        </div>
      </section>

      <section className="section-shell py-24 md:py-36">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {servicesList.map((service, index) => (
            <Link key={service.title} to={service.link} className="reveal group cursor-pointer flex flex-col">
              <div className="overflow-hidden aspect-[4/3] rounded-sm mb-6">
                <img 
                  src={service.image} 
                  alt={`${service.title} Services in Surat`}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]" 
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="display-serif text-3xl mb-4 group-hover:text-amber-800 transition-colors">{service.title}</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="mt-auto flex items-center text-[10px] uppercase tracking-[.17em] font-semibold text-primary">
                  Explore Service <ArrowRight className="size-4 ml-2 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-hero text-hero-foreground py-24 text-center">
        <div className="section-shell reveal space-y-8">
          <h2 className="display-serif text-4xl md:text-5xl">Need a Custom Solution?</h2>
          <p className="text-hero-foreground/70 max-w-2xl mx-auto font-light">
            Whether it's a single bespoke modular kitchen or a full-scale commercial fit-out, our team is equipped to handle projects of all scales with uncompromised quality.
          </p>
          <Button variant="outline" className="mt-8" asChild>
            <Link to="/contact">Request a Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
