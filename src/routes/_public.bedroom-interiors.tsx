import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import heroImage from "@/assets/hero-residence.jpg";

export const Route = createFileRoute("/_public/bedroom-interiors")({
  component: BedroomInteriorsPage,
});

function BedroomInteriorsPage() {
  return (
    <ServicePageTemplate
      title="Bedroom Interiors"
      metaTitle="Luxury Bedroom Interior Design in Surat | Jay Jasol Interiors"
      metaDescription="Design your ultimate personal sanctuary. Premium bedroom interior design services in Surat focusing on comfort, acoustics, and serene aesthetics."
      urlPath="/bedroom-interiors"
      heroSubtitle="Your Personal Sanctuary"
      heroImage={heroImage}
      overviewText={
        <>
          <p>We approach bedroom design as the creation of a personal sanctuary. Our focus is on achieving a serene atmosphere through soft lighting, acoustic considerations, and luxurious, tactile materials.</p><p>We integrate custom beds, bedside tables, and integrated wardrobes to create a seamless, uncluttered environment that promotes rest and relaxation.</p>
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
