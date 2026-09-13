import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import heroImage from "@/assets/project-office.jpg";

export const Route = createFileRoute("/_public/commercial-interiors")({
  component: CommercialInteriorsPage,
});

function CommercialInteriorsPage() {
  return (
    <ServicePageTemplate
      title="Commercial Interiors"
      metaTitle="Commercial Interior Designer in Surat | Retail & Hospitality"
      metaDescription="Elevate your business with strategic commercial interior design in Surat. Retail spaces, showrooms, and hospitality design by Jay Jasol Interiors."
      urlPath="/commercial-interiors"
      heroSubtitle="Strategic Brand Environments"
      heroImage={heroImage}
      overviewText={
        <>
          <p>Your commercial space is a physical manifestation of your brand. We design strategic commercial interiors that attract customers, enhance user experience, and drive business success.</p><p>From high-end retail showrooms to boutique hospitality venues, our commercial designs are characterized by striking aesthetics, durable materials, and optimal traffic flow.</p>
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
