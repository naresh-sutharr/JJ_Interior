import { createFileRoute } from "@tanstack/react-router";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import heroImage from "@/assets/project-residence.jpg";

export const Route = createFileRoute("/_public/living-room-interiors")({
  component: LivingRoomInteriorsPage,
});

function LivingRoomInteriorsPage() {
  return (
    <ServicePageTemplate
      title="Living Room Interiors"
      metaTitle="Living Room Interior Designer in Surat | Jay Jasol Interiors"
      metaDescription="Create a stunning, welcoming living room. Jay Jasol Interiors specializes in luxury living room design in Surat, featuring custom furniture and lighting."
      urlPath="/living-room-interiors"
      heroSubtitle="Spaces for Connection"
      heroImage={heroImage}
      overviewText={
        <>
          <p>The living room sets the tone for your entire home. We design living spaces that are sophisticated yet inviting, balancing scale, proportion, and texture to create a harmonious atmosphere.</p><p>From custom TV units and modular seating to statement lighting and curated art, every element is selected to create a space that is perfect for both entertaining and relaxing.</p>
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
