import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import heroImage from "@/assets/project-office.jpg";

export const Route = createFileRoute("/_public/office-interiors")({
  component: OfficeInteriorsPage,
});

function OfficeInteriorsPage() {
  return (
    <ServicePageTemplate
      title="Office Interiors"
      metaTitle="Modern Office Interior Designer in Surat | Jay Jasol Interiors"
      metaDescription="Design a productive and inspiring workspace. Corporate and modern office interior design in Surat by Jay Jasol Interiors & Modutech."
      urlPath="/office-interiors"
      heroSubtitle="Inspiring Workspaces"
      heroImage={heroImage}
      overviewText={
        <>
          <p>The modern workplace must inspire creativity, foster collaboration, and reflect corporate identity. We design office interiors that balance open collaborative zones with quiet, focused workspaces.</p><p>Our office designs incorporate ergonomic furniture, acoustic solutions, and advanced lighting control to ensure maximum productivity and employee well-being.</p>
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
