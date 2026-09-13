import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import heroImage from "@/assets/material-study.jpg";

export const Route = createFileRoute("/_public/modular-interiors")({
  component: ModularInteriorsPage,
});

function ModularInteriorsPage() {
  return (
    <ServicePageTemplate
      title="Modular Interiors"
      metaTitle="Modular Interiors in Surat | Premium Solutions by Jay Jasol"
      metaDescription="Transform your space with high-end modular interiors. Jay Jasol Interiors & Modutech offers bespoke modular furniture and storage solutions in Surat."
      urlPath="/modular-interiors"
      heroSubtitle="Precision Engineered Furniture"
      heroImage={heroImage}
      overviewText={
        <>
          <p>Our modular interior solutions bring together the precision of factory manufacturing with the elegance of bespoke design. We create seamless, highly functional storage and furniture systems for modern living.</p><p>Using state-of-the-art machinery and premium imported materials, our modular interiors offer millimeter-perfect finishes that elevate the standard of any residential or commercial space.</p>
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
