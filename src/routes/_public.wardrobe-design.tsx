import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import heroImage from "@/assets/project-villa.jpg";

export const Route = createFileRoute("/_public/wardrobe-design")({
  component: WardrobeDesignPage,
});

function WardrobeDesignPage() {
  return (
    <ServicePageTemplate
      title="Bespoke Wardrobe Design"
      metaTitle="Custom Wardrobe Design in Surat | Modular Closets & Storage"
      metaDescription="Maximize your space with bespoke modular wardrobes and walk-in closets in Surat by Jay Jasol Interiors & Modutech."
      urlPath="/wardrobe-design"
      heroSubtitle="Elegant Storage Solutions"
      heroImage={heroImage}
      overviewText={
        <>
          <p>Our custom wardrobe designs offer the perfect blend of form and function. Whether you need a sophisticated walk-in closet or a sleek sliding wardrobe, we design storage systems that organize your life beautifully.</p><p>Featuring integrated lighting, premium soft-close hardware, and specialized compartments, our wardrobes are tailored entirely to your personal collection and lifestyle.</p>
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
