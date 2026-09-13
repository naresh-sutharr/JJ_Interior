import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import heroImage from "@/assets/project-bespoke.jpg";

export const Route = createFileRoute("/_public/modular-kitchen")({
  component: ModularKitchenPage,
});

function ModularKitchenPage() {
  return (
    <ServicePageTemplate
      title="Modular Kitchen Design"
      metaTitle="Luxury Modular Kitchen Designer in Surat | Jay Jasol Interiors"
      metaDescription="Custom luxury modular kitchens in Surat. Premium finishes, ergonomic layouts, and durable materials designed for the modern Indian home."
      urlPath="/modular-kitchen"
      heroSubtitle="The Heart of the Home"
      heroImage={heroImage}
      overviewText={
        <>
          <p>A kitchen is more than a culinary space; it is the heart of the modern home. Our modular kitchen designs prioritize ergonomic efficiency without compromising on luxury aesthetics.</p><p>From sleek, handle-less modern kitchens to warm, transitional styles, we offer a vast range of finishes, high-end hardware, and smart storage solutions designed specifically for Indian cooking habits.</p>
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
