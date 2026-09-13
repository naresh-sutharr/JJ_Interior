import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import heroImage from "@/assets/project-villa.jpg";

export const Route = createFileRoute("/_public/residential-interiors")({
  component: ResidentialInteriorsPage,
});

function ResidentialInteriorsPage() {
  return (
    <ServicePageTemplate
      title="Residential Interiors"
      metaTitle="Residential Interior Designer in Surat | Luxury Home Interiors"
      metaDescription="Turnkey residential interior design in Surat. From luxury apartments to sprawling villas, Jay Jasol Interiors delivers complete home transformations."
      urlPath="/residential-interiors"
      heroSubtitle="Homes with Enduring Soul"
      heroImage={heroImage}
      overviewText={
        <>
          <p>We specialize in comprehensive residential interior design, transforming houses into homes that possess an enduring soul. Whether it's a modern apartment or a luxury villa, we manage the entire process from concept to handover.</p><p>Our residential projects are defined by meticulous spatial planning, refined material palettes, and a deep understanding of how our clients live day-to-day.</p>
        </>
      }
      benefits={[
        { title: "Uncompromising Quality", description: "We source only premium materials and hardware to ensure longevity and aesthetic excellence." },
        { title: "Turnkey Execution", description: "A seamless, hassle-free experience from initial concept design through to the final installation." },
        { title: "Bespoke Customization", description: "Every detail is tailored to your specific requirements, lifestyle, and spatial constraints." },
        { title: "Timely Delivery", description: "Meticulous project management ensures that your space is delivered on time, without compromising quality." }
      ]}
      process={[
        { step: "01", title: "Consultation", description: "Understanding your vision, requirements, and budget through an in-depth discussion." },
        { step: "02", title: "Design Concept", description: "Presenting spatial layouts, material palettes, and 3D visualizations for your approval." },
        { step: "03", title: "Detailing", description: "Creating precise technical drawings and finalizing all material and hardware selections." },
        { step: "04", title: "Execution", description: "Manufacturing, site preparation, and meticulous installation by our expert team." }
      ]}
      relatedServices={[
        { name: "Modular Kitchens", url: "/modular-kitchen" },
        { name: "Wardrobe Design", url: "/wardrobe-design" },
        { name: "Residential Interiors", url: "/residential-interiors" },
        { name: "Commercial Interiors", url: "/commercial-interiors" }
      ]}
    />
  );
}
