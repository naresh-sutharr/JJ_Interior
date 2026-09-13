import { createFileRoute, Link } from "@tanstack/react-router";
import { SEO } from "@/components/SEO";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-residence.jpg";
import bespokeImage from "@/assets/project-bespoke.jpg";
import materialImage from "@/assets/material-study.jpg";

export const Route = createFileRoute("/_public/blog/")({
  component: BlogPage,
});

const blogPosts = [
  {
    id: "interior-design-ideas-surat",
    title: "Best Interior Design Ideas for Homes in Surat",
    excerpt: "Discover the latest trends in residential interior design tailored for the unique climate and lifestyle of Surat, Gujarat.",
    date: "Sep 15, 2026",
    category: "Design Trends",
    image: heroImage
  },
  {
    id: "modern-modular-kitchen-ideas",
    title: "Modern Modular Kitchen Ideas for Surat Homes",
    excerpt: "A comprehensive guide to selecting the right materials, layouts, and finishes for a premium modular kitchen that lasts.",
    date: "Aug 22, 2026",
    category: "Modular Kitchen",
    image: bespokeImage
  },
  {
    id: "how-to-choose-interior-designer",
    title: "How to Choose the Right Interior Designer in Surat",
    excerpt: "What to look for when hiring an interior architect for your luxury villa or commercial office space.",
    date: "Jul 10, 2026",
    category: "Guides",
    image: materialImage
  }
];

function BlogPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Jay Jasol Interiors Design Blog",
    "description": "Insights, trends, and advice on premium interior design and modular furniture from Surat's leading design studio.",
    "url": "https://jjinteriors.site/blog",
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": new Date(post.date).toISOString(),
      "url": `https://jjinteriors.site/blog/${post.id}`
    }))
  };

  return (
    <>
      <SEO 
        title="Interior Design Blog | Jay Jasol Interiors & Modutech | Surat"
        description="Read our latest articles on luxury interior design trends, modular kitchen ideas, and residential architecture tailored for homes in Surat, Gujarat."
        url="https://jjinteriors.site/blog"
        schema={schema}
      />

      <section className="relative min-h-[50vh] bg-stone pt-32 pb-20 flex flex-col justify-end text-foreground border-b border-border">
        <div className="section-shell">
          <p className="mb-6 text-[10px] uppercase tracking-[.25em] text-muted-foreground reveal">Journal & Insights</p>
          <h1 className="display-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[.95] max-w-4xl reveal">
            DESIGN JOURNAL
          </h1>
          <p className="mt-8 max-w-2xl text-muted-foreground font-light reveal">
            Perspectives on interior architecture, material studies, and the philosophy behind creating enduring spaces.
          </p>
        </div>
      </section>

      <section className="section-shell py-24 md:py-36">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {blogPosts.map((post) => (
            <article key={post.id} className="reveal group flex flex-col cursor-pointer">
              <div className="overflow-hidden aspect-[4/3] rounded-sm mb-6 relative">
                <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur text-foreground px-3 py-1 text-[9px] uppercase tracking-widest font-semibold rounded-sm">
                  {post.category}
                </div>
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]" 
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">{post.date}</p>
                <h3 className="display-serif text-2xl mb-4 group-hover:text-amber-800 transition-colors leading-tight">{post.title}</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center text-[10px] uppercase tracking-[.17em] font-semibold text-primary">
                  Read Article <ArrowRight className="size-4 ml-2 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
