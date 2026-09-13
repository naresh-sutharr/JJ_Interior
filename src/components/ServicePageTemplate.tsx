import { SEO } from "@/components/SEO";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export interface ServicePageProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  urlPath: string;
  heroSubtitle: string;
  heroImage: string;
  overviewText: React.ReactNode;
  benefits: { title: string; description: string }[];
  process: { step: string; title: string; description: string }[];
  relatedServices: { name: string; url: string }[];
}

export function ServicePageTemplate({
  title,
  metaTitle,
  metaDescription,
  urlPath,
  heroSubtitle,
  heroImage,
  overviewText,
  benefits,
  process,
  relatedServices
}: ServicePageProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": title,
    "provider": {
      "@type": "LocalBusiness",
      "name": "JAY JASOL INTERIORS & MODUTECH"
    },
    "areaServed": {
      "@type": "City",
      "name": "Surat"
    },
    "description": metaDescription
  };

  return (
    <>
      <SEO 
        title={metaTitle}
        description={metaDescription}
        url={`https://jjinteriors.site${urlPath}`}
        schema={schema}
      />

      <section className="relative min-h-[60vh] bg-stone pt-32 pb-20 flex flex-col justify-end text-foreground border-b border-border">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt={title} className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="section-shell relative z-10">
          <p className="mb-6 text-[10px] uppercase tracking-[.25em] text-primary font-bold reveal">{heroSubtitle}</p>
          <h1 className="display-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[.95] max-w-4xl reveal">
            {title}
          </h1>
        </div>
      </section>

      <section className="section-shell py-24 md:py-36">
        <div className="grid md:grid-cols-12 gap-16">
          <div className="md:col-span-7 space-y-8 reveal">
            <h2 className="display-serif text-3xl md:text-5xl">Service Overview</h2>
            <div className="text-muted-foreground font-light leading-relaxed space-y-6">
              {overviewText}
            </div>
          </div>
          
          <div className="md:col-span-4 md:col-start-9 reveal">
            <div className="bg-card border border-border p-8 rounded-sm">
              <h3 className="display-serif text-2xl mb-6">Related Services</h3>
              <ul className="space-y-4">
                {relatedServices.map(service => (
                  <li key={service.name}>
                    <Link to={service.url} className="text-muted-foreground hover:text-primary transition-colors flex items-center text-sm font-light">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" /> {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone py-24 md:py-36">
        <div className="section-shell">
          <div className="reveal text-center max-w-3xl mx-auto mb-16">
            <h2 className="display-serif text-3xl md:text-5xl mb-6">Why Choose Us</h2>
            <p className="text-muted-foreground font-light">
              Our approach combines deep technical expertise with refined aesthetics, ensuring every detail is executed to perfection.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-background p-8 rounded-sm border border-border reveal">
                <CheckCircle2 className="h-8 w-8 text-primary mb-6" />
                <h3 className="font-semibold text-lg mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-24 md:py-36">
        <div className="reveal max-w-3xl mb-16">
          <h2 className="display-serif text-3xl md:text-5xl mb-6">Our Process</h2>
          <p className="text-muted-foreground font-light">A transparent, meticulous approach from concept to final handover.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {process.map((p, idx) => (
            <div key={idx} className="reveal border-t border-border pt-6">
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{p.step}</span>
              <h3 className="display-serif text-2xl mt-4 mb-3">{p.title}</h3>
              <p className="text-muted-foreground font-light text-sm">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-hero text-hero-foreground py-24 text-center">
        <div className="section-shell reveal space-y-8">
          <h2 className="display-serif text-4xl md:text-5xl">Start Your Project</h2>
          <p className="text-hero-foreground/70 max-w-2xl mx-auto font-light">
            Contact our design team in Surat to discuss your requirements and schedule a comprehensive consultation.
          </p>
          <Button variant="outline" className="mt-8" asChild>
            <Link to="/contact">Get in Touch <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
