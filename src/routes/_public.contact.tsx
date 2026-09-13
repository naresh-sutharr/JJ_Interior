import { createFileRoute } from "@tanstack/react-router";
import { SEO } from "@/components/SEO";
import { Phone, Mail, MapPin, Instagram, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-residence.jpg";

export const Route = createFileRoute("/_public/contact")({
  component: ContactPage,
});

const BUSINESS_PHONE = "+91 98984 12998";
const WHATSAPP_LINK = `https://wa.me/919898412998?text=${encodeURIComponent("Hello JAY JASOL INTERIORS & MODUTECH, I would like to inquire about your services...")}`;
const EMAIL_ADDRESS = "mukesh.jj.interiors@gmail.com";
const INSTAGRAM_HANDLE = "mukesh_p_suthar_89";
const ADDRESS = "Surat, Gujarat, India";
const BUSINESS_HOURS = "Monday - Saturday: 9:30 AM - 7:30 PM";

function ContactPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "JAY JASOL INTERIORS & MODUTECH",
    "image": "https://jjinteriors.site/mukeshlogo.jpg",
    "telephone": "+919898412998",
    "email": EMAIL_ADDRESS,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:30",
      "closes": "19:30"
    },
    "sameAs": [
      `https://instagram.com/${INSTAGRAM_HANDLE}`
    ]
  };

  return (
    <>
      <SEO 
        title="Contact Jay Jasol Interiors & Modutech | Interior Designers in Surat"
        description="Get in touch with Jay Jasol Interiors & Modutech. Book a design consultation for premium interior design, modular kitchens, and turnkey projects in Surat."
        url="https://jjinteriors.site/contact"
        schema={schema}
      />

      <section className="relative min-h-[50vh] bg-stone pt-32 pb-20 flex flex-col justify-end text-foreground border-b border-border">
        <div className="section-shell">
          <p className="mb-6 text-[10px] uppercase tracking-[.25em] text-muted-foreground reveal">Begin a Conversation</p>
          <h1 className="display-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[.95] max-w-4xl reveal">
            CONTACT US
          </h1>
        </div>
      </section>

      <section className="section-shell py-24 md:py-36">
        <div className="grid md:grid-cols-12 gap-16 lg:gap-24">
          
          <div className="md:col-span-5 space-y-12 reveal">
            <div>
              <h2 className="display-serif text-3xl mb-6">Our Studio</h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                Whether you have a specific project in mind or simply want to explore what's possible, our design team is here to guide you.
              </p>
            </div>

            <div className="space-y-6">
              <a href={`tel:${BUSINESS_PHONE.replace(/ /g, '')}`} className="flex items-start gap-4 group">
                <Phone className="h-5 w-5 mt-1 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-sm">Phone</p>
                  <p className="text-muted-foreground font-light group-hover:text-foreground transition-colors">{BUSINESS_PHONE}</p>
                </div>
              </a>
              
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex items-start gap-4 group">
                <svg className="h-5 w-5 mt-1 text-primary group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                <div>
                  <p className="font-semibold text-sm">WhatsApp</p>
                  <p className="text-muted-foreground font-light group-hover:text-foreground transition-colors">Chat with our experts</p>
                </div>
              </a>

              <a href={`mailto:${EMAIL_ADDRESS}`} className="flex items-start gap-4 group">
                <Mail className="h-5 w-5 mt-1 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-sm">Email</p>
                  <p className="text-muted-foreground font-light group-hover:text-foreground transition-colors">{EMAIL_ADDRESS}</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Location</p>
                  <p className="text-muted-foreground font-light">{ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 mt-1 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Business Hours</p>
                  <p className="text-muted-foreground font-light">{BUSINESS_HOURS}</p>
                </div>
              </div>

              <a href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 group">
                <Instagram className="h-5 w-5 mt-1 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-sm">Instagram</p>
                  <p className="text-muted-foreground font-light group-hover:text-foreground transition-colors">@{INSTAGRAM_HANDLE}</p>
                </div>
              </a>
            </div>
          </div>

          <div className="md:col-span-7 reveal">
            <div className="bg-card border border-border p-8 md:p-12 rounded-sm shadow-sm">
              <h2 className="display-serif text-3xl mb-8">Request a Quote</h2>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Form submitted successfully! We will get back to you soon."); }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Name</label>
                    <input type="text" id="name" required className="w-full bg-background border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Phone</label>
                    <input type="tel" id="phone" required className="w-full bg-background border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="Your phone number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Email</label>
                  <input type="email" id="email" required className="w-full bg-background border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="Your email address" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="projectType" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Project Type</label>
                    <select id="projectType" required className="w-full bg-background border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-sm text-muted-foreground">
                      <option value="">Select a service...</option>
                      <option value="residential">Residential Interior</option>
                      <option value="commercial">Commercial/Office</option>
                      <option value="modular_kitchen">Modular Kitchen</option>
                      <option value="wardrobes">Modular Wardrobes</option>
                      <option value="turnkey">Turnkey Project</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Location</label>
                    <input type="text" id="location" required className="w-full bg-background border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="e.g. Vesu, Surat" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Project Details</label>
                  <textarea id="message" rows={4} className="w-full bg-background border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-sm resize-none" placeholder="Tell us about your requirements, timeline, and approximate budget..."></textarea>
                </div>

                <Button type="submit" variant="default" className="w-full h-12 uppercase tracking-widest text-xs font-bold mt-4">
                  Submit Inquiry <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
          
        </div>
      </section>
      
      <div className="w-full h-[50vh] min-h-[400px]">
        {/* Placeholder for real Google Maps embed */}
        <img src={heroImage} alt="Jay Jasol Interiors Studio" className="w-full h-full object-cover grayscale opacity-80" />
      </div>
    </>
  );
}
