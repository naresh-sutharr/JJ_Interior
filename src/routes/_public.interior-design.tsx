import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import heroImage from "@/assets/hero-residence.jpg";

export const Route = createFileRoute("/_public/interior-design")({
  component: InteriorDesignPage,
});

function InteriorDesignPage() {
  return (
    <ServicePageTemplate
      title="Interior Design Services"
      metaTitle="Premium Interior Designer in Surat | Jay Jasol Interiors & Modutech"
      metaDescription="Expert interior design services in Surat. We craft luxury residential and commercial spaces that are timeless, functional, and deeply personal."
      urlPath="/interior-design"
      heroSubtitle="Comprehensive Interior Architecture"
      heroImage={heroImage}
      overviewText={
        <>
          <p>Jay Jasol Interiors & Modutech offers full-scale interior design services for clients who seek exceptional quality and refined aesthetics. From spatial planning to the final placement of art, our approach is holistic and deeply considered.</p><p>We believe that a well-designed space should reflect its inhabitants while standing the test of time. Our team in Surat collaborates closely with clients to understand their lifestyle, translating their vision into a cohesive design narrative.</p>
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
