import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import heroImage from "@/assets/hero-residence.jpg";

export const Route = createFileRoute("/_public/commercial-interior-designer-surat")({
  component: CommercialInteriorDesignerSuratPage,
});

function CommercialInteriorDesignerSuratPage() {
  return (
    <ServicePageTemplate
      title="Commercial Interior Designer in Surat"
      metaTitle="Commercial Interior Designer in Surat | Office & Retail Design"
      metaDescription="Expert commercial interior designer in Surat. Create inspiring workspaces, retail showrooms, and hospitality venues that elevate your brand."
      urlPath="/commercial-interior-designer-surat"
      heroSubtitle="Strategic Commercial Design"
      heroImage={heroImage}
      overviewText={
        <>
          <p>As a leading <strong>commercial interior designer in surat</strong>, Jay Jasol Interiors & Modutech brings over 25 years of expertise to projects across the city and surrounding regions. We understand the local climate, lifestyle preferences, and material availability, allowing us to deliver spaces that are both beautiful and highly practical.</p>
          <p>Our studio is deeply rooted in Surat's design community, offering turnkey solutions that combine bespoke craftsmanship with state-of-the-art modular manufacturing capabilities.</p>
        </>
      }
      benefits={[
        { title: "Local Presence", description: "Based in Surat, we offer close supervision and rapid response throughout the project lifecycle." },
        { title: "In-House Manufacturing", description: "Our own Modutech facility ensures strict quality control and timely delivery." },
        { title: "Trusted Network", description: "Established relationships with the region's best contractors, artisans, and suppliers." },
        { title: "Contextual Design", description: "Designs that respond to Surat's specific environmental and lifestyle requirements." }
      ]}
      process={[
        { step: "01", title: "Consultation", description: "Understanding your vision, requirements, and budget through an in-depth discussion." },
        { step: "02", title: "Design Concept", description: "Presenting spatial layouts, material palettes, and 3D visualizations for your approval." },
        { step: "03", title: "Detailing", description: "Creating precise technical drawings and finalizing all material and hardware selections." },
        { step: "04", title: "Execution", description: "Manufacturing, site preparation, and meticulous installation by our expert team." }
      ]}
      relatedServices={[
        { name: "Interior Design", url: "/interior-design" },
        { name: "Modular Kitchens", url: "/modular-kitchen" },
        { name: "Residential Interiors", url: "/residential-interiors" },
        { name: "Commercial Interiors", url: "/commercial-interiors" }
      ]}
    />
  );
}
